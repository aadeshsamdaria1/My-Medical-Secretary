package com.mmsbackend.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import org.springframework.context.annotation.Configuration
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct
import java.io.FileInputStream
import java.io.IOException

@Service
class FirebaseConfig {

    @PostConstruct
    fun initializeFirebase() {

        // CHANGE THIS TO YOUR CREDENTIAL FILE
        val serviceAccount = FileInputStream("C:\\Users\\andre\\OneDrive\\Documents\\GitHub\\ME-Wombat\\src\\backend\\MMSBackend\\src\\main\\resources\\me-wombat-f0812-firebase-adminsdk-w8c75-f63d2eef5c.json")

         try {
             val options = FirebaseOptions.builder()
                 .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                 .build()

             if (FirebaseApp.getApps().isEmpty()) {
                 FirebaseApp.initializeApp(options)
                 println("Firebase application initialized")
             }
         } catch (e: IOException) {
             throw RuntimeException("Error initializing Firebase", e)
         }
    }
}