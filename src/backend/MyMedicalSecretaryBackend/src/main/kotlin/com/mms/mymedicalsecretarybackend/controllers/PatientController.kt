package com.mms.mymedicalsecretarybackend.controllers

import com.mms.mymedicalsecretarybackend.jpa.entity.PatientEntity
import com.mms.mymedicalsecretarybackend.jpa.repository.PatientEntityRepository
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/patients")
class PatientController(
    val patientEntityRepository: PatientEntityRepository
) {
    @GetMapping("/get/{id}")
    fun getPatient(@PathVariable id: Int): PatientEntity {
        println("Request hit")
        return patientEntityRepository.findById(id).get()
    }

    @PostMapping("/create")
    fun createPatient(@RequestBody patient: PatientEntity): String {

        patientEntityRepository.save(patient)
        return "Successfully added new patient!"
    }
}
