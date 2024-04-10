package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.AppointmentValidation
import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.DoctorEntityRepository
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
    val doctorEntityRepository: DoctorEntityRepository,
    val appointmentValidation: AppointmentValidation,
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
            it.dateCreate
        }
    }

    @PostMapping("/create")
    fun createAppointment(@RequestBody appointmentDTO: AppointmentDTO): ResponseEntity<String> {

        val patient = userEntityRepository.findByPatientId(appointmentDTO.patientId)
            ?: return ResponseEntity.badRequest().body("Could not create appointment. " +
                "Patient with id ${appointmentDTO.patientId} does not exist or is not a patient.")

        val doctor = doctorEntityRepository.findById(appointmentDTO.providerId).getOrNull()
            ?: return ResponseEntity.badRequest().body("Could not create appointment. " +
                "Provider(doctor) with id ${appointmentDTO.providerId} does not exist.")

        val appointment = appointmentMapper.mapAppointmentDTO(appointmentDTO, patient, doctor)
        if (!appointmentValidation.isValidAppointment(appointment)){
            return ResponseEntity.badRequest().body("Could not create appointment. Invalid fields")
            // TODO: Give better invalid field information
        }

        val existingApp = appointmentEntityRepository.findById(appointmentDTO.id).getOrNull()
        val savedAppointment: AppointmentEntity = if (existingApp != null) {
            appointmentEntityRepository.save(appointmentMapper.updateExistingAppointment(existingApp, appointment))
        } else{
            appointmentEntityRepository.save(appointment)
        }

        return ResponseEntity.ok("Successfully ${if (existingApp != null) "updated" else "created" } " +
                "new appointment with Genie ID: ${savedAppointment.id}.")
    }
}