package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.DoctorValidation
import com.mmsbackend.dto.doctor.DoctorDTO
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.mapping.DoctorMapper
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.justRun
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.ResponseEntity
import java.util.Optional
import kotlin.random.Random

@ExtendWith(MockKExtension::class)
class DoctorControllerTest {

    private lateinit var doctorController: DoctorController
    private lateinit var doctorValidation: DoctorValidation

    private val doctorId = Random.nextInt()
    private val missingDoctorId = doctorId + 1

    private val doctorId2 = Random.nextInt()
    private val doctorId3 = Random.nextInt()

    private val patientId = Random.nextInt()
    private val missingPatientId = patientId + 1

    @MockK
    private lateinit var doctorEntityRepository: DoctorEntityRepository

    @MockK
    private lateinit var appointmentEntityRepository: AppointmentEntityRepository

    @MockK
    private lateinit var doctorMapper: DoctorMapper

    @MockK
    private lateinit var doctorEntity: DoctorEntity

    @MockK
    private lateinit var doctor2: DoctorEntity

    @MockK
    private lateinit var doctor3: DoctorEntity

    @MockK
    private lateinit var doctorDTO: DoctorDTO

    @MockK
    private lateinit var appointment1: AppointmentEntity

    @MockK
    private lateinit var appointment2: AppointmentEntity

    @MockK
    private lateinit var appointment3: AppointmentEntity


    @BeforeEach
    fun setup() {
        doctorValidation = DoctorValidation()
        doctorController = DoctorController(
            doctorEntityRepository = doctorEntityRepository,
            doctorValidation = doctorValidation,
            doctorMapper = doctorMapper,
            appointmentEntityRepository = appointmentEntityRepository
        )

        every { doctorEntityRepository.findById(doctorId) } returns Optional.of(doctorEntity)
        every { doctorEntityRepository.findById(missingDoctorId) } returns Optional.empty()
        every { doctorEntity.id } returns doctorId
        every { doctorMapper.mapDoctorDTO(any()) } returns doctorEntity
        every { doctorEntityRepository.save(any())} returns doctorEntity

        every { appointment1.patient.patientId } returns patientId
        every { appointment2.patient.patientId } returns patientId
        every { appointment3.patient.patientId } returns patientId + 1
        every { appointment1.doctor.id } returns doctorId
        every { appointment2.doctor.id } returns doctorId2
        every { appointment3.doctor.id } returns doctorId3

        every { doctor2.id } returns doctorId2
        every { doctor3.id } returns doctorId3

    }

    @Test
    fun `Get a doctor from id`() {
        val doctor = doctorController.getDoctor(doctorId)
        assertEquals(doctorId, doctor?.id)
    }

    @Test
    fun `Return null if doctor doesn't exist`() {
        val doctor = doctorController.getDoctor(missingDoctorId)
        assertNull(doctor?.id)
    }

    @Test
    fun `Get all doctors by patient ID`() {
        val appointments = listOf(
            appointment1,
            appointment2,
            appointment3
        )
        every { appointmentEntityRepository.findAll() } returns appointments

        val doctors = listOf(
            doctorEntity,
            doctor2,
            doctor3
        )
        every { doctorEntityRepository.findAll() } returns doctors

        val response = doctorController.getAllDoctorsByPatientId(patientId)
        val expectedResponse = listOf(
            doctorEntity,
            doctor2
        )

        assertEquals(2, response.size)
        assertEquals(listOf(expectedResponse[0], expectedResponse[1]), response)
    }

    @Test
    fun `Create doctor from valid DTO`() {
        val response = doctorController.createDoctor(doctorDTO)
        val expectedResponse = ResponseEntity.ok("Successfully added new doctor with ID: $doctorId")
        assertEquals(response, expectedResponse)
    }

    @Test
    fun `Fail to create new doctor if doctor invalid`() {
        every { doctorEntity.id } returns 0
        val response = doctorController.createDoctor(doctorDTO)
        val expectedResponse = ResponseEntity.badRequest().body("Could not create doctor. missing id")
        assertEquals(response, expectedResponse)
    }

    @Test
    fun `Delete doctor by id`() {
        justRun { doctorEntityRepository.deleteById(doctorId) }
        val response = doctorController.deleteDoctor(doctorId)
        val expectedResponse = ResponseEntity.ok("Doctor with ID $doctorId deleted successfully.")
        assertEquals(response, expectedResponse)
    }

    @Test
    fun `Fail to delete doctor if doctor has appointments`() {
        every { doctorEntityRepository.deleteById(doctorId) } throws DataIntegrityViolationException("Mocked data " +
                "integrity violation")
        val response = doctorController.deleteDoctor(doctorId)
        val expectedResponse = ResponseEntity.badRequest().body("Doctor with ID $doctorId " +
                "cannot be deleted because they still have Appointments")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Fail to delete doctor if other exception occurs`() {
        every { doctorEntityRepository.deleteById(doctorId) } throws RuntimeException("Mocked exception")
        val response = doctorController.deleteDoctor(doctorId)
        val expectedResponse = ResponseEntity.badRequest().body("Doctor with ID $doctorId " +
                "could not be deleted: Mocked exception")
        assertEquals(expectedResponse, response)
    }
}
