package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.AppointmentValidation
import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.NoSuchElementException
import kotlin.jvm.optionals.getOrNull

@RestController
@RequestMapping("/api/appointments")
class AppointmentController (
    val appointmentEntityRepository: AppointmentEntityRepository,
    val appointmentMapper: AppointmentMapper,
    val userEntityRepository: UserEntityRepository,
    val appointmentValidation: AppointmentValidation
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
    fun createAppointment(@RequestBody appointmentDTO: AppointmentDTO): ResponseEntity<String> {
        return try{
            val userEntity = userEntityRepository.findById(appointmentDTO.userId).get()
            val appointment = appointmentMapper.mapAppointmentDTO(appointmentDTO, userEntity)

            if (appointmentValidation.isValidAppointment(appointment)){
                appointmentEntityRepository.save(appointment)
                ResponseEntity.ok("Successfully added new appointment with ID: ${appointment.id}")
            } else{
                ResponseEntity.badRequest().body("Could not create appointment. Invalid fields")
                // TODO: Give better invalid field information 
            }
        } catch (nse: NoSuchElementException){
            ResponseEntity.badRequest().body("Could not create appointment. " +
                    "User with id ${appointmentDTO.userId} does not exist.")
        }
    }
}
