package com.mmsbackend.api.controllers

import com.mmsbackend.jpa.entity.FacilityEntity
import com.mmsbackend.jpa.entity.UserEntity
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
    val facilityEntityRepository: FacilityEntityRepository
){
    @GetMapping("/get/{id}")
    fun getFacility(@PathVariable id: Int): FacilityEntity? {
        return facilityEntityRepository.findById(id).getOrNull()
    }

    @PostMapping("/create")
    fun createFacility(@RequestBody facilityEntity: FacilityEntity) {
        facilityEntityRepository.save(facilityEntity)
    }

    @DeleteMapping("/delete/{id}")
    fun deleteFacility(@PathVariable id: Int): ResponseEntity<String> {
        return try {
            facilityEntityRepository.deleteById(id)
            ResponseEntity.ok("Facility with ID $id deleted successfully.")
        } catch (exception: Exception) {
            ResponseEntity.status(404).body("Facility with ID $id not found.")
        }
    }
}
