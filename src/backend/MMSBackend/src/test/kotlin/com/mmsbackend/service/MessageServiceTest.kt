package com.mmsbackend.service

import com.mmsbackend.dto.MessageDTO
import com.mmsbackend.jpa.entity.MessageEntity
import com.mmsbackend.jpa.repository.MessageRepository
import io.mockk.MockKAnnotations
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.time.LocalDateTime

@ExtendWith(MockKExtension::class)
class MessageServiceTest {

    private lateinit var messageService: MessageService

    @MockK
    private lateinit var messageRepository: MessageRepository

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
        messageService = MessageService(messageRepository)
    }

    @Test
    fun `createMessage should save and return a new message`() {
        val timeCreated = LocalDateTime.of(2024, 5, 20, 10, 15, 30)
        val messageRequest = MessageDTO(patientId = 42, text = "Hello")
        val savedMessage = MessageEntity(messageId = 1, patientId = 42, text = "Hello", timeCreated = timeCreated)

        every { messageRepository.save(any<MessageEntity>()) } returns savedMessage

        val result = messageService.createMessage(messageRequest)

        assertEquals(savedMessage, result)
        verify { messageRepository.save(any<MessageEntity>()) }
    }

    @Test
    fun `getMessagesByPatientId should return messages for a patient`() {
        val patientId = 42
        val timeCreated1 = LocalDateTime.of(2024, 5, 20, 10, 15, 30)
        val timeCreated2 = LocalDateTime.of(2024, 5, 21, 11, 20, 35)
        val messages = listOf(
            MessageEntity(messageId = 1, patientId = 42, text = "Hello", timeCreated = timeCreated1),
            MessageEntity(messageId = 2, patientId = 42, text = "World", timeCreated = timeCreated2)
        )

        every { messageRepository.findByPatientId(patientId) } returns messages
        val result = messageService.getMessagesByPatientId(patientId)
        assertEquals(messages, result)
        verify { messageRepository.findByPatientId(patientId) }
    }

    @Test
    fun `deleteMessage should delete a message by message ID`() {
        val messageId = 1
        every { messageRepository.deleteById(messageId) } returns Unit
        messageService.deleteMessage(messageId)
        verify { messageRepository.deleteById(messageId) }
    }
}