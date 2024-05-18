package com.mmsbackend.service

import com.mmsbackend.exception.ColumnError
import com.mmsbackend.exception.DoctorMissingException
import com.mmsbackend.exception.PatientMissingException
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import com.mmsbackend.mapping.UserMapper
import com.mmsbackend.service.security.UsernameService
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.security.crypto.password.PasswordEncoder
import java.io.File
import java.util.*

@ExtendWith(MockKExtension::class)
class FileServiceTest {

    private lateinit var fileService: FileService
    private lateinit var userMapper: UserMapper
    private lateinit var appointmentMapper: AppointmentMapper

    private val filePath = "./src/test/resources"

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var doctorEntityRepository: DoctorEntityRepository

    @MockK
    private lateinit var appointmentEntityRepository: AppointmentEntityRepository

    @MockK
    private lateinit var usernameService: UsernameService

    @MockK
    private lateinit var encoder: PasswordEncoder

    @BeforeEach
    fun setup() {
        every { encoder.encode(any()) } returns "An encoded password"
        userMapper = UserMapper(usernameService, encoder)
        appointmentMapper = AppointmentMapper(
            userEntityRepository, doctorEntityRepository
        )
        fileService = FileService(
            userMapper, userEntityRepository, appointmentMapper, appointmentEntityRepository
        )
    }

    @Nested
    inner class User {

        private val fileName = "SamplePatients.html"
        private val userBytes = String(File(filePath, fileName).readBytes())

        private val fileNameMissReqCol = "SamplePatientsMissingReqCol.html"
        private val userBytesMissReqCol = String(File(filePath, fileNameMissReqCol).readBytes())

        private val fileNameMissReqVal = "SamplePatientsMissingReqVal.html"
        private val userBytesMissReqVal = String(File(filePath, fileNameMissReqVal).readBytes())

        private val fileNameMissOptCol = "SamplePatientsMissingOptCol.html"
        private val userBytesMissOptCol = String(File(filePath, fileNameMissOptCol).readBytes())

        // Patient ID from HTML
        private val patientId1 = 421
        private val patientId2 = 4213

        @BeforeEach
        fun setup() {
            every { userEntityRepository.findByPatientId(patientId1) } returns null
            every { userEntityRepository.findByPatientId(patientId2) } returns null
            every { userEntityRepository.save( any() ) } answers { invocation.args[0] as PatientEntity }
            every { usernameService.generateUsernameFromName(any(), any()) } returns UUID.randomUUID().toString()
            every { encoder.encode(any()) } returns "An encoded password"
        }

        @Test
        fun `Successfully read and upload a user file`() {
            val userIds = fileService.readAndUploadUserFile(userBytes)
            val expectedUserIds = Pair(listOf<Int>(), listOf(patientId1, patientId2))
            assertThat(userIds).isEqualTo(expectedUserIds)
        }

        @Test
        fun `Fail to upload a user file with a missing column`() {
            assertThrows<ColumnError> { fileService.readAndUploadUserFile(userBytesMissReqCol) }
        }

        @Test
        fun `Successfully read and upload a user file but some user files are failed to be uploaded`() {
            val userIds = fileService.readAndUploadUserFile(userBytesMissReqVal)
            val expectedUserIds = Pair(listOf(patientId1), listOf(patientId2))
            assertThat(userIds).isEqualTo(expectedUserIds)
        }

        @Test
        fun `Successfully read and upload a user file even with missing optional col`() {
            val userIds = fileService.readAndUploadUserFile(userBytesMissOptCol)
            val expectedUserIds = Pair(listOf<Int>(), listOf(patientId1, patientId2))
            assertThat(userIds).isEqualTo(expectedUserIds)
        }

        @Test
        fun `Fail to upload corrupted patient data`() {
            val corruptedUserBytes = userBytes.reversed()
            assertThrows<Exception> { fileService.readAndUploadUserFile(corruptedUserBytes) }
        }
    }

    @Nested
    inner class Appointment {

        private val fileName = "SampleAppointments.html"
        private val appointmentBytes = String(File(filePath, fileName).readBytes())

        private val fileNameMissCol = "SampleAppointmentsMissingCol.html"
        private val appointmentBytesMissCol = String(File(filePath, fileNameMissCol).readBytes())

        private val fileNameMissVal = "SampleAppointmentsMissingVal.html"
        private val appointmentBytesMissVal = String(File(filePath, fileNameMissVal).readBytes())

        // IDs from HTML
        private val appointmentId1 = 170042
        private val appointmentId2 = 1700423
        private val patientId1 = 13730
        private val patientId2 = 137303
        private val doctorId1 = 5
        private val doctorId2 = 53


        @MockK
        private lateinit var patient1: PatientEntity

        @MockK
        private lateinit var patient2: PatientEntity

        @MockK
        private lateinit var doctor1: DoctorEntity

        @MockK
        private lateinit var doctor2: DoctorEntity

        @BeforeEach
        fun setup() {
            every { appointmentEntityRepository.findById(appointmentId1) } returns Optional.empty()
            every { appointmentEntityRepository.findById(appointmentId2) } returns Optional.empty()
            every { userEntityRepository.findByPatientId(patientId1) } returns patient1
            every { userEntityRepository.findByPatientId(patientId2) } returns patient2
            every { doctorEntityRepository.findById(doctorId1) } returns Optional.of(doctor1)
            every { doctorEntityRepository.findById(doctorId2) } returns Optional.of(doctor2)

            every { appointmentEntityRepository.save( any() ) } answers { invocation.args[0] as AppointmentEntity }
            every { encoder.encode(any()) } returns "An encoded password"
            every { appointmentEntityRepository.getFutureAppointmentIds() } returns listOf(appointmentId1)
        }

        @Test
        fun `Successfully read and upload an appointment file`() {
            val appointmentIds = fileService.readAndUploadAppointmentFile(appointmentBytes)
            val expectedIds = Pair(listOf<Int>(), listOf(appointmentId1, appointmentId2))
            assertThat(appointmentIds).isEqualTo(expectedIds)
        }

        @Test
        fun `Fail to upload a appointment file with a missing column`() {
            assertThrows<ColumnError> { fileService.readAndUploadAppointmentFile(appointmentBytesMissCol) }
        }

        @Test
        fun `Successfully read and upload an appointment file but some appointment files are failed to be uploaded`() {
            val appointmentIds = fileService.readAndUploadAppointmentFile(appointmentBytesMissVal)
            val expectedIds = Pair(listOf(appointmentId1), listOf(appointmentId2))
            assertThat(appointmentIds).isEqualTo(expectedIds)
        }

        @Test
        fun `Throw exception if patient does not exist`() {
            every { userEntityRepository.findByPatientId(patientId2) } returns null
            assertThrows<PatientMissingException>{fileService.readAndUploadAppointmentFile(appointmentBytes)}
        }

        @Test
        fun `Do not upload appointments for which linked doctor doesnt exist`() {
            every { doctorEntityRepository.findById(doctorId1) } returns Optional.empty()
            assertThrows<DoctorMissingException>{fileService.readAndUploadAppointmentFile(appointmentBytes)}
        }
    }
}
