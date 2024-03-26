package com.mms.mymedicalsecretarybackend.controllers

import com.mms.mymedicalsecretarybackend.jpa.entity.PatientEntity
import com.mms.mymedicalsecretarybackend.jpa.repository.PatientEntityRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/patients")
class PatientController(
    val patientEntityRepository: PatientEntityRepository
) {
    @GetMapping("get")
    fun getPatient(){

    }

    @PostMapping("create")
    fun createPatient(@RequestBody patient: PatientEntity): String {

        patientEntityRepository.save(patient)
        return "Successfully added new patient!"
    }
}
