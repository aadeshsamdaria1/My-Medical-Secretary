package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.GeneralValidation
import com.mmsbackend.dto.MessageDTO
import com.mmsbackend.jpa.entity.MessageEntity
import com.mmsbackend.jpa.util.SecurityContextHolderRetriever
import com.mmsbackend.service.MessageService
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.userdetails.UserDetails
import java.time.LocalDateTime

@ExtendWith(MockKExtension::class)
class MessageControllerTest {

    private lateinit var messageController: MessageController

    @MockK
    private lateinit var messageService: MessageService

    @MockK
    private lateinit var securityContextHolderRetriever: SecurityContextHolderRetriever

    @MockK
    private lateinit var generalValidation: GeneralValidation

    @MockK
    private lateinit var securityContext: SecurityContext

    @MockK
    private lateinit var authentication: Authentication

    @MockK
    private lateinit var userDetails: UserDetails

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
        messageController = MessageController(
            messageService,
            generalValidation,
            securityContextHolderRetriever)

        every { securityContextHolderRetriever.getSecurityContext() } returns userDetails
        every { securityContext.authentication } returns authentication
        every { generalValidation.isAdminOrSpecificPatientId(userDetails, any()) } returns true
    }

    @Test
    fun `createMessage should return created message`() {
        val timeCreated = LocalDateTime.of(2024, 5, 20, 10, 15, 30)
        val messageRequest = MessageDTO(patientId = 42, text = "Hello")
        val createdMessage = MessageEntity(messageId = 1, patientId = 42, text = "Hello", timeCreated = timeCreated)

        every { messageService.sendMessage(messageRequest) } returns createdMessage

        val response = messageController.sendMessage(messageRequest)
        val expectedResponse = ResponseEntity.ok().body("Successfully sent message with id 1")
        assertEquals(expectedResponse, response)
        verify { messageService.sendMessage(messageRequest) }
    }

    @Test
    fun `getMessagesByPatientId should return messages`() {
        val patientId = 42
        val timeCreated = LocalDateTime.of(2024, 5, 20, 10, 15, 30)
        val messages = listOf(
            MessageEntity(messageId = 1, patientId = 42, text = "Hello", timeCreated = timeCreated),
            MessageEntity(messageId = 2, patientId = 42, text = "World", timeCreated = timeCreated)
        )

        every { messageService.getMessagesByPatientId(patientId) } returns messages

        val response = messageController.getMessagesByPatientId(patientId)

        assertEquals(messages, response)
        verify { messageService.getMessagesByPatientId(patientId) }
    }

    @Test
    fun `deleteMessage should call service to delete message`() {
        val messageId = 1

        every { messageService.deleteMessage(messageId) } returns Unit

        messageController.deleteMessage(messageId)

        verify { messageService.deleteMessage(messageId) }
    }
}