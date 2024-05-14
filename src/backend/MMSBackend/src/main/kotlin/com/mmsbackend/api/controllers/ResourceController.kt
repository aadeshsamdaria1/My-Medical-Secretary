package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.GeneralValidation
import com.mmsbackend.api.validation.ResourceValidation
import com.mmsbackend.data.AddPatientToResourceRequest
import com.mmsbackend.data.RemovePatientFromResourceRequest
import com.mmsbackend.dto.user.ResourceDTO
import com.mmsbackend.jpa.entity.PatientResourceEntity
import com.mmsbackend.jpa.entity.ResourceEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.PatientResourceEntityRepository
import com.mmsbackend.jpa.repository.ResourceEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.jpa.util.SecurityContextHolderRetriever
import com.mmsbackend.mapping.ResourceMapper
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
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

    @GetMapping("/get_all")
    fun getAllResources(): List<ResourceEntity>? = resourceEntityRepository.findAll().toSet().toList()

    @GetMapping("/get_all_by_id/{userId}")
    fun getAllResourcesForUser(@PathVariable userId: Int): List<ResourceEntity>? {
        val userDetails = securityContextHolderRetriever.getSecurityContext()
        return if (generalValidation.isAdminOrSpecificPatientId(userDetails, userId)) {
            getAllResourcesById(userId)
        } else {
            throw ResponseStatusException(HttpStatus.FORBIDDEN)
        }
    }

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
                        persistPatientEntityResource(resource, patient)
                        patient.patientId
                    }
                }

            ResponseEntity.ok("Successfully added new resource with ID: $resourceId " +
                    "for patients with patient IDs: $savedPatientIds.")
        } else {
            ResponseEntity.badRequest().body("Could not create a new resource. No data")
        }
    }

    @PostMapping("/add_patient_to_resource")
    fun addPatientToResource(@RequestBody request: AddPatientToResourceRequest): ResponseEntity<String> {
        val patient = userEntityRepository.findByPatientId(request.patientId)
            ?: return ResponseEntity.badRequest().body("Patient does not exist.")
        val resource = resourceEntityRepository.findById(request.resourceId).getOrNull()
            ?: return ResponseEntity.badRequest().body("Resource does not exist.")
        persistPatientEntityResource(resource, patient)
        return ResponseEntity.ok("Successfully added patient ${patient.patientId} to resource ${resource.id}.")
    }

    @PostMapping("/remove_patient_from_resource")
    fun removePatientFrom(@RequestBody request: RemovePatientFromResourceRequest): ResponseEntity<String> {
        val per = patientResourceEntityRepository.findAllByPatientId(request.patientId)
            .filter { it.resource.id == request.resourceId }
        if (per.isNotEmpty()){
            val idToDelete = per[0].id
            patientResourceEntityRepository.deleteById(idToDelete)
        }
        return ResponseEntity.ok("Successfully removed patient ${request.patientId} " +
            "from resource ${request.resourceId}.")
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

    private fun persistPatientEntityResource(resource: ResourceEntity, patient: PatientEntity) {
        val patientEntityResources = patientResourceEntityRepository
            .findAllByPatientId(patient.patientId)
            .filter { it.resource.id == resource.id }
        if (patientEntityResources.isEmpty()){
            patientResourceEntityRepository.save(PatientResourceEntity(0, resource, patient))
        }
    }

    private fun getAllResourcesById(userId: Int) = patientResourceEntityRepository.findAll()
        .filter { it.patient.patientId == userId }
        .map { it.resource }
}
