package com.mmsbackend.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.mmsbackend.properties.NotificationProperties
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct
import java.io.FileInputStream
import java.io.IOException

@Service
class FirebaseConfig(val notificationProperties: NotificationProperties) {

    @PostConstruct
    fun initializeFirebase() {

//        println(notificationProperties.filePath)
//        val serviceAccount = FileInputStream(notificationProperties.filePath)
//
//         try {
//             val options = FirebaseOptions.builder()
//                 .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                 .build()
//
//             if (FirebaseApp.getApps().isEmpty()) {
//                 FirebaseApp.initializeApp(options)
//             }
//         } catch (e: IOException) {
//             throw RuntimeException("Error initializing Firebase", e)
//         }
    }
}