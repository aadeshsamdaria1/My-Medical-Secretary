package com.mmsbackend.service

import com.mmsbackend.config.FirebaseConfig
import com.mmsbackend.data.NotificationRequest
import com.mmsbackend.jpa.repository.UserEntityRepository
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

// This is not actual test, since deviceToken cannot be manually make from backend
@ExtendWith(MockKExtension::class)
class NotificationServiceTest {

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    private lateinit var firebaseConfig: FirebaseConfig

    @Test
    fun main() {

        firebaseConfig  = FirebaseConfig()
        firebaseConfig.initializeFirebase()

        // Create a sample NotificationRequest
        val request = NotificationRequest("deviceToken", "topic", "Sample Title", "Sample Body")

        // Create a NotificationService instance
        val notificationService = NotificationService(userEntityRepository)

        // Call the sendMessageToToken method
        try {
            notificationService.sendMessageToToken(request)
            println("Message sent successfully")
        } catch (e: Exception) {
            println("Failed to send message: ${e.message}")
        }
    }

}