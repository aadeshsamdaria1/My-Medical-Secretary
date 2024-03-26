package com.mms.mymedicalsecretarybackend.controllers

import com.mms.mymedicalsecretarybackend.jpa.entity.PatientEntity
import com.mms.mymedicalsecretarybackend.jpa.repository.PatientEntityRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RestController
@RequestMapping("/test")
class TestController(
    val patientEntityRepository: PatientEntityRepository
) {
    @GetMapping("test1")
    fun testMapping(): String = "Hello World"

    @GetMapping("test2")
    fun test2(){
        val x = patientEntityRepository.findById(1)

        val newPatient = PatientEntity(
            1,
            "",
            "",
            "",
            Instant.now(),
            "",
            "",
            "",
            "",
        )

        patientEntityRepository.save(newPatient)
    }
}
