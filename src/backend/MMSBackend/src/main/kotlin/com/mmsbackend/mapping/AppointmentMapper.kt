package com.mmsbackend.mapping

import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.enums.AppointmentStatus
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.stereotype.Service
import java.sql.Time
import java.text.SimpleDateFormat
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import kotlin.jvm.optionals.getOrNull

@Service
class AppointmentMapper(
    val userEntityRepository: UserEntityRepository,
    val doctorEntityRepository: DoctorEntityRepository
) {
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

    fun mapHtmlAppointment(rowString: List<String>, columns: Map<String, Int>): AppointmentEntity? {
        return AppointmentEntity(
            id = extractFromRow(columns, rowString, ID).toInt(),

            detail = extractFromRow(columns, rowString, DETAIL),
            reason = extractFromRow(columns, rowString, REASON),
            note = extractFromRow(columns, rowString, NOTE),
            lastUpdated = stringToInstant(extractFromRow(columns, rowString, LAST_UPDATED), LAST_UPDATED_PATTERN),
            startTime = Time.valueOf(extractFromRow(columns, rowString, START_TIME)),
            duration = extractFromRow(columns, rowString, DURATION).toInt(),
            userNote = "",
            startDate = SimpleDateFormat(DATE_CREATED_PATTERN).parse(extractFromRow(columns, rowString, START_DATE)),
            status = AppointmentStatus.UNCONFIRMED,
            dateCreate =  stringToInstant(extractFromRow(columns, rowString, DATE_CREATE), DATE_CREATED_PATTERN),

            patient = extractPatient(extractFromRow(columns, rowString, PATIENT)) ?: return null,
            doctor = extractDoctor(extractFromRow(columns, rowString, DOCTOR)) ?: return null,
        )
    }

    private fun extractDoctor(stringId: String): DoctorEntity? {
        return doctorEntityRepository.findById(stringId.toInt()).getOrNull()
    }

    private fun extractPatient(stringId: String): PatientEntity? {
        return userEntityRepository.findByPatientId(stringId.toInt())
    }

    private fun stringToInstant(date: String, pattern: String): Instant {
        return LocalDate.parse(date, DateTimeFormatter.ofPattern(pattern))
            .atStartOfDay(ZoneOffset.UTC)
            .toInstant()
    }

    private fun extractFromRow(columns: Map<String, Int>, rowString: List<String>, col: String): String {
        return columns[col]?.let { rowString.getOrNull(it) } ?: throw Exception("Column $col not found")
    }
    companion object {
        const val DATE_CREATED_PATTERN = "d/MM/yyyy"
        const val LAST_UPDATED_PATTERN = "yyyyMMddHHmmss"

        // Column Names
        const val DETAIL = "Name"
        const val REASON = "Reason"
        const val NOTE = "Note"
        const val LAST_UPDATED = "LastUpdated"
        const val START_TIME = "StartTime"
        const val DURATION = "ApptDuration"
        const val START_DATE = "StartDate"
        const val PATIENT = "PT_Id_Fk"
        const val DOCTOR = "ProviderID"
        const val ID = "Id"
        const val DATE_CREATE = "CreationDate"
    }
}
