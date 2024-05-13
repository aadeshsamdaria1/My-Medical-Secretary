package com.mmsbackend.service

import com.google.api.core.ApiFuture
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.messaging.Message
import com.mmsbackend.config.FirebaseConfig
import com.mmsbackend.data.NotificationRequest
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.properties.NotificationProperties
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.justRun
import io.mockk.mockk
import io.mockk.mockkStatic
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import java.util.*

@ExtendWith(MockKExtension::class)
class NotificationServiceTest {

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var firebaseConfig: FirebaseConfig

    @MockK
    private lateinit var notificationProperties: NotificationProperties

    private val  filePath = UUID.randomUUID().toString()

    private val firebaseMessaging = mockk<FirebaseMessaging>()

    private val apiFuture = mockk<ApiFuture<String>>()

    @BeforeEach
    fun setUp() {
        mockkStatic(FirebaseMessaging::class)
        every { notificationProperties.filePath } returns filePath
        every { FirebaseMessaging.getInstance() } returns firebaseMessaging
        justRun { firebaseConfig.initializeFirebase() }
        every { firebaseMessaging.sendAsync(any<Message>()) } returns apiFuture
        every { apiFuture.get() } returns "Success"
    }

    @Test
    fun `send a message to a token`() {
        val request = NotificationRequest("deviceToken", "topic", "Sample Title", "Sample Body")
        val notificationService = NotificationService(userEntityRepository)

        val response = notificationService.sendMessageToToken(request)
        val expectedResponse = "Success"

        assertThat(response).isEqualTo(expectedResponse)
    }

    @Test
    fun `fail send a message because of faulty request`() {
        val request = NotificationRequest("", "topic", "Sample Title", "Sample Body")
        val notificationService = NotificationService(userEntityRepository)

        assertThrows<IllegalArgumentException> { notificationService.sendMessageToToken(request) }
    }

}