package com.mmsbackend.api.controllers

import com.mmsbackend.jpa.entity.MessageEntity
import com.mmsbackend.service.MessageService
import org.springframework.web.bind.annotation.*
import java.security.Principal

@RestController
@RequestMapping("/messages")
class MessageController(private val messageService: MessageService) {

    @PostMapping
    fun createMessage(
        @RequestParam patientId: Int,
        @RequestParam text: String
    ): MessageEntity {
        return messageService.createMessage(patientId, text)
    }

    @GetMapping
    fun getMessages(
        @RequestParam patientId: Int,
        @RequestParam(required = false, defaultValue = "false") all: Boolean
    ): List<MessageEntity> {
        // If the request comes from an admin or if the request is to fetch all messages and the user is an admin
        return if (all) {
            messageService.getAllMessages()
        } else {
            messageService.getMessagesByPatientId(patientId)
        }
    }

    @DeleteMapping("/{messageId}")
    fun deleteMessage(@PathVariable messageId: Int) {
        messageService.deleteMessage(messageId)
    }
}