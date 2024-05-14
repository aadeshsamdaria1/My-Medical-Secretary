package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.GeneralValidation
import com.mmsbackend.api.validation.ResourceValidation
import com.mmsbackend.dto.user.ResourceDTO
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.entity.PatientResourceEntity
import com.mmsbackend.jpa.entity.ResourceEntity
import com.mmsbackend.jpa.repository.PatientResourceEntityRepository
import com.mmsbackend.jpa.repository.ResourceEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.jpa.util.SecurityContextHolderRetriever
import com.mmsbackend.mapping.ResourceMapper
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
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.userdetails.UserDetails
import java.util.*
import kotlin.random.Random

@ExtendWith(MockKExtension::class)
class ResourceControllerTest {

    private lateinit var resourceController: ResourceController

    @MockK
    private lateinit var resourceValidation: ResourceValidation

    private val resourceId = Random.nextInt()
    private val missingResourceId = resourceId + 1
    private val resourceId2 = resourceId + 2
    private val resourceId3 = resourceId + 3

    private val patientId = Random.nextInt()
    private val patientId2 = patientId + 1
    private val patientId3 = patientId + 3

    private val patientResourceId = Random.nextInt()
    private val patientResourceId2 = patientResourceId + 1
    private val patientResourceId3 = patientResourceId + 2

    private val username = UUID.randomUUID().toString()

    @MockK
    private lateinit var resourceEntity: ResourceEntity

    @MockK
    private lateinit var resource2: ResourceEntity

    @MockK
    private lateinit var resource3: ResourceEntity

    @MockK
    private lateinit var patientResource1: PatientResourceEntity

    @MockK
    private lateinit var patientResource2: PatientResourceEntity

    @MockK
    private lateinit var patientResource3: PatientResourceEntity

    @MockK
    private lateinit var patient1: PatientEntity

    @MockK
    private lateinit var patient2: PatientEntity

    @MockK
    private lateinit var patient3: PatientEntity

    @MockK
    private lateinit var resourceEntityRepository: ResourceEntityRepository

    @MockK
    private lateinit var patientResourceEntityRepository: PatientResourceEntityRepository

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var resourceMapper: ResourceMapper

    @MockK
    private lateinit var resourceDTO: ResourceDTO

    @MockK
    private lateinit var generalValidation: GeneralValidation

    @MockK
    private lateinit var securityContext: SecurityContext

    @MockK
    private lateinit var authentication: Authentication

    @MockK
    private lateinit var userDetails: UserDetails

    @MockK
    private lateinit var securityContextHolderRetriever: SecurityContextHolderRetriever

    @BeforeEach
    fun setup() {
        resourceController = ResourceController(
            resourceEntityRepository = resourceEntityRepository,
            resourceValidation = resourceValidation,
            resourceMapper = resourceMapper,
            patientResourceEntityRepository = patientResourceEntityRepository,
            userEntityRepository = userEntityRepository,
            generalValidation = generalValidation,
            securityContextHolderRetriever = securityContextHolderRetriever
        )

        every { resourceValidation.isValidResource(any()) } returns true

        every { resourceEntityRepository.findById(resourceId) } returns Optional.of(resourceEntity)
        every { resourceEntityRepository.findById(missingResourceId) } returns Optional.empty()
        every { resourceEntity.id } returns resourceId
        every { resource2.id }  returns resourceId2
        every { resource3.id }  returns resourceId3

        every { patientResource1.id } returns patientResourceId
        every { patientResource2.id } returns patientResourceId2
        every { patientResource3.id }  returns patientResourceId3

        every { patientResource1.patient.patientId } returns patientId
        every { patientResource2.patient.patientId } returns patientId
        every { patientResource3.patient.patientId } returns patientId2

        every { patientResource1.resource.id } returns resourceId
        every { patientResource2.resource.id } returns resourceId2
        every { patientResource3.resource.id } returns resourceId3

        every { patientResource1.resource } returns resourceEntity
        every { patientResource2.resource } returns resource2

        every { patient1.patientId} returns patientId
        every { patient2.patientId } returns patientId2
        every { patient3.patientId } returns patientId3

        every { resourceMapper.mapResourceDTO(resourceDTO) } returns resourceEntity

        every { resourceEntityRepository.save(resourceEntity) } returns resourceEntity
        every { resourceEntityRepository.save(resource2) } returns resource2
        every { resourceEntityRepository.save(resource3) } returns resource3

        every { patientResourceEntityRepository.save(any()) } returns  patientResource1

        every { patientResourceEntityRepository.findAll() } returns listOf(
            patientResource1,
            patientResource2,
            patientResource3)

        every { resourceDTO.link } returns "mockk-link"
        every { resourceDTO.text } returns "mockk-text"
        every { userEntityRepository.findByPatientId(patientId) } returns patient1
        every { userEntityRepository.findByPatientId(patientId2) } returns patient2
        every { userEntityRepository.findByPatientId(patientId3) } returns patient3

        justRun { patientResourceEntityRepository.deleteById(any()) }

        every { securityContextHolderRetriever.getSecurityContext() } returns userDetails
        every { securityContext.authentication } returns authentication
        every { patient1.username } returns username
        every { generalValidation.isAdminOrSpecificPatientUsername(userDetails, username) } returns true
        every { generalValidation.isAdminOrSpecificPatientId(userDetails, any()) } returns true
    }

