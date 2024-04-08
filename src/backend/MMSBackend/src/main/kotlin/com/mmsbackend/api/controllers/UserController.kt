package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.UserValidation
import com.mmsbackend.dto.user.AdminDTO
import com.mmsbackend.dto.user.PatientDTO
import com.mmsbackend.jpa.entity.AdminEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.UserMapper
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import kotlin.jvm.optionals.getOrNull

@RestController
@RequestMapping("/api/users")
class UserController(
    val userEntityRepository: UserEntityRepository,
    val userValidation: UserValidation,
    val userMapper: UserMapper
) {
    @GetMapping("/get_patient/{id}")
    fun getPatient(@PathVariable id: Int): PatientEntity? {
        return userEntityRepository.findByPatientId(id)
    }

    @GetMapping("/get_admin/{id}")
    fun getAdmin(@PathVariable id: Int): AdminEntity? {
        return userEntityRepository.findById(id).getOrNull() as? AdminEntity
    }

    @PostMapping("/create_patient")
    fun createPatient(@RequestBody patientDTO: PatientDTO): ResponseEntity<String> {
        val patient = userMapper.mapPatientDTO(patientDTO)

        if (!userValidation.isValidPatient(patient)) {
            return ResponseEntity.badRequest().body("Could not create patient. Missing ID.")
        }

        val existingPatient = userEntityRepository.findByPatientId(patientDTO.patientId)

        val savedPatient: PatientEntity = if (existingPatient != null){
            userEntityRepository.save(userMapper.updateExistingPatient(existingPatient, patient))
        } else{
            userEntityRepository.save(patient)
        }

        return ResponseEntity.ok("Successfully ${if (existingPatient != null) "updated" else "created" } " +
                "new patient with Genie ID: ${savedPatient.patientId}, mms ID: ${savedPatient.mmsId}.")
    }

    @PostMapping("/create_admin")
    fun createAdmin(@RequestBody adminDTO: AdminDTO): ResponseEntity<String> {
        val admin = userMapper.mapAdminDTO(adminDTO)

        userEntityRepository.save(admin)
        return ResponseEntity.ok("Successfully added new admin with mms ID: ${admin.mmsId}")
    }
}
