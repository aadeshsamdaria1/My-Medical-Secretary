package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.GeneralValidation
import com.mmsbackend.api.validation.ResourceValidation
import com.mmsbackend.dto.user.ResourceDTO
import com.mmsbackend.jpa.entity.PatientResourceEntity
import com.mmsbackend.jpa.entity.ResourceEntity
import com.mmsbackend.jpa.repository.PatientResourceEntityRepository
import com.mmsbackend.jpa.repository.ResourceEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.jpa.util.SecurityContextHolderRetriever
import com.mmsbackend.mapping.ResourceMapper
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException
import kotlin.jvm.optionals.getOrNull

@RestController
@RequestMapping("/api/resources")
class ResourceController (
    val resourceEntityRepository: ResourceEntityRepository,
    val resourceValidation: ResourceValidation,
    val resourceMapper: ResourceMapper,
    val patientResourceEntityRepository: PatientResourceEntityRepository,
    val userEntityRepository: UserEntityRepository,
    val generalValidation: GeneralValidation,
    val securityContextHolderRetriever: SecurityContextHolderRetriever
){
    @GetMapping("/get/{id}")
    fun getResource(@PathVariable id: Int): ResourceEntity? {
        return resourceEntityRepository.findById(id).getOrNull()
    }

    @GetMapping("/get_all/{userId}")
    fun getAllResourcesForUser(@PathVariable userId: Int): List<ResourceEntity>? {

        val userDetails = securityContextHolderRetriever.getSecurityContext()

        return if (generalValidation.isAdminOrSpecificPatientId(userDetails, userId)) {
            getAllResourcesById(userId)
        } else {
            throw ResponseStatusException(HttpStatus.FORBIDDEN)
        }
    }

    private fun getAllResourcesById(userId: Int) = patientResourceEntityRepository.findAll()
        .filter { it.patient.patientId == userId }
        .map { it.resource }

    @PostMapping("/create")
    fun createResource(@RequestBody resourceDTO: ResourceDTO): ResponseEntity<String>{

        return if (resourceValidation.isValidResource(resourceDTO)) {

            // Save resource entity
            val resource = resourceMapper.mapResourceDTO(resourceDTO)
            val resourceId = resourceEntityRepository.save(resource).id

            // Save many-to-many relationship with patients
            val savedPatientIds = resourceDTO.patientIds
                .toSet()
                .mapNotNull { patientId ->
                    val patient = userEntityRepository.findByPatientId(patientId)
                    patient?.let {
                        patientResourceEntityRepository.save(PatientResourceEntity(0, resource, patient))
                        patient.patientId
                    }
                }

            ResponseEntity.ok("Successfully added new resource with ID: $resourceId " +
                    "for patients with patient IDs: $savedPatientIds.")
        } else {
            ResponseEntity.badRequest().body("Could not create a new resource. No data")
        }
    }

    @DeleteMapping("/delete/{id}")
    fun deleteResource(@PathVariable id: Int): ResponseEntity<String> {
        return try {

            // Delete many-to-many relationships
            patientResourceEntityRepository.findAll()
                .filter { it.resource.id == id }
                .map { patientResourceEntityRepository.deleteById(it.id) }

            // Delete resource
            resourceEntityRepository.deleteById(id)
            ResponseEntity.ok("Resource with ID $id deleted successfully.")
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Resource with ID $id could not be deleted: ${e.message}")
        }
    }
}
