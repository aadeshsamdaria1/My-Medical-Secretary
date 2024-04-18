package com.mmsbackend.mapping

import com.mmsbackend.data.Name
import com.mmsbackend.dto.user.AdminDTO
import com.mmsbackend.dto.user.PatientDTO
import com.mmsbackend.jpa.entity.user.AdminEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
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

    fun mapHtmlPatient(rowString: List<String>, columns: Map<String, Int>): PatientEntity {

        // TODO: Decide which fields are actually necessary, and allow others to be missing

        val firstname = extractFromRow(columns, rowString, FIRST_NAME)
        val surname = extractFromRow(columns, rowString, SURNAME)
        val name = Name(firstname = firstname, surname = surname)

        val plainTextPassword = passwordService.generateSecurePassword()

        return PatientEntity(

            // Compulsory columns
            firstname = firstname,
            surname = surname,
            email = extractFromRow(columns, rowString, EMAIL),
            dob = stringToInstant(extractFromRow(columns, rowString, DOB)),
            patientId = extractFromRow(columns, rowString, ID).toInt(),

            // Optional columns
            middleName = extractFromRow(columns, rowString, MIDDLE_NAME),
            suburb = extractFromRow(columns, rowString, SUBURB),
            state = extractFromRow(columns, rowString, STATE),
            address = mapAddress(
                extractFromRow(columns, rowString, ADDRESS1),
                extractFromRow(columns, rowString, ADDRESS2),
            ),

            // Randomly Generated
            mmsId = 0,
            username = passwordService.generateUsernameFromName(name),
            password = encoder.encode(plainTextPassword),
            temporaryPassword = plainTextPassword
        )
    }

    private fun extractFromRow(columns: Map<String, Int>, rowString: List<String>, col: String): String {
        return columns[col]?.let { rowString.getOrNull(it) } ?: throw Exception("Data missing for column $col.")
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
