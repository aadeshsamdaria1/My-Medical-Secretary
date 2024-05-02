package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.GeneralValidation
import com.mmsbackend.api.validation.UserValidation
import com.mmsbackend.dto.user.AdminDTO
import com.mmsbackend.dto.user.PatientDTO
import com.mmsbackend.exception.AdminPatientUsernameMatchException
import com.mmsbackend.jpa.entity.user.AdminEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.jpa.util.SecurityContextHolderRetriever
import com.mmsbackend.jpa.util.persist
import com.mmsbackend.mapping.UserMapper
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import kotlin.jvm.optionals.getOrNull

@RestController
@RequestMapping("/api/users")
class UserController(
    val userEntityRepository: UserEntityRepository,
    val userValidation: UserValidation,
    val userMapper: UserMapper,
    val generalValidation: GeneralValidation,
    val securityContextHolderRetriever: SecurityContextHolderRetriever
) {
    @GetMapping("/get_patient/{id}")
    fun getPatient(@PathVariable id: Int): PatientEntity? {
        val userDetails = securityContextHolderRetriever.getSecurityContext()
        val patient = userEntityRepository.findByPatientId(id) ?: return null
        return if (generalValidation.isAdminOrSpecificPatientUsername(userDetails, patient.username)) {
            patient
        } else {
            throw ResponseStatusException(HttpStatus.FORBIDDEN)
        }
    }

    @GetMapping("/get_all_patients")
    fun getAllPatients(): List<PatientEntity> {
        return userEntityRepository.findAll().filterIsInstance<PatientEntity>()
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

        val savedPatient = patient.persist(userEntityRepository, userMapper)
        return ResponseEntity.ok("Successfully created / updated patient with " +
                "Genie ID: ${savedPatient.patientId}, mms ID: ${savedPatient.mmsId}.")
    }

    @PostMapping("/create_admin")
    fun createAdmin(@RequestBody adminDTO: AdminDTO): ResponseEntity<String> {
        val admin = userMapper.mapAdminDTO(adminDTO)

        return try {
            val savedAdmin = admin.persist(userEntityRepository, userMapper)
            ResponseEntity.ok("Successfully added / updated admin with mms ID: ${savedAdmin.mmsId}.")
        } catch (ape: AdminPatientUsernameMatchException) {
            ResponseEntity.badRequest().body(ape.message)
        }
    }
}
