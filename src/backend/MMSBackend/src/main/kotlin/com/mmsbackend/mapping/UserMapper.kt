package com.mmsbackend.mapping

import com.mmsbackend.dto.user.AdminDTO
import com.mmsbackend.dto.user.PatientDTO
import com.mmsbackend.enums.UserType
import com.mmsbackend.jpa.entity.UserEntity
import org.jsoup.nodes.Element
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

@Service
class UserMapper {

    fun mapPatientDTO(patientDTO: PatientDTO): UserEntity{
        return UserEntity(
            userType = UserType.PATIENT,
            firstname = patientDTO.firstname,
            middleName = patientDTO.middleName,
            surname = patientDTO.surname,
            dob = patientDTO.dob,
            email = patientDTO.email,
            address = patientDTO.street,
            suburb = patientDTO.suburb,
            state = patientDTO.state,
            // ID is randomly generated
            id = 0
        )
    }

    fun mapAdminDTO(adminDTO: AdminDTO): UserEntity {
        return UserEntity(
            userType = UserType.ADMIN,
            firstname = adminDTO.firstname,
            middleName = null,
            surname = adminDTO.surname,
            dob = null,
            email = adminDTO.email,
            address = null,
            suburb = null,
            state = null,
            // ID is randomly generated
            id = 0
        )
    }

    fun mapHtmlUser(rowString: List<String>, columns: Map<String, Int>): UserEntity {

        return UserEntity(
            userType = UserType.PATIENT,
            firstname = extractFromRow(columns, rowString, FIRST_NAME),
            middleName = extractFromRow(columns, rowString, MIDDLE_NAME),
            surname = extractFromRow(columns, rowString, SURNAME),
            dob = stringToInstant(extractFromRow(columns, rowString, DOB)),
            email = extractFromRow(columns, rowString, EMAIL),
            suburb = extractFromRow(columns, rowString, SUBURB),
            state = extractFromRow(columns, rowString, STATE),
            id = extractFromRow(columns, rowString, ID).toInt(),
            address = mapAddress(
                extractFromRow(columns, rowString, ADDRESS1),
                extractFromRow(columns, rowString, ADDRESS2),
            )
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

    private fun mapAddress(address1: String, address2: String): String {
        return when {
            address1.isBlank() && address2.isBlank() -> ""
            address1.isBlank() -> address2
            address2.isBlank() -> address1
            else -> "$address1, $address2"
        }
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