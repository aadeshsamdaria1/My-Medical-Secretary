package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.AppointmentValidation
import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.dto.appointment.UserNoteDTO
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.justRun
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.ResponseEntity
import java.time.Instant
import java.util.*
import kotlin.random.Random

@ExtendWith(MockKExtension::class)
class AppointmentControllerTest {

    private lateinit var appointmentController: AppointmentController

    private val appointmentId1 = Random.nextInt()
    private val missingAppointmentId = appointmentId1 + 1
    private val patientId = Random.nextInt()
    private val providerId = Random.nextInt()
    private val newAppointmentId = Random.nextInt()
    private val newAppointmentDTOId = Random.nextInt()
    private val updateAppointmentId = Random.nextInt()

    @MockK
    private lateinit var appointmentEntityRepository: AppointmentEntityRepository

    @MockK
    private lateinit var appointmentMapper: AppointmentMapper

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var doctorEntityRepository: DoctorEntityRepository

    @MockK
    private lateinit var appointmentValidation: AppointmentValidation

    @MockK
    private lateinit var appointment1: AppointmentEntity

    @MockK
    private lateinit var appointment2: AppointmentEntity

    @MockK
    private lateinit var appointment3: AppointmentEntity

    @MockK
    private lateinit var newAppointmentDTO: AppointmentDTO

    @MockK
    private lateinit var patient: PatientEntity

    @MockK
    private lateinit var doctor: DoctorEntity

    @MockK
    private lateinit var newAppointment: AppointmentEntity

    @MockK
    private lateinit var updateAppointment: AppointmentEntity

    @BeforeEach
    fun setup() {
        appointmentController = AppointmentController(
            appointmentEntityRepository,
            appointmentMapper,
            userEntityRepository,
            doctorEntityRepository,
            appointmentValidation
        )

        every { appointmentEntityRepository.findById(appointmentId1) } returns Optional.of(appointment1)
        every { appointmentEntityRepository.findById(missingAppointmentId) } returns Optional.empty()
        every { appointment1.id } returns appointmentId1
        every { appointmentEntityRepository.findAll() } returns listOf(appointment1, appointment2, appointment3)

        // Only appointments 1 and 2 relate to our test patient
        every { appointment1.patient.patientId } returns patientId
        every { appointment2.patient.patientId } returns patientId
        every { appointment3.patient.patientId } returns patientId + 1

        every { appointment1.dateCreate } returns Instant.now()
        every { appointment2.dateCreate } returns Instant.now()
        every { appointment3.dateCreate } returns Instant.now()

        every { newAppointmentDTO.patientId } returns patientId
        every { newAppointmentDTO.providerId } returns providerId
        every { userEntityRepository.findByPatientId(patientId) } returns patient
        every { doctorEntityRepository.findById(providerId) } returns Optional.of(doctor)

        every { appointmentValidation.isValidAppointment(newAppointment) } returns true
        every { appointmentMapper.mapAppointmentDTO(newAppointmentDTO, patient, doctor) } returns newAppointment
        every { appointmentEntityRepository.save(newAppointment) } returns newAppointment
        every { appointmentEntityRepository.findById(newAppointmentDTOId) } returns Optional.empty()
        every { newAppointmentDTO.id } returns newAppointmentDTOId
        every { newAppointment.id } returns newAppointmentId

        every { appointmentMapper.updateExistingAppointment(newAppointment, newAppointment) } returns newAppointment
        every { appointmentEntityRepository.findById(updateAppointmentId) } returns Optional.of(updateAppointment)
        every { appointmentEntityRepository.save(updateAppointment) } returns updateAppointment

        justRun { updateAppointment.userNote = any() }
    }

    @Test
    fun `Get an appointment from id`() {
        val appointment = appointmentController.getAppointment(appointmentId1)
        assertEquals(appointmentId1, appointment?.id)
    }

    @Test
    fun `Return null if appointment does not exist`() {
        val appointment = appointmentController.getAppointment(missingAppointmentId)
        assertNull(appointment?.id)
    }

    @Test
    fun `Get all appointments for a user ID`() {
        val appointments = appointmentController.getAllAppointmentsForUser(patientId)
        val expectedAppointments = listOf(
            appointment1,
            appointment2
        )
        assertEquals(expectedAppointments, appointments)
    }

    @Test
    fun `Successfully create appointment`() {
        val response = appointmentController.createAppointment(newAppointmentDTO)
        val expectedResponse = ResponseEntity.ok("Successfully created new appointment with " +
                "Genie ID: $newAppointmentId.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Successfully update existing appointment`() {
        every { appointmentEntityRepository.findById(newAppointmentDTOId) } returns Optional.of(newAppointment)

        val response = appointmentController.createAppointment(newAppointmentDTO)
        val expectedResponse = ResponseEntity.ok("Successfully updated appointment with " +
                "Genie ID: $newAppointmentId.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Fail to create appointment with non-existent patient`() {
        every { userEntityRepository.findByPatientId(patientId) } returns null

        val response = appointmentController.createAppointment(newAppointmentDTO)
        val expectedResponse = ResponseEntity.badRequest().body("Could not create appointment. " +
                "Patient with id $patientId does not exist or is not a patient.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Fail to create appointment with non-existent doctor`() {
        every { doctorEntityRepository.findById(providerId) } returns Optional.empty()

        val response = appointmentController.createAppointment(newAppointmentDTO)
        val expectedResponse = ResponseEntity.badRequest().body("Could not create appointment. " +
                "Provider(doctor) with id $providerId does not exist.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Do not create appointment if fields invalid`() {
        every { appointmentValidation.isValidAppointment(newAppointment) } returns false
        val response = appointmentController.createAppointment(newAppointmentDTO)
        val expectedResponse = ResponseEntity.badRequest().body("Could not create appointment. Invalid fields.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Successfully update a user note`() {
        val userNoteDTO = UserNoteDTO(updateAppointmentId, "A new user note")
        val response = appointmentController.updateUserNote(userNoteDTO)
        val expectedResponse = ResponseEntity.ok("Successfully updated user note for " +
                "appointment ${userNoteDTO.appointmentId}.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Fail to sync update user note of non-existent appointment`() {
        every { appointmentEntityRepository.findById(updateAppointmentId) } returns Optional.empty()

        val userNoteDTO = UserNoteDTO(updateAppointmentId, "A new user note")
        val response = appointmentController.updateUserNote(userNoteDTO)
        val expectedResponse = ResponseEntity.badRequest().body("Could not update user note for " +
                "appointment with ID ${userNoteDTO.appointmentId}. Appointment does not exist.")
        assertEquals(expectedResponse, response)
    }
}
