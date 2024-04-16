package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.UserValidation
import com.mmsbackend.dto.user.AdminDTO
import com.mmsbackend.dto.user.PatientDTO
import com.mmsbackend.jpa.entity.AdminEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.UserMapper
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.ResponseEntity
import java.util.*
import kotlin.random.Random

@ExtendWith(MockKExtension::class)
class UserControllerTest {

    private lateinit var userController: UserController
    private lateinit var userValidation: UserValidation

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var userMapper: UserMapper

    @BeforeEach
    fun setup() {
        userValidation = UserValidation()
        userController = UserController(
            userEntityRepository = userEntityRepository,
            userValidation = userValidation,
            userMapper = userMapper
        )
    }

    @Nested
    inner class Patient {

        private val patientId = Random.nextInt()
        private val missingPatientId = patientId + 1
        private val mmsId = missingPatientId + 1

        @MockK
        private lateinit var patientEntity: PatientEntity

        @MockK
        private lateinit var patientDTO: PatientDTO

        @BeforeEach
        fun setup() {
            every { userEntityRepository.findByPatientId(patientId) } returns patientEntity
            every { userEntityRepository.findByPatientId(missingPatientId) } returns null
            every { patientEntity.patientId } returns patientId
            every { patientEntity.mmsId } returns mmsId
            every { userMapper.mapPatientDTO(patientDTO) } returns patientEntity
            every { userMapper.updateExistingPatient(patientEntity, patientEntity) } returns patientEntity
            every { userEntityRepository.save(any()) } returns patientEntity
        }

        @Test
        fun `Get a patient from id`() {
            val patient = userController.getPatient(patientId)
            assertEquals(patientId, patient?.patientId)
        }

        @Test
        fun `Return null if patient does not exist`() {
            val patient = userController.getPatient(missingPatientId)
            assertNull(patient?.patientId)
        }

        @Test
        fun `Create patient from valid DTO`() {
            val response = userController.createPatient(patientDTO)
            val expectedResponse = ResponseEntity.ok("Successfully created / updated " +
                    "patient with Genie ID: $patientId, mms ID: $mmsId.")
            assertEquals(response, expectedResponse)
        }

        @Test
        fun `Fail to create new patient if patient invalid`() {

            every { patientEntity.patientId } returns 0

            val response = userController.createPatient(patientDTO)
            val expectedResponse = ResponseEntity.badRequest().body(
                "Could not create patient. Missing ID.")
            assertEquals(response, expectedResponse)
        }

//        @Test
//        fun `Fail to create new patient if patient already exists`() {
//
//            every { patientEntity.patientId } returns 0
//
//            val response = userController.createPatient(patientDTO)
//            val expectedResponse = ResponseEntity.badRequest().body(
//                "Could not create patient. Missing ID.")
//            assertEquals(response, expectedResponse)
//        }
    }

    @Nested
    inner class Admin {

        private val mmsId = Random.nextInt()
        private val missingMmsId = Random.nextInt() + 1

        @MockK
        private lateinit var adminEntity: AdminEntity

        @MockK
        private lateinit var adminDTO: AdminDTO

        @BeforeEach
        fun setup() {
            every { adminEntity.mmsId } returns mmsId
            every { userEntityRepository.findById(mmsId) } returns Optional.of(adminEntity)
            every { userEntityRepository.findById(missingMmsId) } returns Optional.empty()
            every { userMapper.mapAdminDTO(adminDTO) } returns adminEntity
            every { userEntityRepository.save(any()) } returns adminEntity
        }

        @Test
        fun `Get an admin with valid data`() {
            val admin = userController.getAdmin(mmsId)
            assertEquals(mmsId, admin?.mmsId)
        }

        @Test
        fun `Return null if admin does not exist`() {
            val admin = userController.getAdmin(missingMmsId)
            assertNull(admin?.mmsId)
        }

        @Test
        fun `Create admin from valid DTO`() {
            val response = userController.createAdmin(adminDTO)
            val expectedResponse = ResponseEntity.ok("" +
                    "Successfully added new admin with mms ID: $mmsId.")
            assertEquals(response, expectedResponse)
        }
    }
}
