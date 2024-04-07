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
    fun createFacility(@RequestBody facilityEntity: FacilityEntity): String {
        facilityEntityRepository.save(facilityEntity)
        return "Successfully created a new ${facilityEntity.facilityType}"
    }
}
