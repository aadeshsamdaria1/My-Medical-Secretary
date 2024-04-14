package com.mmsbackend.service

import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.entity.UserEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import com.mmsbackend.mapping.UserMapper
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.slot
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.io.File
import java.nio.file.Files
import java.nio.file.Paths
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.*
import kotlin.random.Random

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

    @BeforeEach
    fun setup() {
        userMapper = UserMapper()
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
        private val patientId = 421

        @BeforeEach
        fun setup() {
            every { userEntityRepository.findByPatientId(patientId) } returns null
            every { userEntityRepository.save( any() ) } answers { invocation.args[0] as PatientEntity }
        }

        @Test
        fun `Successfully read and upload a user file`() {
            val userIds = fileService.readAndUploadUserFile(userBytes)
            assertThat(userIds).isEqualTo(listOf(patientId))
        }
    }

    @Nested
    inner class Appointment {

        private val fileName = "SampleAppointments.html"
        private val appointmentBytes = String(File(filePath, fileName).readBytes())

        // IDs from HTML
        private val appointmentId = 170042
        private val patientId = 13730
        private val doctorId = 5

        @MockK
        private lateinit var patient: PatientEntity

        @MockK
        private lateinit var doctor: DoctorEntity

        @BeforeEach
        fun setup() {
            every { appointmentEntityRepository.findById(appointmentId) } returns Optional.empty()
            every { appointmentEntityRepository.save( any() ) } answers { invocation.args[0] as AppointmentEntity }
            every { userEntityRepository.findByPatientId(patientId) } returns patient
            every { doctorEntityRepository.findById(doctorId) } returns Optional.of(doctor)
        }

        @Test
        fun `Successfully read and upload an appointment file`() {
            val appointmentIds = fileService.readAndUploadAppointmentFile(appointmentBytes)
            assertThat(appointmentIds).isEqualTo(listOf(appointmentId))
        }
    }
}
