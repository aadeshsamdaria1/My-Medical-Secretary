package com.mmsbackend.mapping

import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.enums.StatusType
import com.mmsbackend.exception.ColumnError
import com.mmsbackend.exception.IdException
import com.mmsbackend.exception.ValueException
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import java.sql.Time
import java.time.format.DateTimeFormatter
import kotlin.jvm.optionals.getOrNull
import kotlin.random.Random
import java.text.SimpleDateFormat
import java.time.*

@ExtendWith(MockKExtension::class)
class AppointmentMapperTest {

    private lateinit var appointmentMapper: AppointmentMapper

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var doctorEntityRepository: DoctorEntityRepository

    private val patientId = Random.nextInt()
    private val doctorId = Random.nextInt()
    private val appointmentId = Random.nextInt()

    private lateinit var patient: PatientEntity
    private lateinit var doctor: DoctorEntity
    private lateinit var appointmentDTO: AppointmentDTO
    private lateinit var expectedAppointment: AppointmentEntity

    @BeforeEach
    fun setup() {
        appointmentMapper = AppointmentMapper(userEntityRepository, doctorEntityRepository)

        patient = PatientEntity(
            mmsId = 0,
            email = "correct.email@example.com",
            password = "securePassword",
            username = "patientUsername",
            patientId = patientId,
            firstname = "John",
            middleName = "A.",
            surname = "Doe",
            dob = Instant.now(),
            address = "123 Correct Street",
            suburb = "Correct Suburb",
            state = "Correct State",
            accountActive = true,
            oneTimePasscode = null,
            deviceToken = null
        )

        doctor = DoctorEntity(
                id = doctorId,
                name = "Dr. Correct Smith",
                address = "456 Correct Clinic Ave",
                contact = "123-456-7890",
                email = "correct.doc@example.com",
                expertise = "General Practice",
                website = "www.correctdocsmith.com"
        )

        appointmentDTO = AppointmentDTO(
                id = appointmentId,
                detail = "Correct Detail",
                reason = "Correct Reason",
                note = "Correct Note",
                dateCreate =  LocalDate.parse(
                        "10/01/2024", DateTimeFormatter.ofPattern(AppointmentMapper.DATE_CREATED_PATTERN))
                        .atStartOfDay(ZoneOffset.UTC)
                        .toInstant(),
                lastUpdated = Instant.parse("2020-04-15T00:00:00Z"),
                startTime = Time.valueOf("10:00:00"),
                startDate = SimpleDateFormat("dd/MM/yyyy").parse("7/02/2024"),
                duration = 30,
                patientId = patientId,
                providerId = doctorId
        )

        expectedAppointment = AppointmentEntity(
                id = appointmentId,
                detail = "Correct Detail",
                reason = "Correct Reason",
                note = "Correct Note",
                dateCreate = appointmentDTO.dateCreate,
                lastUpdated = appointmentDTO.lastUpdated,
                startTime = appointmentDTO.startTime,
                startDate = appointmentDTO.startDate,
                duration = appointmentDTO.duration,
                userNote = "",
                patient = patient,
                doctor = doctor
        )

        every { userEntityRepository.findByPatientId(patientId) } returns patient
        every { doctorEntityRepository.findById(doctorId).getOrNull() } returns doctor
    }

    @Test
    fun `map AppointmentDTO to AppointmentEntity`() {
        val mappedAppointment = appointmentMapper.mapAppointmentDTO(appointmentDTO, patient, doctor)
        assertThat(mappedAppointment).usingRecursiveComparison().isEqualTo(expectedAppointment)
    }

    @Test
    fun `update existing AppointmentEntity`() {
        val existingAppointment = expectedAppointment.copy(
                // These fields should not appear in final object
                detail = "Incorrect Detail",
                reason = "Incorrect Reason",
                note = "Incorrect Note",
                startTime = Time.valueOf("09:00:00"),
                duration = 45,
                userNote = "Old Note",
                lastUpdated = Instant.parse("2022-04-15T00:00:00Z"),
                startDate = SimpleDateFormat("dd/MM/yyyy").parse("7/02/2022"),
                patient = PatientEntity(
                    mmsId = 1,
                    email = "incorrect.email@example.com",
                    password = "Incorrect Password",
                    username = "incorrect Patient Username",
                    patientId = patientId + 1,
                    firstname = "Incorrect John",
                    middleName = "Incorrect middleName",
                    surname = "Incorrect surname",
                    dob = Instant.ofEpochMilli(Random.nextLong()),
                    address = "Incorrect address",
                    suburb = "Incorrect Suburb",
                    state = "Incorrect State",
                    accountActive = true,
                    oneTimePasscode = null,
                    deviceToken = null
                ),
                doctor = DoctorEntity(
                        id = doctorId + 1,
                        name = "Incorrect name",
                        address = "Incorrect address",
                        contact = "Incorrect contact",
                        email = "Incorrect email",
                        expertise = "Incorrect expertise",
                        website = "Incorrect website"
                )
        )

        val updatedAppointment = expectedAppointment.copy(
                // These fields should not appear in final object
                id = appointmentId + 1,
                dateCreate =  LocalDate.parse(
                        "10/01/2022", DateTimeFormatter.ofPattern(AppointmentMapper.DATE_CREATED_PATTERN))
                        .atStartOfDay(ZoneOffset.UTC)
                        .toInstant(),
        )

        val mappedUpdate = appointmentMapper.updateExistingAppointment(existingAppointment, updatedAppointment)
        assertThat(mappedUpdate).usingRecursiveComparison().isEqualTo(expectedAppointment)
    }

