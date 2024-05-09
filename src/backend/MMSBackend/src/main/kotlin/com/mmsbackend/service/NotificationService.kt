package com.mmsbackend.service

import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.messaging.FirebaseMessagingException
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.stereotype.Service
import com.google.firebase.messaging.Message
import com.google.firebase.messaging.Notification

// TODO: NOT FINISHED YET
@Service
class NotificationService (val userEntityRepository: UserEntityRepository) {

    fun sendNotificationToPatient(patientId: Int, title:String, body: String) {
        val user = userEntityRepository.findByPatientId(patientId)
        // val deviceId

//        val message = Message.builder()
//            .setNotification(Notification(title, body))
//            .setToken(deviceToken)
//            .build()

//        try {
//            FirebaseMessaging.getInstance().send(message)
//        } catch (e: FirebaseMessagingException) {
//            e.printStackTrace()
//        }
    }

}