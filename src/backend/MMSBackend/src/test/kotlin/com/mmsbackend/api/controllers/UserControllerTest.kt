package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.GeneralValidation
import com.mmsbackend.api.validation.UserValidation
import com.mmsbackend.dto.user.AdminDTO
import com.mmsbackend.dto.user.PatientDTO
import com.mmsbackend.jpa.entity.user.AdminEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.jpa.util.SecurityContextHolderRetriever
import com.mmsbackend.mapping.UserMapper
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.justRun
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.userdetails.UserDetails
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

    @MockK
    private lateinit var generalValidation: GeneralValidation

    @MockK
    private lateinit var securityContextHolderRetriever: SecurityContextHolderRetriever

    @MockK
    private lateinit var adminEntity: AdminEntity

    private lateinit var rootAdminUsername: String

    @BeforeEach
    fun setup() {
        userValidation = UserValidation()
        rootAdminUsername = "rootAdmin"
        userController = UserController(
                userEntityRepository = userEntityRepository,
                userValidation = userValidation,
                userMapper = userMapper,
                generalValidation = generalValidation,
                securityContextHolderRetriever = securityContextHolderRetriever,
                rootAdminUsername = rootAdminUsername
        )
    }

    @Nested
    inner class Patient {

        private val patientId = Random.nextInt()
        private val missingPatientId = patientId + 1
        private val mmsId = missingPatientId + 1
        private val username = UUID.randomUUID().toString()

        @MockK
        private lateinit var patientEntity: PatientEntity

        @MockK
        private lateinit var patientDTO: PatientDTO

        @MockK
        private lateinit var securityContext: SecurityContext

        @MockK
        private lateinit var authentication: Authentication

        @MockK
        private lateinit var userDetails: UserDetails

        @BeforeEach
        fun setup() {

            every { securityContextHolderRetriever.getSecurityContext() } returns userDetails
            every { securityContext.authentication } returns authentication
            every { patientEntity.username } returns username
            every { generalValidation.isAdminOrSpecificPatientUsername(userDetails, username) } returns true

            every { userEntityRepository.findByPatientId(patientId) } returns patientEntity
            every { userEntityRepository.findByPatientId(missingPatientId) } returns null
            every { patientEntity.patientId } returns patientId
            every { patientEntity.mmsId } returns mmsId
            every { userMapper.mapPatientDTO(patientDTO) } returns patientEntity
            every { userMapper.updateExistingPatient(patientEntity, patientEntity) } returns patientEntity
            every { userEntityRepository.save(any()) } returns patientEntity
            every { userEntityRepository.findAll() } returns listOf(patientEntity, adminEntity)
        }

        @Test
        fun `Get a patient from id`() {
            val patient = userController.getPatient(patientId)
            assertEquals(patientId, patient?.patientId)
        }

        @Test
        fun `Get all patients`() {
            val patients = userController.getAllPatients()
            assertEquals(patients, listOf(patientEntity))
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
    }

    @Nested
    inner class Admin {

        private val mmsId = Random.nextInt()
        private val missingMmsId = Random.nextInt() + 1
        private val username = UUID.randomUUID().toString()

        @MockK
        private lateinit var adminDTO: AdminDTO

        @BeforeEach
        fun setup() {
            every { adminEntity.mmsId } returns mmsId
            every { userEntityRepository.findById(mmsId) } returns Optional.of(adminEntity)
            every { userEntityRepository.findById(missingMmsId) } returns Optional.empty()
            every { userMapper.mapAdminDTO(adminDTO) } returns adminEntity
            every { userEntityRepository.save(any()) } returns adminEntity
            every { adminEntity.username } returns username
            every { userEntityRepository.findByUsername(username) } returns adminEntity
            every { userMapper.updateExistingAdmin(adminEntity, adminEntity) } returns adminEntity
            every { userEntityRepository.findByMmsId(mmsId) } returns adminEntity
            justRun { userEntityRepository.deleteByMmsId(mmsId) }
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
                    "Successfully added / updated admin with mms ID: $mmsId.")
            assertEquals(response, expectedResponse)
        }

        @Test
        fun `Successfully delete an admin`() {
            val response = userController.deleteAdmin(mmsId)
            val expectedResponse = ResponseEntity.ok("Admin with ID $mmsId deleted successfully.")
            assertEquals(expectedResponse, response)
        }

        @Test
        fun `Fail to delete root admin`() {
            every { adminEntity.username } returns rootAdminUsername
            val response = userController.deleteAdmin(mmsId)
            val expectedResponse = ResponseEntity.badRequest().body("Cannot delete the root admin.")
            assertEquals(expectedResponse, response)
        }

        @Test
        fun `Fail to delete admin if other exception occurs`() {
            every { userEntityRepository.deleteByMmsId(mmsId) } throws RuntimeException("Mocked exception")
            val response = userController.deleteAdmin(mmsId)
            val expectedResponse = ResponseEntity.badRequest().body(
                    "Admin with ID $mmsId could not be deleted: Mocked exception")
            assertEquals(expectedResponse, response)
        }
    }
}
