package com.mmsbackend.mapping

import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.enums.AppointmentStatus
import com.mmsbackend.enums.StatusType
import com.mmsbackend.exception.*
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.UserMapper.Companion
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
    fun mapAppointmentDTO(appDTO: AppointmentDTO, patient: PatientEntity, doctor: DoctorEntity): AppointmentEntity {
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

            lastNotifiedTime = null,
            patient = patient,
            doctor = doctor,
            status = AppointmentStatus.ACTIVE
        )
    }

    fun updateExistingAppointment(existingApp: AppointmentEntity, updatedApp: AppointmentEntity): AppointmentEntity {
        val dateChanged = existingApp.startDate != updatedApp.startDate
        val timeChanged = existingApp.startTime != updatedApp.startTime

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
            patient = updatedApp.patient,
            doctor = updatedApp.doctor,

            // Existing Fields
            id = existingApp.id,
            dateCreate =  existingApp.dateCreate,
            status = AppointmentStatus.ACTIVE,
            lastNotifiedTime = if (dateChanged || timeChanged) null else existingApp.lastNotifiedTime
        )
    }

    fun mapHtmlAppointment(rowString: List<String>, columns: Map<String, Int>): Pair<StatusType, Any> {
        return try {
            val appointmentId = extractID(columns, rowString)
            try {
                appointmentId.toInt()
            } catch (e: NumberFormatException) {
                throw IdException()
            }
            val appointmentEntity = AppointmentEntity(
                id = appointmentId.toInt(),

                detail = extractFromRow(columns, rowString, DETAIL, appointmentId),
                reason = extractFromRow(columns, rowString, REASON, appointmentId),
                note = extractFromRow(columns, rowString, NOTE, appointmentId),
                lastUpdated = stringToInstant(extractFromRow(columns, rowString, LAST_UPDATED,appointmentId), LAST_UPDATED_PATTERN),
                startTime = Time.valueOf(extractFromRow(columns, rowString, START_TIME, appointmentId)),
                duration = extractFromRow(columns, rowString, DURATION, appointmentId).toInt(),
                userNote = "",
                startDate = SimpleDateFormat(DATE_CREATED_PATTERN).parse(extractFromRow(columns, rowString, START_DATE, appointmentId)),
                dateCreate =  stringToInstant(extractFromRow(columns, rowString, DATE_CREATE,appointmentId), DATE_CREATED_PATTERN),

                patient = extractPatient(extractFromRow(columns, rowString, PATIENT, appointmentId))
                    ?: return Pair(StatusType.FAILURE, appointmentId),
                doctor = extractDoctor(extractFromRow(columns, rowString, DOCTOR, appointmentId)),
                status = AppointmentStatus.ACTIVE,
                lastNotifiedTime = null
            )

            Pair(StatusType.SUCCESS, appointmentEntity)
        } catch (e: ValueException) {
            Pair(StatusType.FAILURE, e.id)
        }
    }

    private fun extractDoctor(stringId: String): DoctorEntity {
        return doctorEntityRepository.findById(stringId.toInt()).getOrNull()
            ?: throw DoctorMissingException(stringId.toInt(), "Doctor missing")
    }

    private fun extractPatient(stringId: String): PatientEntity? {
        return userEntityRepository.findByPatientId(stringId.toInt())
    }

    private fun stringToInstant(date: String, pattern: String): Instant {
        return LocalDate.parse(date, DateTimeFormatter.ofPattern(pattern))
            .atStartOfDay(ZoneOffset.UTC)
            .toInstant()
    }

    private fun extractID(columns: Map<String, Int>, rowString: List<String>): String {
        val cell = columns[ID] ?: throw ColumnError(ID)
        return rowString[cell].ifEmpty { throw IdException() }
    }

    private fun extractFromRow(columns: Map<String, Int>, rowString: List<String>, col: String, id: String): String {
        val cell = columns[col] ?: throw ColumnError(col)
        return rowString[cell].ifEmpty { throw ValueException(id, col) }
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
