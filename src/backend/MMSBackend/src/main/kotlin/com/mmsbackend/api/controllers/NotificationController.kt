package com.mmsbackend.api.controllers

import com.mmsbackend.api.validation.GeneralValidation
import com.mmsbackend.data.DeviceTokenRequest
import com.mmsbackend.data.DeviceTokenResponse
import com.mmsbackend.data.NotificationRequest
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.jpa.util.SecurityContextHolderRetriever
import com.mmsbackend.service.NotificationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.server.ResponseStatusException
import java.io.IOException

@RestController
@RequestMapping("/api/notifications")
class NotificationController @Autowired constructor(
    private val notificationService: NotificationService,
    private val patientEntityRepository: UserEntityRepository,
    private val securityContextHolderRetriever: SecurityContextHolderRetriever,
    private val generalValidation: GeneralValidation
) {

    @PostMapping("/send")
    fun sendNotification(@RequestBody request: NotificationRequest): ResponseEntity<String> {
        return try {
            val response = notificationService.sendMessageToToken(request)
            ResponseEntity(response, HttpStatus.OK)
        } catch (e: IOException) {
            ResponseEntity("Failed to send notification: ${e.message}", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @PostMapping("/registerDeviceToken")
    fun registerDeviceToken(@RequestBody request: DeviceTokenRequest): ResponseEntity<String> {
        val patient = patientEntityRepository.findByPatientId(request.patientId)

        val userDetails = securityContextHolderRetriever.getSecurityContext()
        return if (generalValidation.isSpecificPatient(userDetails, request.patientId)) {
            if (patient != null) {
                patient.deviceToken = request.deviceToken
                patientEntityRepository.save(patient)
                ResponseEntity("Device token registered successfully", HttpStatus.OK)
            } else {
                ResponseEntity("Patient not found", HttpStatus.NOT_FOUND)
            }
        } else{
            throw ResponseStatusException(HttpStatus.FORBIDDEN)
        }
    }

    @GetMapping("/deviceToken/{patientId}")
    fun getDeviceToken(@PathVariable patientId: Int): ResponseEntity<DeviceTokenResponse> {
        val patient = patientEntityRepository.findByPatientId(patientId)
        val deviceToken = patient?.deviceToken
        return if (deviceToken != null) {
            ResponseEntity(DeviceTokenResponse(deviceToken), HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }
}
