package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.DoctorValidation
import com.mmsbackend.api.validation.GeneralValidation
import com.mmsbackend.dto.doctor.DoctorDTO
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.jpa.util.SecurityContextHolderRetriever
import com.mmsbackend.mapping.DoctorMapper
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.http.ResponseEntity
import org.springframework.web.server.ResponseStatusException
import kotlin.jvm.optionals.getOrNull

@RestController
@RequestMapping("/api/doctors")
class DoctorController(
    val doctorEntityRepository: DoctorEntityRepository,
    val doctorMapper: DoctorMapper,
    val doctorValidation: DoctorValidation,
    val appointmentEntityRepository: AppointmentEntityRepository,
    val generalValidation: GeneralValidation,
    val securityContextHolderRetriever: SecurityContextHolderRetriever
) {
    @GetMapping("/get/{id}")
    fun getDoctor(@PathVariable id: Int): DoctorEntity? {
        return doctorEntityRepository.findById(id).getOrNull()
    }

    @GetMapping("/get_by_patient_id/{id}")
    fun getAllDoctorsByPatientId(@PathVariable id: Int): List<DoctorEntity> {
        val userDetails = securityContextHolderRetriever.getSecurityContext()
        return if (generalValidation.isAdminOrSpecificPatientId(userDetails, id)) {
            getDoctorsByPatientId(id)
        } else {
            throw ResponseStatusException(HttpStatus.FORBIDDEN)
        }
    }

    private fun getDoctorsByPatientId(id: Int) = appointmentEntityRepository.findAll().filter {
        it.patient.patientId == id
    }.flatMap { appointment ->
        doctorEntityRepository.findAll().filter { it.id == appointment.doctor.id }
    }.toSet().toList()

    @GetMapping("/get_all")
    fun getAllDoctors(): List<DoctorEntity> {
        val allDoctors = doctorEntityRepository.findAll()
        return allDoctors.toSet().toList()
    }

    @PostMapping("/create")
    fun createDoctor(@RequestBody doctorDTO: DoctorDTO): ResponseEntity<String> {
        val doctor = doctorMapper.mapDoctorDTO(doctorDTO)
        return if (doctorValidation.isValidDoctor(doctor)){
            doctorEntityRepository.save(doctor)
            ResponseEntity.ok("Successfully added new doctor with ID: ${doctor.id}")
        } else{
            ResponseEntity.badRequest().body("Could not create doctor. missing id")
        }
    }

    @DeleteMapping("/delete/{id}")
    fun deleteDoctor(@PathVariable id: Int): ResponseEntity<String> {
        return try {
            doctorEntityRepository.deleteById(id)
            ResponseEntity.ok("Doctor with ID $id deleted successfully.")
        } catch (dive: DataIntegrityViolationException) {
            ResponseEntity.badRequest().body("Doctor with ID $id cannot be deleted " +
                    "because they still have Appointments")
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Doctor with ID $id could not be deleted: ${e.message}")
        }
    }
}
