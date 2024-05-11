package com.mmsbackend.service

import com.google.api.core.ApiFuture
import com.google.firebase.FirebaseApp
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.messaging.Message
import com.mmsbackend.data.NotificationRequest
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import io.mockk.*
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.util.*
import kotlin.random.Random


// TODO: MockK test is most likely impossible, try another test
@ExtendWith(MockKExtension::class)
class NotificationServiceTest {

    //@MockK
    private lateinit var notificationService: NotificationService

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var firebaseMessaging: FirebaseMessaging

    @MockK
    private lateinit var user: PatientEntity

    private var patientId = Random.nextInt()
    private var deviceToken = UUID.randomUUID().toString()

    @BeforeEach
    fun setUp() {
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp()
        }
        mockkStatic(FirebaseMessaging::class)
        //every { FirebaseMessaging.getInstance() } returns mockk()
        val mockFirebaseMessaging = mockk<FirebaseMessaging>()

        every { FirebaseMessaging.getInstance() } returns mockFirebaseMessaging
        justRun { mockFirebaseMessaging.send(any<Message>()) }

        //every { FirebaseMessaging.getInstance() } returns firebaseMessaging
        //every { notificationService = NotificationService(userEntityRepository) }
        notificationService = NotificationService(userEntityRepository)
        every { userEntityRepository.findByPatientId(patientId) } returns user
        every { user.deviceToken } returns deviceToken
        every { FirebaseMessaging.getInstance().sendAsync(any<Message>()).get() } returns mockk()


//        every { FirebaseMessaging.getInstance() } returns mockFirebaseMessaging
//        every { mockFirebaseMessaging.send(any<Message>()) } returns mockk()
    }

    @Test
    fun `test sendMessageToToken`() {
        // Mock FirebaseMessaging
        //val firebaseMessaging = mockk<FirebaseMessaging>()

        // Mock NotificationService and inject the mocked FirebaseMessaging
        //val notificationService = NotificationService(firebaseMessaging)

        // Create a sample NotificationRequest
        val request = NotificationRequest("deviceToken", "topic", "Title", "Body")

        val apiFuture: ApiFuture<String> = mockk(relaxed = true)
        every { firebaseMessaging.sendAsync(any<Message>()) } returns apiFuture

        // Call the method under test
        notificationService.sendMessageToToken(request)

        // Verify that sendAsync was called with the correct parameters
        verify { firebaseMessaging.sendAsync(match<Message> { it.getProperty(deviceToken) == "deviceToken" }) }
    }

//    @Test
//    fun `send notification message to Firebase database`() {
//        val head = "NEW APPOINTMENT"
//        val body = "You have a new appointment!"
//
//        notificationService.sendFCMNotificationUser(patientId, head, body)
//        verify(exactly = 1) { notificationService.sendFCMNotificationUser(patientId, head, body) }
//    }


}