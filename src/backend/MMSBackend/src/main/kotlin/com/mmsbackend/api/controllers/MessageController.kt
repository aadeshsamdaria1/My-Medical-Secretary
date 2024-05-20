package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.GeneralValidation
import com.mmsbackend.dto.MessageDTO
import com.mmsbackend.jpa.entity.MessageEntity
import com.mmsbackend.jpa.util.SecurityContextHolderRetriever
import com.mmsbackend.service.MessageService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/messages")
class MessageController(
    private val messageService: MessageService,
    private val generalValidation: GeneralValidation,
    private val securityContextHolderRetriever: SecurityContextHolderRetriever
) {

    @PostMapping("/sendMessage")
    fun createMessage(@RequestBody messageRequest: MessageDTO): MessageEntity {
        return messageService.createMessage(messageRequest)
    }

    @GetMapping("/getMessages")
    fun getMessagesByPatientId(@PathVariable patientId: Int): List<MessageEntity> {
        val userDetails = securityContextHolderRetriever.getSecurityContext()
        return if (generalValidation.isSpecificPatient(userDetails, patientId)) {
            messageService.getMessagesByPatientId(patientId)
        } else {
            throw ResponseStatusException(HttpStatus.FORBIDDEN)
        }
    }

    @DeleteMapping("/delete/{messageId}")
    fun deleteMessage(@PathVariable messageId: Int) {
        messageService.deleteMessage(messageId)
    }
}