    @Test
    fun `Get a resource from id`() {
        val resource = resourceController.getResource(resourceId)
        assertEquals(resourceId, resource?.id)
    }

    @Test
    fun `Return null if resource does not exist`() {
        val resource = resourceController.getResource(missingResourceId)
        assertNull(resource?.id)
    }

    @Test
    fun `Get all resources from a user ID`() {
         val patientResources = listOf(
            patientResource1,
            patientResource2,
            patientResource3
        )

         val resourceList = listOf(
            resourceEntity,
            resource2,
            resource3
        )

        every { patientResourceEntityRepository.findAll() } returns patientResources
        every { resourceEntityRepository.findAll() } returns resourceList

        val response = resourceController.getAllResourcesForUser(patientId)
        val expectedResponse2 = listOf(
            resourceList[0],
            resourceList[1]
        )

        assertEquals(expectedResponse2, response)
    }

    @Test
    fun `Get all resources`() {

        val resourceList = listOf(
            resource2,
            resource3
        )

        every { resourceEntityRepository.findAll() } returns resourceList

        val response = resourceController.getAllResources()
        val expectedResponse2 = listOf(
            resource2,
            resource3
        )

        assertEquals(expectedResponse2, response)
    }

    @Test
    fun `Create a new resource from a valid DTO`() {
        val savedPatientIds = listOf(
            patientId,
            patientId2
        )

        every { resourceDTO.patientIds } returns savedPatientIds
        every { patientResourceEntityRepository.save(patientResource1) } returns patientResource1
        every { patientResourceEntityRepository.save(patientResource2) } returns patientResource2

        val response = resourceController.createResource(resourceDTO)
        val expectedResponse = ResponseEntity.ok("Successfully added new resource with ID: $resourceId " +
                "for patients with patient IDs: $savedPatientIds.")

        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Create a new resource to delete patient`() {
        val savedPatientIds = listOf(
            patientId,
            patientId2
        )

        every { resourceDTO.patientIds } returns savedPatientIds
        every { patientResourceEntityRepository.save(patientResource1) } returns patientResource1
        every { patientResourceEntityRepository.save(patientResource2) } returns patientResource2
        every { userEntityRepository.findByPatientId(patientId) } returns null

        val savedPatientIds2 = listOf(
            patientId2
        )

        val response = resourceController.createResource(resourceDTO)
        val expectedResponse = ResponseEntity.ok("Successfully added new resource with ID: $resourceId " +
                "for patients with patient IDs: $savedPatientIds2.")

        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Failed to create a new resource if no data`() {
        every { resourceValidation.isValidResource(any()) } returns false
        val response = resourceController.createResource(resourceDTO)
        val expectedResponse = ResponseEntity.badRequest().body("Could not create a new resource. No data")

        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Delete a resource from an id`() {
        justRun { resourceEntityRepository.deleteById(any()) }
        val response = resourceController.deleteResource(resourceId)
        val expectedResponse = ResponseEntity.ok("Resource with ID $resourceId deleted successfully.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Failed to delete a resource if exception occurred`() {
        every { resourceEntityRepository.deleteById(any()) } throws RuntimeException("Mocked Exception")
        val response = resourceController.deleteResource(resourceId)
        val expectedResponse = ResponseEntity.badRequest().body("Resource with ID $resourceId" +
                " could not be deleted: Mocked Exception")
        assertEquals(expectedResponse, response)
    }

}