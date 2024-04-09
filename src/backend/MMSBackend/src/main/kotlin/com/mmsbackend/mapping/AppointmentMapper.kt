package com.mmsbackend.mapping

import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.enums.AppointmentStatus
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.PatientEntity
import org.springframework.stereotype.Service
import java.sql.Time
import java.text.SimpleDateFormat

@Service
class AppointmentMapper {
    fun mapAppointmentDTO(appDTO: AppointmentDTO, patient: PatientEntity, doctor: DoctorEntity): AppointmentEntity{
        return AppointmentEntity(
            id = appDTO.id,
            detail = appDTO.detail,
            reason = appDTO.reason,
            note = appDTO.note,
            dateCreate = appDTO.dateCreate,
            lastUpdated = appDTO.lastUpdated,
            startDate = appDTO.startDate,
            duration = appDTO.duration,
            startTime = appDTO.startTime,

            userNote = "",
            status = AppointmentStatus.UNCONFIRMED,

            patient = patient,
            doctor = doctor
        )
    }

    fun updateExistingAppointment(existingApp: AppointmentEntity, updatedApp: AppointmentEntity): AppointmentEntity {
        return AppointmentEntity(

            // Updated Fields
            detail = updatedApp.detail,
            reason = updatedApp.reason,
            note = updatedApp.note,
            lastUpdated = updatedApp.lastUpdated,
            startTime = updatedApp.startTime,
            duration = updatedApp.duration,
            userNote = updatedApp.userNote,
            startDate = updatedApp.startDate,
            status = updatedApp.status,
            patient = updatedApp.patient,
            doctor = updatedApp.doctor,

            // Existing Fields
            id = existingApp.id,
            dateCreate =  existingApp.dateCreate
        )
    }

    fun mapHtmlAppointment(rowString: List<String>, columns: Map<String, Int>): AppointmentDTO {
        // Implement parsing logic here, converting rowString and columns into an AppointmentDTO
        // Example:
        return AppointmentDTO(
                id = extractFromRow(columns, rowString, "Id").toInt(),
                detail = extractFromRow(columns, rowString, "Detail"),
                reason = extractFromRow(columns, rowString, "Reason"),
                note = extractFromRow(columns, rowString, "Note"),
                dateCreate = SimpleDateFormat("dd/MM/yyyy").parse(extractFromRow(columns, rowString, "DateCreate")).toInstant(),
                lastUpdated = SimpleDateFormat("dd/MM/yyyy").parse(extractFromRow(columns, rowString, "LastUpdated")).toInstant(),
                startTime = Time.valueOf(extractFromRow(columns, rowString, "StartTime")),
                startDate = SimpleDateFormat("dd/MM/yyyy").parse(extractFromRow(columns, rowString, "StartDate")),
                duration = extractFromRow(columns, rowString, "Duration").toInt(),
                patientId = extractFromRow(columns, rowString, "PatientId").toInt(),
                providerId = extractFromRow(columns, rowString, "ProviderId").toInt()
        )
    }

    private fun extractFromRow(columns: Map<String, Int>, rowString: List<String>, col: String): String {
        return columns[col]?.let { rowString.getOrNull(it) } ?: throw Exception("Column $col not found")
    }
}