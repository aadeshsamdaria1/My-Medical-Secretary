package com.mmsbackend.mapping

import com.mmsbackend.dto.user.AdminDTO
import com.mmsbackend.dto.user.PatientDTO
import com.mmsbackend.jpa.entity.AdminEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.util.mapAddress
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

@Service
class UserMapper {

    fun mapPatientDTO(patientDTO: PatientDTO): PatientEntity{
        return PatientEntity(
            firstname = patientDTO.firstname,
            middleName = patientDTO.middleName,
            surname = patientDTO.surname,
            dob = patientDTO.dob,
            email = patientDTO.email,
            address = patientDTO.street,
            suburb = patientDTO.suburb,
            state = patientDTO.state,
            patientId = patientDTO.patientId,

            // Randomly Generated
            mmsId = 0
        )
    }

    fun mapAdminDTO(adminDTO: AdminDTO): AdminEntity {
        return AdminEntity(
            email = adminDTO.email,
            username = adminDTO.username,

            // Randomly Generated
            mmsId = 0
        )
    }

    fun updateExistingPatient(existingPatient: PatientEntity, updatedPatient: PatientEntity): PatientEntity{
        return PatientEntity(

            // Updated fields
            firstname = updatedPatient.firstname,
            middleName = updatedPatient.middleName,
            surname = updatedPatient.surname,
            dob = updatedPatient.dob,
            address = updatedPatient.address,
            suburb = updatedPatient.suburb,
            state = updatedPatient.state,

            // Unchanged fields
            email = existingPatient.email,
            patientId = existingPatient.patientId,
            mmsId = existingPatient.mmsId
        )
    }

    fun mapHtmlPatient(rowString: List<String>, columns: Map<String, Int>): PatientEntity {

        return PatientEntity(
            firstname = extractFromRow(columns, rowString, FIRST_NAME),
            middleName = extractFromRow(columns, rowString, MIDDLE_NAME),
            surname = extractFromRow(columns, rowString, SURNAME),
            dob = stringToInstant(extractFromRow(columns, rowString, DOB)),
            email = extractFromRow(columns, rowString, EMAIL),
            suburb = extractFromRow(columns, rowString, SUBURB),
            state = extractFromRow(columns, rowString, STATE),
            patientId = extractFromRow(columns, rowString, ID).toInt(),
            address = mapAddress(
                extractFromRow(columns, rowString, ADDRESS1),
                extractFromRow(columns, rowString, ADDRESS2),
            ),

            // Randomly Generated
            mmsId = 0
        )
    }

    private fun extractFromRow(columns: Map<String, Int>, rowString: List<String>, col: String): String {
        return columns[col]?.let { rowString.getOrNull(it) } ?: throw Exception("zara")
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
