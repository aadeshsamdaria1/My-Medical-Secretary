package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.GeneralValidation
import com.mmsbackend.dto.MessageDTO
import com.mmsbackend.jpa.entity.MessageEntity
import com.mmsbackend.jpa.util.SecurityContextHolderRetriever
import com.mmsbackend.service.MessageService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.io.IOException

@RestController
@RequestMapping("/api/messages")
class MessageController(
    private val messageService: MessageService,
    private val generalValidation: GeneralValidation,
    private val securityContextHolderRetriever: SecurityContextHolderRetriever
) {

    @PostMapping("/sendMessage")
    fun sendMessage(@RequestBody messageRequest: MessageDTO): ResponseEntity<Any> {
        return try {
            val message = messageService.sendMessage(messageRequest)
            ResponseEntity.ok().body("Successfully sent message with id ${message.messageId}")
        } catch (e: IOException) {
            ResponseEntity.badRequest().body("Failed to send message: ${e.message}")
        }
    }

    @GetMapping("/getMessages/{patientId}")
    fun getMessagesByPatientId(@PathVariable patientId: Int): List<MessageEntity> {
        val userDetails = securityContextHolderRetriever.getSecurityContext()
        return if (generalValidation.isAdminOrSpecificPatientId(userDetails, patientId)) {
            messageService.getMessagesByPatientId(patientId)
        } else {
            throw ResponseStatusException(HttpStatus.FORBIDDEN)
        }
    }

    @DeleteMapping("/delete/{messageId}")
    fun deleteMessage(@PathVariable messageId: Int): ResponseEntity<Any> {
        return try {
            messageService.deleteMessage(messageId)
            ResponseEntity.ok("Message with ID $messageId deleted successfully.")
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Message with ID $messageId could not be deleted: ${e.message}")
        }
    }
}
