package com.mmsbackend.service

import com.mmsbackend.enums.AppointmentStatus
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import io.mockk.*
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.sql.Time
import java.text.SimpleDateFormat
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.Date

@ExtendWith(MockKExtension::class)
class AppointmentReminderServiceTest {

    private lateinit var appointmentReminderService: AppointmentReminderService

    @MockK
    private lateinit var appointmentEntityRepository: AppointmentEntityRepository

    @MockK
    private lateinit var notificationService: NotificationService

    private lateinit var appointmentEntity: AppointmentEntity

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
        appointmentReminderService = AppointmentReminderService(appointmentEntityRepository, notificationService)
    }

    @Test
    fun `send reminders successfully`() {
        val patient = mockk<PatientEntity> {
            every { accountActive } returns true
            every { deviceToken } returns "validDeviceToken"
        }

        val appointment = AppointmentEntity(
            id = 1,
            detail = "Correct Detail",
            reason = "Correct Reason",
            note = "Correct Note",
            dateCreate = LocalDate.parse(
                "10/01/2024", DateTimeFormatter.ofPattern(AppointmentMapper.DATE_CREATED_PATTERN))
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant(),
            lastUpdated = Instant.parse("2020-04-15T00:00:00Z"),
            startTime = Time.valueOf("10:00:00"),
            startDate = SimpleDateFormat("dd/MM/yyyy").parse("7/02/2024"),
            duration = 30,
            userNote = "",
            patient = patient,
            doctor = mockk<DoctorEntity>(),
            status = AppointmentStatus.ACTIVE
        )

        val appointments = listOf(appointment)

        every { appointmentEntityRepository.findByStartTimeBetween(any(), any()) } returns appointments
        every { appointmentEntityRepository.save(any()) } returns appointment
        justRun { notificationService.sendAppointmentReminder(any(), any()) }

        val instantMock = mockk<Instant>()
        every { instantMock.isAfter(any()) } returns true

        appointmentReminderService.sendReminders()

        verify(exactly = 1) { notificationService.sendAppointmentReminder(patient, appointment) }
        verify(exactly = 1) { appointmentEntityRepository.save(appointment) }
    }

    @Test
    fun `do not send reminders if patient account is not active`() {
        val patient = mockk<PatientEntity> {
            every { accountActive } returns false
            every { deviceToken } returns "validDeviceToken"
        }

        val appointment = mockk<AppointmentEntity> {
            every { startDate } returns Date.from(Instant.now().plus(2, ChronoUnit.DAYS))
            every { startTime } returns mockk() {
                every { toLocalTime() } returns java.time.LocalTime.now()
            }
            every { lastNotifiedTime } returns null
        }

        val appointments = listOf(appointment)
        every { appointment.patient } returns patient
        every { appointmentEntityRepository.findByStartTimeBetween(any(), any()) } returns appointments

        appointmentReminderService.sendReminders()

        verify(exactly = 0) { notificationService.sendAppointmentReminder(any(), any()) }
        verify(exactly = 0) { appointmentEntityRepository.save(any()) }
    }

    @Test
    fun `do not send reminders if patient device token is null`() {
        val patient = mockk<PatientEntity> {
            every { accountActive } returns true
            every { deviceToken } returns null
        }

        val appointment = mockk<AppointmentEntity> {
            every { startDate } returns Date.from(Instant.now().plus(2, ChronoUnit.DAYS))
            every { startTime } returns mockk() {
                every { toLocalTime() } returns java.time.LocalTime.now()
            }
            every { lastNotifiedTime } returns null
        }

        val appointments = listOf(appointment)
        every { appointment.patient } returns patient

        every { appointmentEntityRepository.findByStartTimeBetween(any(), any()) } returns appointments

        appointmentReminderService.sendReminders()

        verify(exactly = 0) { notificationService.sendAppointmentReminder(any(), any()) }
        verify(exactly = 0) { appointmentEntityRepository.save(any()) }
    }

    @Test
    fun `do not send reminders if last notified time is noy null`() {
        val patient = mockk<PatientEntity> {
            every { accountActive } returns true
            every { deviceToken } returns "validDeviceToken"
        }

        val appointment = AppointmentEntity(
            id = 1,
            detail = "Correct Detail",
            reason = "Correct Reason",
            note = "Correct Note",
            dateCreate = LocalDate.parse(
                "10/01/2024", DateTimeFormatter.ofPattern(AppointmentMapper.DATE_CREATED_PATTERN))
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant(),
            lastUpdated = Instant.parse("2020-04-15T00:00:00Z"),
            startTime = Time.valueOf("10:00:00"),
            startDate = SimpleDateFormat("dd/MM/yyyy").parse("7/02/2024"),
            duration = 30,
            userNote = "",
            patient = patient,
            doctor = mockk<DoctorEntity>(),
            status = AppointmentStatus.ACTIVE,
            lastNotifiedTime = Instant.parse("2020-04-15T00:00:00Z")
        )

        val appointments = listOf(appointment)

        every { appointmentEntityRepository.findByStartTimeBetween(any(), any()) } returns appointments
        every { appointmentEntityRepository.save(any()) } returns appointment
        justRun { notificationService.sendAppointmentReminder(any(), any()) }

        val instantMock = mockk<Instant>()
        every { instantMock.isAfter(any()) } returns true
        appointmentReminderService.sendReminders()

        verify(exactly = 0) { notificationService.sendAppointmentReminder(any(), any()) }
        verify(exactly = 0) { appointmentEntityRepository.save(any()) }
    }

}

