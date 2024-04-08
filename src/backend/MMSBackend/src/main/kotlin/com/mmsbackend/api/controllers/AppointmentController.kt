package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.AppointmentValidation
import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
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
            appointment.patient.patientId == userId
        }.sortedBy {
            it.date
        }
    }

    @PostMapping("/create")
    fun createAppointment(@RequestBody appointmentDTO: AppointmentDTO): ResponseEntity<String> {
        val patientEntity = userEntityRepository.findByPatientId(appointmentDTO.patientId)
            ?: return ResponseEntity.badRequest().body("Could not create appointment. " +
                    "User with id ${appointmentDTO.patientId} does not exist or is not a patient.")

        val appointment = appointmentMapper.mapAppointmentDTO(appointmentDTO, patientEntity)

        return if (appointmentValidation.isValidAppointment(appointment)){
            appointmentEntityRepository.save(appointment)
            ResponseEntity.ok("Successfully added new appointment with ID: ${appointment.id}")
        } else{
            ResponseEntity.badRequest().body("Could not create appointment. Invalid fields")
            // TODO: Give better invalid field information
        }
    }
}
