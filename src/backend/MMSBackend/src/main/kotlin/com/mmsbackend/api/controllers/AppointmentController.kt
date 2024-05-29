package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.AppointmentValidation
import com.mmsbackend.api.validation.GeneralValidation
import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.dto.appointment.UserNoteDTO
import com.mmsbackend.enums.AppointmentStatus
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
    val userEntityRepository: UserEntityRepository,
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

    private fun getAppointmentsById(userId: Int): List<AppointmentEntity> {
        return appointmentEntityRepository.findByPatientId(userId)
            .filter { it.status == AppointmentStatus.ACTIVE }
            .sortedBy { it.dateCreate }
    }
}
