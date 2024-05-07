package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.AppointmentValidation
import com.mmsbackend.api.validation.GeneralValidation
import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.dto.appointment.UserNoteDTO
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.jpa.util.SecurityContextHolderRetriever
import com.mmsbackend.mapping.AppointmentMapper
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import kotlin.jvm.optionals.getOrNull

@RestController
@RequestMapping("/api/appointments")
class AppointmentController (
    val appointmentEntityRepository: AppointmentEntityRepository,
    val appointmentMapper: AppointmentMapper,
    val userEntityRepository: UserEntityRepository,
    val doctorEntityRepository: DoctorEntityRepository,
    val appointmentValidation: AppointmentValidation,
    val generalValidation: GeneralValidation,
    val securityContextHolderRetriever: SecurityContextHolderRetriever
) {
    @GetMapping("/get/{id}")
    fun getAppointment(@PathVariable id: Int): AppointmentEntity? {
        val userDetails = securityContextHolderRetriever.getSecurityContext()

        val appointment = appointmentEntityRepository.findById(id).getOrNull()
        return if (generalValidation.isAdminOrSpecificPatientUsername(userDetails, appointment?.patient?.username)) {
            appointment
        } else{
            throw ResponseStatusException(HttpStatus.FORBIDDEN)
        }
    }

    @GetMapping("/get_all/{userId}")
    fun getAllAppointmentsForUser(@PathVariable userId: Int): List<AppointmentEntity>? {
        val userDetails = securityContextHolderRetriever.getSecurityContext()
        return if (generalValidation.isAdminOrSpecificPatientId(userDetails, userId)) {
            getAppointmentsById(userId)
        } else{
            throw ResponseStatusException(HttpStatus.FORBIDDEN)
        }
    }

    private fun getAppointmentsById(userId: Int): List<AppointmentEntity> {
        return appointmentEntityRepository.findByPatientId(userId)
            .sortedBy { it.dateCreate }
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
            return ResponseEntity.badRequest().body("Could not create appointment. Invalid fields.")
        }

        val existingApp = appointmentEntityRepository.findById(appointmentDTO.id).getOrNull()
        val savedAppointment: AppointmentEntity = if (existingApp != null) {
            appointmentEntityRepository.save(appointmentMapper.updateExistingAppointment(existingApp, appointment))
        } else{
            appointmentEntityRepository.save(appointment)
        }

        return ResponseEntity.ok("Successfully ${if (existingApp != null) "updated" else "created new"} " +
                "appointment with Genie ID: ${savedAppointment.id}.")
    }

    @PostMapping("/user_note/update")
    fun updateUserNote(@RequestBody userNoteDTO: UserNoteDTO): ResponseEntity<String> {
        val userDetails = securityContextHolderRetriever.getSecurityContext()

        val appointment = appointmentEntityRepository.findById(userNoteDTO.appointmentId).getOrNull()
            ?: return ResponseEntity.badRequest().body("Could not update user note for appointment with ID " +
                    "${userNoteDTO.appointmentId}. Appointment does not exist.")

        return if (generalValidation.isAdminOrSpecificPatientUsername(userDetails, appointment.patient.username)) {

            appointment.userNote = userNoteDTO.note
            appointmentEntityRepository.save(appointment)
            ResponseEntity.ok("Successfully updated user note for appointment ${userNoteDTO.appointmentId}.")

        } else {
            throw ResponseStatusException(HttpStatus.FORBIDDEN)
        }
    }
}
