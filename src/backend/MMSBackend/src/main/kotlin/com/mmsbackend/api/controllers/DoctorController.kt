package com.mmsbackend.api.controllers

import com.mmsbackend.dto.user.DoctorDTO
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.mapping.DoctorMapper
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
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
    fun createDoctor(@RequestBody doctorDTO: DoctorDTO): String {
        val doctor = doctorMapper.mapDoctorDTO(doctorDTO)
        doctorEntityRepository.save(doctor)
        return "Successfully added new patient!"
    }
}
