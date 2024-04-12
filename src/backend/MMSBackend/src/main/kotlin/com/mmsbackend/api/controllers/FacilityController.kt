package com.mmsbackend.api.controllers

import com.mmsbackend.jpa.entity.FacilityEntity
import com.mmsbackend.api.validation.FacilityValidation
import com.mmsbackend.jpa.repository.FacilityEntityRepository
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
    val facilityValidation: FacilityValidation
){
    @GetMapping("/get/{id}")
    fun getFacility(@PathVariable id: Int): FacilityEntity? {
        return facilityEntityRepository.findById(id).getOrNull()
    }

    @PostMapping("/create")
    fun createFacility(@RequestBody facilityEntity: FacilityEntity): ResponseEntity<String> {
        return if (facilityValidation.isValidFacility(facilityEntity)) {
            facilityEntityRepository.save(facilityEntity)
            ResponseEntity.ok("Successfully added new facility with ID: ${facilityEntity.id}")
        } else {
            ResponseEntity.badRequest().body("Could not create facility. Missing valid ID")
        }
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
