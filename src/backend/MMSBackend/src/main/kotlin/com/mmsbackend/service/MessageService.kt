package com.mmsbackend.service

import com.mmsbackend.data.NotificationRequest
import com.mmsbackend.dto.MessageDTO
import com.mmsbackend.jpa.entity.MessageEntity
import com.mmsbackend.jpa.repository.MessageRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class MessageService(private val messageRepository: MessageRepository) {

    fun createMessage(messageRequest: MessageDTO): MessageEntity {
        val message = MessageEntity(
            patientId = messageRequest.patientId,
            text = messageRequest.text,
            timeCreated = LocalDateTime.now())
        return messageRepository.save(message)
    }

    fun getMessagesByPatientId(patientId: Int): List<MessageEntity> {
        return messageRepository.findByPatientId(patientId)
    }

    fun deleteMessage(messageId: Int) {
        messageRepository.deleteById(messageId)
    }
}