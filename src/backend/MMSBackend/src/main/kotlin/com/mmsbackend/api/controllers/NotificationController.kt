package com.mmsbackend.api.controllers

import com.mmsbackend.data.DeviceTokenRequest
import com.mmsbackend.data.DeviceTokenResponse
import com.mmsbackend.data.NotificationRequest
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.service.NotificationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.beans.factory.annotation.Autowired
import java.io.IOException

@RestController
@RequestMapping("/notifications")
class NotificationController @Autowired constructor(
    private val notificationService: NotificationService,
    private val patientEntityRepository: UserEntityRepository
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
        return if (patient != null) {
            patient.deviceToken = request.deviceToken
            //patientEntityRepository.save(patient)
            ResponseEntity("Device token registered successfully", HttpStatus.OK)
        } else {
            ResponseEntity("Patient not found", HttpStatus.NOT_FOUND)
        }
    }

    @GetMapping("/deviceToken/{patientId}")
    fun getDeviceToken(@PathVariable patientId: Int): ResponseEntity<DeviceTokenResponse> {
        val patient = patientEntityRepository.findByPatientId(patientId)
        return if (patient?.deviceToken != null) {
            ResponseEntity(DeviceTokenResponse(patient.deviceToken!!), HttpStatus.OK)
        } else {
            ResponseEntity(HttpStatus.NOT_FOUND)
        }
    }
}