    @Test
    fun `Map an appointment from HTML`() {
        val rowString = listOf(
                appointmentId.toString(),
                "Correct Detail",
                "Correct Reason",
                "Correct Note",
                "20200415123000",
                "10:00:00",
                "30",
                "7/02/2024", // StartDate
                "10/01/2024", // CreationDate
                patientId.toString(),
                doctorId.toString()
        )
        val cols = mapOf(
                "Id" to 0,
                "Name" to 1,
                "Reason" to 2,
                "Note" to 3,
                "LastUpdated" to 4,
                "StartTime" to 5,
                "ApptDuration" to 6,
                "StartDate" to 7,
                "CreationDate" to 8,
                "PT_Id_Fk" to 9,
                "ProviderID" to 10
        )
        val mappedAppointment = appointmentMapper.mapHtmlAppointment(rowString, cols)
        assertThat(mappedAppointment).usingRecursiveComparison().isEqualTo(Pair(StatusType.SUCCESS,expectedAppointment))
    }

    @Test
    fun `Throw column exception if missing required column`() {
        val rowString = listOf(
            appointmentId.toString(),
            "Correct Detail",
            "Correct Reason",
            "Correct Note",
            "20200415123000",
            "10:00:00",
            "30",
            "7/02/2024", // StartDate
            "10/01/2024", // CreationDate
            patientId.toString()
        )
        val cols = mapOf(
            "Id" to 0,
            "Name" to 1,
            "Reason" to 2,
            "Note" to 3,
            "LastUpdated" to 4,
            "StartTime" to 5,
            "ApptDuration" to 6,
            "StartDate" to 7,
            "CreationDate" to 8,
            "PT_Id_Fk" to 9
        )
        assertThrows<ColumnError> { appointmentMapper.mapHtmlAppointment(rowString, cols) }
    }

    @Test
    fun `Throw column exception if missing required id column`() {
        val rowString = listOf(
            appointmentId.toString(),
            "Correct Detail",
            "Correct Reason",
            "Correct Note",
            "20200415123000",
            "10:00:00",
            "30",
            "7/02/2024", // StartDate
            "10/01/2024", // CreationDate
            patientId.toString()
        )
        val cols = mapOf(
            "" to 0,
            "Name" to 1,
            "Reason" to 2,
            "Note" to 3,
            "LastUpdated" to 4,
            "StartTime" to 5,
            "ApptDuration" to 6,
            "StartDate" to 7,
            "CreationDate" to 8,
            "PT_Id_Fk" to 9
        )
        assertThrows<ColumnError> { appointmentMapper.mapHtmlAppointment(rowString, cols) }
    }

    @Test
    fun `Throw id exception if missing required id value`() {
        val rowString = listOf(
            "",
            "",
            "Correct Reason",
            "Correct Note",
            "20200415123000",
            "10:00:00",
            "30",
            "7/02/2024", // StartDate
            "10/01/2024", // CreationDate
            patientId.toString(),
            doctorId.toString()
        )
        val cols = mapOf(
            "Id" to 0,
            "Name" to 1,
            "Reason" to 2,
            "Note" to 3,
            "LastUpdated" to 4,
            "StartTime" to 5,
            "ApptDuration" to 6,
            "StartDate" to 7,
            "CreationDate" to 8,
            "PT_Id_Fk" to 9,
            "ProviderID" to 10
        )
        assertThrows<IdException> { appointmentMapper.mapHtmlAppointment(rowString, cols) }
    }
    @Test
    fun `Throw id exception if id value is non-Integer`() {
        val rowString = listOf(
            "abcs",
            "",
            "Correct Reason",
            "Correct Note",
            "20200415123000",
            "10:00:00",
            "30",
            "7/02/2024", // StartDate
            "10/01/2024", // CreationDate
            patientId.toString(),
            doctorId.toString()
        )
        val cols = mapOf(
            "Id" to 0,
            "Name" to 1,
            "Reason" to 2,
            "Note" to 3,
            "LastUpdated" to 4,
            "StartTime" to 5,
            "ApptDuration" to 6,
            "StartDate" to 7,
            "CreationDate" to 8,
            "PT_Id_Fk" to 9,
            "ProviderID" to 10
        )
        assertThrows<IdException> { appointmentMapper.mapHtmlAppointment(rowString, cols) }
    }

    @Test
    fun `Return failed status if an appointment from HTML has missing value`() {
        val rowString = listOf(
            appointmentId.toString(),
            "",
            "Correct Reason",
            "Correct Note",
            "20200415123000",
            "10:00:00",
            "30",
            "7/02/2024", // StartDate
            "10/01/2024", // CreationDate
            patientId.toString(),
            doctorId.toString()
        )
        val cols = mapOf(
            "Id" to 0,
            "Name" to 1,
            "Reason" to 2,
            "Note" to 3,
            "LastUpdated" to 4,
            "StartTime" to 5,
            "ApptDuration" to 6,
            "StartDate" to 7,
            "CreationDate" to 8,
            "PT_Id_Fk" to 9,
            "ProviderID" to 10
        )
        val mappedAppointment = appointmentMapper.mapHtmlAppointment(rowString, cols)
        assertThat(mappedAppointment).usingRecursiveComparison()
            .isEqualTo(Pair(StatusType.FAILURE,appointmentId.toString()))
    }
}
