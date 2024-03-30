package com.mmsbackend.controllers

import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.PatientEntityRepository
import org.springframework.web.bind.annotation.*
import kotlin.jvm.optionals.getOrNull

@RestController
@RequestMapping("/api/patients")
class PatientController(
    val patientEntityRepository: PatientEntityRepository
) {
    @GetMapping("/get/{id}")
    fun getPatient(@PathVariable id: Int): PatientEntity? {
        return patientEntityRepository.findById(id).getOrNull()
    }

    @PostMapping("/create")
    fun createPatient(@RequestBody patient: PatientEntity): String {
        patientEntityRepository.save(patient)
        return "Successfully added new patient!"
    }
}
