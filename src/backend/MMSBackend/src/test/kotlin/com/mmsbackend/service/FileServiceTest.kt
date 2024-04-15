package com.mmsbackend.service

import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import com.mmsbackend.mapping.UserMapper
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
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
    private lateinit var passwordService: PasswordService

    @BeforeEach
    fun setup() {
        userMapper = UserMapper(passwordService)
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

        // Patient ID from HTML
        private val patientId1 = 421
        private val patientId2 = 4213

        @BeforeEach
        fun setup() {
            every { userEntityRepository.findByPatientId(patientId1) } returns null
            every { userEntityRepository.findByPatientId(patientId2) } returns null
            every { userEntityRepository.save( any() ) } answers { invocation.args[0] as PatientEntity }
            every { passwordService.generateSecurePassword() } returns UUID.randomUUID().toString()
        }

        @Test
        fun `Successfully read and upload a user file`() {
            val userIds = fileService.readAndUploadUserFile(userBytes)
            assertThat(userIds).isEqualTo(listOf(patientId1, patientId2))
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
        }

        @Test
        fun `Successfully read and upload an appointment file`() {
            val appointmentIds = fileService.readAndUploadAppointmentFile(appointmentBytes)
            assertThat(appointmentIds).isEqualTo(listOf(appointmentId1, appointmentId2))
        }

        @Test
        fun `Do not upload appointments for which linked patient doesnt exist`() {
            every { userEntityRepository.findByPatientId(patientId2) } returns null

            val appointmentIds = fileService.readAndUploadAppointmentFile(appointmentBytes)
            assertThat(appointmentIds).isEqualTo(listOf(appointmentId1))
        }

        @Test
        fun `Do not upload appointments for which linked doctor doesnt exist`() {
            every { doctorEntityRepository.findById(doctorId1) } returns Optional.empty()

            val appointmentIds = fileService.readAndUploadAppointmentFile(appointmentBytes)
            assertThat(appointmentIds).isEqualTo(listOf(appointmentId2))
        }
    }
}
