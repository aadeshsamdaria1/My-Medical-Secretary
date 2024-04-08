package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.UserValidation
import com.mmsbackend.dto.user.AdminDTO
import com.mmsbackend.dto.user.PatientDTO
import com.mmsbackend.jpa.entity.UserEntity
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
    @GetMapping("/get/{id}")
    fun getPatient(@PathVariable id: Int): UserEntity? {
        return userEntityRepository.findById(id).getOrNull()
    }

    @PostMapping("/create_patient")
    fun createPatient(@RequestBody patientDTO: PatientDTO): ResponseEntity<String> {
        val patient = userMapper.mapPatientDTO(patientDTO)

        return if (userValidation.isValidPatient(patient)){
            userEntityRepository.save(patient)
            ResponseEntity.ok("Successfully added new patient with ID: ${patient.id}")
        } else {
            ResponseEntity.badRequest().body("Could not create patient")
            // TODO: Explain which fields missing
        }
    }

    @PostMapping("/create_admin")
    fun createAdmin(@RequestBody adminDTO: AdminDTO): ResponseEntity<String> {
        val admin = userMapper.mapAdminDTO(adminDTO)

        return if (userValidation.isValidAdmin(admin)){
            userEntityRepository.save(admin)
            ResponseEntity.ok("Successfully added new patient with ID: ${admin.id}")
        } else{
            ResponseEntity.badRequest().body("Could not create admin. missing id")
        }
    }
}
