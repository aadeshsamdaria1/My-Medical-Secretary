package com.mmsbackend.api.controllers

import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import org.springframework.web.bind.annotation.*
import kotlin.jvm.optionals.getOrNull

@RestController
@RequestMapping("/api/appointments")
class AppointmentController (
    val appointmentEntityRepository: AppointmentEntityRepository,
    val appointmentMapper: AppointmentMapper,
    val userEntityRepository: UserEntityRepository
) {
    @GetMapping("/get/{id}")
    fun getAppointment(@PathVariable id: Int): AppointmentEntity? {
        return appointmentEntityRepository.findById(id).getOrNull()
    }

    @GetMapping("/get_all/{userId}")
    fun getAllAppointmentsForUser(@PathVariable userId: Int): List<AppointmentEntity>? {
        return appointmentEntityRepository.findAll().filter { appointment ->
            appointment.user.id == userId
        }.sortedBy {
            it.date
        }
    }

    @PostMapping("/create")
    fun createAppointment(@RequestBody appointmentDTO: AppointmentDTO): String {
        println(appointmentDTO)
        val appointment = appointmentMapper.mapAppointmentDTO(
            appointmentDTO = appointmentDTO,
            userEntity = userEntityRepository.findById(appointmentDTO.userId).get()
        )
        println(appointment)
        appointmentEntityRepository.save(appointment)
        return "Successfully added new appointment!"
    }
}
