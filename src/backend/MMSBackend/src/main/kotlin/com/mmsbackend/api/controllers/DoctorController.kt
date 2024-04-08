package com.mmsbackend.api.controllers

import com.mmsbackend.dto.doctor.DoctorDTO
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.mapping.DoctorMapper
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.http.ResponseEntity
import kotlin.jvm.optionals.getOrNull

@RestController
@RequestMapping("/api/doctors")
class DoctorController(
    val doctorEntityRepository: DoctorEntityRepository,
    val doctorMapper: DoctorMapper
) {
    @GetMapping("/get/{id}")
    fun getDoctor(@PathVariable id: Int): DoctorEntity? {
        return doctorEntityRepository.findById(id).getOrNull()
    }

    @PostMapping("/create")
    fun createDoctor(@RequestBody doctorDTO: DoctorDTO): ResponseEntity<String> {
        return try {
            val doctor = doctorMapper.mapDoctorDTO(doctorDTO)
            doctorEntityRepository.save(doctor)
            ResponseEntity.ok("Successfully added new doctor with ID: ${doctor.id}")
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Error while adding doctor: ${e.message}")
        }
    }

    @DeleteMapping("/delete/{id}")
    fun deleteDoctor(@PathVariable id: Int): ResponseEntity<String> {
        return try {
            doctorEntityRepository.deleteById(id)
            ResponseEntity.ok("Doctor with ID $id deleted successfully.")
        } catch (exception: Exception) {
            ResponseEntity.status(404).body("Doctor with ID $id not found.")
        }
    }
}
