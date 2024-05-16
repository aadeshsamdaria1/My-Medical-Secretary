package com.mmsbackend.mapping

import com.mmsbackend.dto.user.AdminDTO
import com.mmsbackend.dto.user.PatientDTO
import com.mmsbackend.enums.StatusType
import com.mmsbackend.exception.ColumnError
import com.mmsbackend.exception.IdException
import com.mmsbackend.jpa.entity.user.AdminEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.service.security.UsernameService
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.security.crypto.password.PasswordEncoder
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.*
import kotlin.random.Random

@ExtendWith(MockKExtension::class)
class UserMapperTest {

    private lateinit var userMapper: UserMapper

    @MockK
    private lateinit var usernameService: UsernameService

    @MockK
    private lateinit var encoder: PasswordEncoder

    private val password = UUID.randomUUID().toString()
    private val username = UUID.randomUUID().toString()

    @BeforeEach
    fun setup() {
        every { encoder.encode(any() ) } returns password
        userMapper = UserMapper(usernameService, encoder)
        every { usernameService.generateUsernameFromName(any(), any()) } returns username
    }

    @Nested
    inner class Patient {

        private val patientId = Random.nextInt()
        private val firstname = UUID.randomUUID().toString()
        private val middleName = UUID.randomUUID().toString()
        private val surname = UUID.randomUUID().toString()
        private val dob = Instant.now()
        private val email = UUID.randomUUID().toString()
        private val address = UUID.randomUUID().toString()
        private val suburb = UUID.randomUUID().toString()
        private val state = UUID.randomUUID().toString()
        private val temporaryPassword = UUID.randomUUID().toString()

        private val patientDTO = PatientDTO(
            patientId, firstname, middleName, surname, dob, email, address, suburb, state
        )

        private val correctDOB = LocalDate.parse(
        "1/08/1965", DateTimeFormatter.ofPattern(UserMapper.DATE_PATTERN))
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant()
        private val incorrectTime = Instant.ofEpochMilli(Random.nextLong())

        private val correctId = Random.nextInt()
        private val incorrectId = Random.nextInt()

        private val correctMmsId = 0
        private val incorrectMmsId = Random.nextInt()

        private val expectedPatient = PatientEntity(
            firstname = "Correct first name",
            middleName = "Correct middle name",
            surname = "Correct surname",
            dob = correctDOB,
            address = "Correct address",
            suburb = "Correct suburb",
            state = "Correct state",
            email = "Correct email",
            patientId = correctId,
            mmsId = correctMmsId,
            password = password,
            username = username,
            accountActive = false,
            oneTimePasscode = null
        )

        @Test
        fun `Map a patient DTO to user entity`() {

            val patient = userMapper.mapPatientDTO(patientDTO)
            val mappedPatient = PatientEntity(
                0, email, password, username, patientId, firstname,
                middleName, surname, dob, address, suburb, state, false, null
            )
            assertThat(mappedPatient).usingRecursiveComparison().isEqualTo(patient)
        }

        @Test
        fun `Update existing patient`() {

            val oldPatient = PatientEntity(
                // These fields should not appear in final object
                firstname = "Incorrect first name",
                middleName = "Incorrect middle name",
                surname = "Incorrect surname",
                dob = incorrectTime,
                address = "Incorrect address",
                suburb = "Incorrect suburb",
                state = "Incorrect state",
                accountActive = false,
                oneTimePasscode = null,

                // These fields should appear in final object
                email = "Correct email",
                patientId = correctId,
                mmsId = correctMmsId,
                password = password,
                username = username
            )

            val newPatient = PatientEntity(
                // These fields should not appear in final object
                email = "Incorrect email",
                patientId = incorrectId,
                mmsId = incorrectMmsId,
                password = "password",
                username = "username",

                // These fields should appear in final object
                firstname = "Correct first name",
                middleName = "Correct middle name",
                surname = "Correct surname",
                dob = correctDOB,
                address = "Correct address",
                suburb = "Correct suburb",
                state = "Correct state",
                accountActive = true,
                oneTimePasscode = null
            )

            val mappedPatient = userMapper.updateExistingPatient(oldPatient, newPatient)
            assertThat(expectedPatient).usingRecursiveComparison().isEqualTo(mappedPatient)
        }

        @Test
        fun `Map a patient from HTML`() {

            val rowString = listOf(
                "Correct email", "Correct first name", "Correct middle name",
                "Correct surname", "1/08/1965", "Correct address", "", "Correct suburb",
                "Correct state", correctId.toString()
            )
            val cols = mapOf(
                "EmailAddress" to 0,
                "FirstName" to 1,
                "MiddleName" to 2,
                "Surname" to 3,
                "DOB" to 4,
                "AddressLine1" to 5,
                "AddressLine2" to 6,
                "Suburb" to 7,
                "State" to 8,
                "Id" to 9
            )
            val mappedPatient = userMapper.mapHtmlPatient(rowString, cols, mutableSetOf<String>())
            assertThat(mappedPatient).usingRecursiveComparison().isEqualTo(Pair(StatusType.SUCCESS, expectedPatient))
        }

        @Test
        fun `Map a patient from HTML even if optional col is missing`() {

            val rowString = listOf(
                "Correct email", "Correct first name", "Correct middle name",
                "Correct surname", "1/08/1965", correctId.toString()
            )
            val cols = mapOf(
                "EmailAddress" to 0,
                "FirstName" to 1,
                "MiddleName" to 2,
                "Surname" to 3,
                "DOB" to 4,
                "Id" to 5
            )
             val expectedResult = PatientEntity(
                 firstname = "Correct first name",
                 middleName = "Correct middle name",
                 surname = "Correct surname",
                 dob = correctDOB,
                 address = null,
                 suburb = null,
                 state = null,
                 email = "Correct email",
                 patientId = correctId,
                 mmsId = correctMmsId,
                 password = password,
                 username = username,
                 accountActive = false,
                 oneTimePasscode = null
             )
            val mappedPatient = userMapper.mapHtmlPatient(rowString, cols, mutableSetOf<String>())
            assertThat(mappedPatient).usingRecursiveComparison().isEqualTo(Pair(StatusType.SUCCESS, expectedResult))
        }

        @Test
        fun `Throw exception if data array is mismatch`() {
            val rowString = listOf(
                "Correct email", "Correct first name", "Correct middle name",
                "Correct surname", "1/08/1965", "Correct address", "", "Correct suburb",
                "Correct state" // Missing Patient ID field
            )
            val cols = mapOf(
                "EmailAddress" to 0,
                "FirstName" to 1,
                "MiddleName" to 2,
                "Surname" to 3,
                "DOB" to 4,
                "AddressLine1" to 5,
                "AddressLine2" to 6,
                "Suburb" to 7,
                "State" to 8,
                "Id" to 9
            )
            assertThrows<Exception> { userMapper.mapHtmlPatient(rowString, cols, mutableSetOf<String>()) }
        }

        @Test
        fun `Throw exception if data array has missing required col`() {
            val rowString = listOf(
                "Correct email", "Correct first name", "Correct middle name",
                "Correct surname", "1/08/1965", "Correct address", "", "Correct suburb",
                "Correct state", correctId.toString()
            )
            val cols = mapOf(
                "EmailAddress" to 0,
                "" to 1,
                "MiddleName" to 2,
                "Surname" to 3,
                "DOB" to 4,
                "AddressLine1" to 5,
                "AddressLine2" to 6,
                "Suburb" to 7,
                "State" to 8,
                "Id" to 9
            )
            assertThrows<ColumnError> { userMapper.mapHtmlPatient(rowString, cols, mutableSetOf<String>()) }
        }

        @Test
        fun `Throw exception if data array has missing required id col`() {
            val rowString = listOf(
                "Correct email", "Correct first name", "Correct middle name",
                "Correct surname", "1/08/1965", "Correct address", "", "Correct suburb",
                "Correct state", correctId.toString()
            )
            val cols = mapOf(
                "EmailAddress" to 0,
                "FirstName" to 1,
                "MiddleName" to 2,
                "Surname" to 3,
                "DOB" to 4,
                "AddressLine1" to 5,
                "AddressLine2" to 6,
                "Suburb" to 7,
                "State" to 8,
                "" to 9
            )
            assertThrows<ColumnError> { userMapper.mapHtmlPatient(rowString, cols, mutableSetOf<String>()) }
        }

        @Test
        fun `Return failure status if data array has missing required value`() {
            val rowString = listOf(
                "", "Correct first name", "Correct middle name",
                "Correct surname", "1/08/1965", "Correct address", "", "Correct suburb",
                "Correct state", correctId.toString()
            )
            val cols = mapOf(
                "EmailAddress" to 0,
                "FirstName" to 1,
                "MiddleName" to 2,
                "Surname" to 3,
                "DOB" to 4,
                "AddressLine1" to 5,
                "AddressLine2" to 6,
                "Suburb" to 7,
                "State" to 8,
                "Id" to 9
            )
            val mappedPatient = userMapper.mapHtmlPatient(rowString, cols, mutableSetOf<String>())
            val expectedResult = Pair(StatusType.FAILURE, correctId.toString())
            assertThat(mappedPatient).usingRecursiveComparison().isEqualTo(expectedResult)
        }

        @Test
        fun `Throw exception if data array has missing required id`() {
            val rowString = listOf(
                "", "Correct first name", "Correct middle name",
                "Correct surname", "1/08/1965", "Correct address", "", "Correct suburb",
                "Correct state", ""
            )
            val cols = mapOf(
                "EmailAddress" to 0,
                "FirstName" to 1,
                "MiddleName" to 2,
                "Surname" to 3,
                "DOB" to 4,
                "AddressLine1" to 5,
                "AddressLine2" to 6,
                "Suburb" to 7,
                "State" to 8,
                "Id" to 9
            )
            assertThrows<IdException> { userMapper.mapHtmlPatient(rowString, cols, mutableSetOf<String>()) }
        }
        @Test
        fun `Throw exception if data array has non-integer id`() {
            val rowString = listOf(
                "abc", "Correct first name", "Correct middle name",
                "Correct surname", "1/08/1965", "Correct address", "", "Correct suburb",
                "Correct state", "abc"
            )
            val cols = mapOf(
                "EmailAddress" to 0,
                "FirstName" to 1,
                "MiddleName" to 2,
                "Surname" to 3,
                "DOB" to 4,
                "AddressLine1" to 5,
                "AddressLine2" to 6,
                "Suburb" to 7,
                "State" to 8,
                "Id" to 9
            )
            assertThrows<IdException> { userMapper.mapHtmlPatient(rowString, cols, mutableSetOf<String>()) }
        }
    }

    @Nested
    inner class Admin {

        private val username = UUID.randomUUID().toString()
        private val email = UUID.randomUUID().toString()

        private val adminDTO = AdminDTO(username, email, password)

        @Test
        fun `Map Admin DTO to User Entity`() {
            val admin = userMapper.mapAdminDTO(adminDTO)
            val expectedAdmin = AdminEntity(
                mmsId = 0,
                email = email,
                password = password,
                username = username
            )
            assertThat(admin).usingRecursiveComparison().isEqualTo(expectedAdmin)
        }
    }
}
