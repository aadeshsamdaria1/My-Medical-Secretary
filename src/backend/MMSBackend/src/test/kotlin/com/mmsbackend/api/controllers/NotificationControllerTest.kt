package com.mmsbackend.api.controllers

import com.mmsbackend.data.DeviceTokenRequest
import com.mmsbackend.data.NotificationRequest
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.service.NotificationService
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.justRun
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.HttpStatus
import java.io.IOException

@ExtendWith(MockKExtension::class)
class NotificationControllerTest {

    @MockK
    private lateinit var notificationService: NotificationService

    @MockK
    private lateinit var patientEntityRepository: UserEntityRepository

    private lateinit var notificationController: NotificationController

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
        notificationController = NotificationController(notificationService, patientEntityRepository)
    }

    @Test
    fun `sendNotification should return OK response`() {
        val request = NotificationRequest("deviceToken", "Sample Title", "Sample Body")
        every { notificationService.sendMessageToToken(request) } returns "Success"

        val response = notificationController.sendNotification(request)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("Success", response.body)
    }

    @Test
    fun `sendNotification should handle IOException`() {
        val request = NotificationRequest("deviceToken", "Sample Title", "Sample Body")
        every { notificationService.sendMessageToToken(request) } throws IOException("Network Error")

        val response = notificationController.sendNotification(request)

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.statusCode)
        assertEquals("Failed to send notification: Network Error", response.body)
    }

    @Test
    fun `registerDeviceToken should return OK when patient exists`() {
        val request = DeviceTokenRequest(1, "deviceToken")
        val patient = mockk<PatientEntity>(relaxed = true)

        every { patientEntityRepository.findByPatientId(request.patientId) } returns patient
        justRun { patientEntityRepository.save(any<PatientEntity>()) }

        val response = notificationController.registerDeviceToken(request)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("Device token registered successfully", response.body)
    }

    @Test
    fun `registerDeviceToken should return NOT_FOUND when patient does not exist`() {
        val request = DeviceTokenRequest(1, "deviceToken")
        every { patientEntityRepository.findByPatientId(request.patientId) } returns null

        val response = notificationController.registerDeviceToken(request)

        assertEquals(HttpStatus.NOT_FOUND, response.statusCode)
        assertEquals("Patient not found", response.body)
    }

    @Test
    fun `getDeviceToken should return OK with token when patient exists`() {
        val patientId = 1
        val patient = mockk<PatientEntity>()
        every { patient.deviceToken } returns "deviceToken"
        every { patientEntityRepository.findByPatientId(patientId) } returns patient

        val response = notificationController.getDeviceToken(patientId)

        assertEquals(HttpStatus.OK, response.statusCode)
        assertNotNull(response.body)
        assertEquals("deviceToken", response.body?.deviceToken)
    }

    @Test
    fun `getDeviceToken should return NOT_FOUND when patient does not exist`() {
        val patientId = 1
        every { patientEntityRepository.findByPatientId(patientId) } returns null

        val response = notificationController.getDeviceToken(patientId)

        assertEquals(HttpStatus.NOT_FOUND, response.statusCode)
        assertNull(response.body)
    }

    @Test
    fun `getDeviceToken should return NOT_FOUND when patient has no token`() {
        val patientId = 1
        val patient = mockk<PatientEntity>()
        every { patient.deviceToken } returns null
        every { patientEntityRepository.findByPatientId(patientId) } returns patient

        val response = notificationController.getDeviceToken(patientId)

        assertEquals(HttpStatus.NOT_FOUND, response.statusCode)
        assertNull(response.body)
    }
}