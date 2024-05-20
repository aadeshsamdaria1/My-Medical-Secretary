package com.mmsbackend.service

import com.mmsbackend.jpa.entity.MessageEntity
import com.mmsbackend.jpa.repository.MessageRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class MessageService(private val messageRepository: MessageRepository) {

    fun createMessage(patientId: Int, text: String): MessageEntity {
        val message = MessageEntity(patientId = patientId, text = text, timeCreated = LocalDateTime.now())
        return messageRepository.save(message)
    }

    fun getMessagesByPatientId(patientId: Int): List<MessageEntity> {
        return messageRepository.findByPatientId(patientId)
    }

    fun getAllMessages(): List<MessageEntity> {
        return messageRepository.findAll()
    }

    fun deleteMessage(messageId: Int) {
        messageRepository.deleteById(messageId)
    }
}