package com.mmsbackend.service

import com.mmsbackend.data.NotificationRequest
import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.enums.AppointmentStatus
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import io.mockk.*
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import okhttp3.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import java.io.IOException
import java.sql.Time
import java.text.SimpleDateFormat
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.*

@ExtendWith(MockKExtension::class)
class NotificationServiceTest {

    private lateinit var notificationService: NotificationService

    @MockK
    private lateinit var okHttpClient: OkHttpClient

    @MockK
    private lateinit var response: Response

    @MockK
    private lateinit var responseBody: ResponseBody

    private lateinit var appointment: AppointmentEntity

    @MockK
    private lateinit var patient: PatientEntity
    @MockK
    private lateinit var doctor: DoctorEntity

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
        notificationService = NotificationService(okHttpClient)
        every { okHttpClient.newCall(any()).execute() } returns response
        every { response.body } returns responseBody
        every { responseBody.string() } returns "{\"data\":{\"status\":\"ok\"}}"
        every { response.close() } just Runs

        appointment = AppointmentEntity(
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
            doctor = doctor,
            status = AppointmentStatus.ACTIVE
        )
    }

    @Test
    fun `send a message to a token`() {
        val request = NotificationRequest("validDeviceToken", "Sample Title", "Sample Body")
        every { response.isSuccessful } returns true
        val json = notificationService.sendMessageToToken(request)

        assertEquals("{\"data\":{\"status\":\"ok\"}}", json)
    }

    @Test
    fun `fail send a message because of faulty request`() {
        val request = NotificationRequest("", "Sample Title", "Sample Body")
        every { okHttpClient.newCall(any()).execute() } throws IOException("Unexpected code Response{}")

        assertThrows<IOException> { notificationService.sendMessageToToken(request) }
    }

    @Test
    fun `test sending message to token with unsuccessful response`() {
        val response = mockk<Response>()
        val responseBody = mockk<ResponseBody>()

        every { response.isSuccessful } returns false
        every { response.body } returns responseBody
        every { responseBody.string() } returns "Response Body"
        every { okHttpClient.newCall(any()).execute() } returns response

        val request = NotificationRequest("deviceToken", "Sample Title", "Sample Body")
        val result = runCatching { notificationService.sendMessageToToken(request) }

        assertThat(result.exceptionOrNull()).isInstanceOf(IOException::class.java)
        assertThat(result.exceptionOrNull()?.message).isEqualTo("Unexpected code $response")

        verify { response.isSuccessful }
    }

}