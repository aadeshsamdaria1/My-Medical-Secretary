package com.mmsbackend.api.controllers

import com.mmsbackend.dto.MessageDTO
import com.mmsbackend.jpa.entity.MessageEntity
import com.mmsbackend.service.MessageService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/messages")
class MessageController(private val messageService: MessageService) {

    @PostMapping("/sendMessage")
    fun createMessage(@RequestBody messageRequest: MessageDTO): MessageEntity {
        return messageService.createMessage(messageRequest)
    }

    @GetMapping("/getMessages")
    fun getMessagesByPatientId(@RequestParam patientId: Int): List<MessageEntity> {
        return messageService.getMessagesByPatientId(patientId)
    }

    @DeleteMapping("/delete/{messageId}")
    fun deleteMessage(@PathVariable messageId: Int) {
        messageService.deleteMessage(messageId)
    }
}