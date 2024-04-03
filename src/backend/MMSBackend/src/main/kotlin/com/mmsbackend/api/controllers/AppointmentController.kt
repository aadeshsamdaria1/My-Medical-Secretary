package com.mmsbackend.api.controllers

import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import org.springframework.web.bind.annotation.*
import kotlin.jvm.optionals.getOrNull

@RestController
@RequestMapping("/api/appointments")
class AppointmentController (
        val appointmentEntityRepository: AppointmentEntityRepository,
        val appointmentMapper: AppointmentMapper
){
    @GetMapping("/get/{id}")
    fun getAppointment(@PathVariable id: Int): AppointmentEntity? {
        return appointmentEntityRepository.findById(id).getOrNull()
    }

    @PostMapping("/create")
    fun createAppointment(@RequestBody appointmentDTO: AppointmentDTO): String {
        val appointment = appointmentMapper.mapAppointmentDTO(appointmentDTO)
        appointmentEntityRepository.save(appointment)
        return "Successfully added new appointment!"
    }
}
