package com.mmsbackend.api.controllers

import com.mmsbackend.jpa.entity.FacilityEntity
import com.mmsbackend.api.validation.FacilityValidation
import com.mmsbackend.dto.user.FacilityDTO
import com.mmsbackend.enums.FacilityType
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.repository.FacilityEntityRepository
import com.mmsbackend.mapping.FacilityMapper
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.http.ResponseEntity
import kotlin.jvm.optionals.getOrNull

@RestController
@RequestMapping("/api/facilities")
class FacilityController (
    val facilityEntityRepository: FacilityEntityRepository,
    val facilityValidation: FacilityValidation,
    val facilityMapper: FacilityMapper
){
    @GetMapping("/get/{id}")
    fun getFacility(@PathVariable id: Int): FacilityEntity? {
        return facilityEntityRepository.findById(id).getOrNull()
    }

    @GetMapping("/get_all")
    fun getAllFacilities(): List<FacilityEntity>? = facilityEntityRepository.findAll().sortedBy { it.name }

    @GetMapping("/get_all_by_type/{type}")
    fun getAllFacilitiesByType(@PathVariable type: FacilityType): List<FacilityEntity>? {
        return facilityEntityRepository.findAll().filter {
            it.facilityType == type
        }.sortedBy {
            it.name
        }
    }

    @PostMapping("/create")
    fun createFacility(@RequestBody facilityDTO: FacilityDTO): ResponseEntity<String> {
        val facilityEntity = facilityMapper.mapFacilityDTO(facilityDTO)
        val savedFacility = facilityEntityRepository.save(facilityEntity)
        return ResponseEntity.ok("Successfully added new facility with ID: ${savedFacility.id}")
    }

    @DeleteMapping("/delete/{id}")
    fun deleteFacility(@PathVariable id: Int): ResponseEntity<String> {
        val facility = facilityEntityRepository.findById(id).orElse(null)
        return if (facility != null && facilityValidation.isValidFacility(facility)) {
            facilityEntityRepository.deleteById(id)
            ResponseEntity.ok("Facility with ID $id deleted successfully.")
        } else {
            ResponseEntity.badRequest().body("Could not delete facility. Facility with ID $id not found or invalid.")
        }
    }
}
