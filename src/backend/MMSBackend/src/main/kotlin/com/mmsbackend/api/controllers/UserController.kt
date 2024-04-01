package com.mmsbackend.api.controllers

import com.mmsbackend.api.exception.InvalidPatientException
import com.mmsbackend.api.validation.UserValidation
import com.mmsbackend.enums.UserType
import com.mmsbackend.jpa.entity.UserEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.web.bind.annotation.*
import kotlin.jvm.optionals.getOrNull

@RestController
@RequestMapping("/api/users")
class UserController(
    val userEntityRepository: UserEntityRepository,
    val userValidation: UserValidation
) {
    @GetMapping("/get/{id}")
    fun getPatient(@PathVariable id: Int): UserEntity? {
        return userEntityRepository.findById(id).getOrNull()
    }

    @PostMapping("/create_patient")
    fun createPatient(@RequestBody patient: UserEntity): String {
        patient.userType = UserType.PATIENT
        return if (userValidation.isValidPatient(patient)){
            userEntityRepository.save(patient)
            "Successfully added new patient!"
        } else{
            throw InvalidPatientException("Not enough details to create patient")
            // TODO: Add which fields are missing in exception
        }
    }

    @PostMapping("/create_admin")
    fun createAdmin(@RequestBody admin: UserEntity): String {
        admin.userType = UserType.ADMIN
        userEntityRepository.save(admin)
        return "Successfully added new admin!"
    }
}
