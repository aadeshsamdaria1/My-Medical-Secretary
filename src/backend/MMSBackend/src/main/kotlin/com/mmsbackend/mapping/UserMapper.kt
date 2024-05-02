package com.mmsbackend.mapping

import com.mmsbackend.data.Name
import com.mmsbackend.dto.user.AdminDTO
import com.mmsbackend.dto.user.PatientDTO
import com.mmsbackend.jpa.entity.user.AdminEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.enums.StatusType
import com.mmsbackend.exception.ColumnError
import com.mmsbackend.exception.IdException
import com.mmsbackend.exception.ValueException
import com.mmsbackend.service.security.PasswordService
import com.mmsbackend.util.mapAddress
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

@Service
class UserMapper(
    val passwordService: PasswordService,
    val encoder: PasswordEncoder
) {

    fun mapPatientDTO(patientDTO: PatientDTO): PatientEntity {
        val name = Name(
            firstname = patientDTO.firstname,
            surname = patientDTO.surname
        )

        val plaintextPassword = passwordService.generateSecurePassword()

        return PatientEntity(
            firstname = patientDTO.firstname,
            middleName = patientDTO.middleName,
            surname = patientDTO.surname,
            dob = patientDTO.dob,
            email = patientDTO.email,
            address = patientDTO.address,
            suburb = patientDTO.suburb,
            state = patientDTO.state,
            patientId = patientDTO.patientId,

            // Generated
            mmsId = 0,
            username = passwordService.generateUsernameFromName(name),
            password = encoder.encode(plaintextPassword),
            temporaryPassword = plaintextPassword
        )
    }

    fun mapAdminDTO(adminDTO: AdminDTO): AdminEntity {
        return AdminEntity(
            email = adminDTO.email,
            username = adminDTO.username,

            // Randomly Generated
            mmsId = 0,
            password = encoder.encode(adminDTO.password)
        )
    }

    fun updateExistingPatient(existingPatient: PatientEntity, updatedPatient: PatientEntity): PatientEntity {
        return PatientEntity(

            // Updated fields
            firstname = updatedPatient.firstname,
            middleName = updatedPatient.middleName,
            surname = updatedPatient.surname,
            dob = updatedPatient.dob,
            address = updatedPatient.address,
            suburb = updatedPatient.suburb,
            state = updatedPatient.state,
            temporaryPassword = updatedPatient.temporaryPassword,

            // Unchanged fields
            email = existingPatient.email,
            patientId = existingPatient.patientId,
            mmsId = existingPatient.mmsId,
            username = existingPatient.username,
            password = existingPatient.password,
        )
    }

    fun updateExistingAdmin(existingAdmin: AdminEntity, updatedAdmin: AdminEntity): AdminEntity {
        return AdminEntity(

            // Updated fields
            email = updatedAdmin.email,

            // Unchanged fields
            password = existingAdmin.password,
            mmsId = existingAdmin.mmsId,
            username = existingAdmin.username
        )
    }

    fun mapHtmlPatient(rowString: List<String>, columns: Map<String, Int>): Pair<StatusType, Any> {

        return try {
            val patientId = extractID(columns, rowString)
            try {
                patientId.toInt()
            } catch (e: NumberFormatException) {
                throw IdException()
            }
            val firstname = extractFromRow(columns, rowString, FIRST_NAME, patientId)
            val surname = extractFromRow(columns, rowString, SURNAME, patientId)
            val name = Name(firstname = firstname, surname = surname)

            val plainTextPassword = passwordService.generateSecurePassword()

            val patientEntity = PatientEntity(
                firstname = firstname,
                surname = surname,
                email = extractFromRow(columns, rowString, EMAIL, patientId),
                dob = stringToInstant(extractFromRow(columns, rowString, DOB, patientId)),
                patientId = patientId.toInt(),
                middleName = extractFromRowOptional(columns, rowString, MIDDLE_NAME),
                suburb = extractFromRowOptional(columns, rowString, SUBURB),
                state = extractFromRowOptional(columns, rowString, STATE),
                address = mapAddress(
                    extractFromRowOptional(columns, rowString, ADDRESS1),
                    extractFromRowOptional(columns, rowString, ADDRESS2),
                ),
                // Randomly Generated
                mmsId = 0,
                username = passwordService.generateUsernameFromName(name),
                password = encoder.encode(plainTextPassword),
                temporaryPassword = plainTextPassword
            )

            Pair(StatusType.SUCCESS, patientEntity)

        // If one of required col's value is empty, return status fail and return the patient id
        } catch (e: ValueException) {
            Pair(StatusType.FAILURE, e.id)
        }
    }

    // Extract id from the row, with the assumption Genie always generated some ids
    private fun extractID(columns: Map<String, Int>, rowString: List<String>): String {
        val cell = columns[ID] ?: throw ColumnError(ID)
        return rowString[cell].ifEmpty { throw IdException() }
    }

    // Extract value for compulsory col, return exception if value is null
    private fun extractFromRow(columns: Map<String, Int>, rowString: List<String>, col: String, id:String): String {
        val cell = columns[col] ?: throw ColumnError(col)
        return rowString[cell].ifEmpty { throw ValueException(id, col) }
    }

    // Extract value for optional col, return empty string if value is null
    private fun extractFromRowOptional(columns: Map<String, Int>, rowString: List<String>, col: String): String? {
        return columns[col]?.let { rowString.getOrNull(it) }
    }

    private fun stringToInstant(date: String): Instant {
        return LocalDate.parse(date, DateTimeFormatter.ofPattern(DATE_PATTERN))
            .atStartOfDay(ZoneOffset.UTC)
            .toInstant()
    }

    companion object {
        const val DATE_PATTERN = "d/MM/yyyy"

        // Column Names
        const val FIRST_NAME = "FirstName"
        const val MIDDLE_NAME = "MiddleName"
        const val SURNAME = "Surname"
        const val DOB = "DOB"
        const val EMAIL = "EmailAddress"
        const val ADDRESS1 = "AddressLine1"
        const val ADDRESS2 = "AddressLine2"
        const val SUBURB = "Suburb"
        const val STATE = "State"
        const val ID = "Id"
    }
}
