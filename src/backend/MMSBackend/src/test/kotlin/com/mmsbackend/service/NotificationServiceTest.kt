package com.mmsbackend.service

import com.mmsbackend.data.NotificationRequest
import com.mmsbackend.jpa.repository.UserEntityRepository
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

@ExtendWith(MockKExtension::class)
class NotificationServiceTest {

    private lateinit var notificationService: NotificationService

    @MockK
    private lateinit var okHttpClient: OkHttpClient

    @MockK
    private lateinit var response: Response

    @MockK
    private lateinit var responseBody: ResponseBody

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
        notificationService = NotificationService(okHttpClient)
        every { okHttpClient.newCall(any()).execute() } returns response
        every { response.body } returns responseBody
        every { responseBody.string() } returns "{\"data\":{\"status\":\"ok\"}}"
        every { response.close() } just Runs
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