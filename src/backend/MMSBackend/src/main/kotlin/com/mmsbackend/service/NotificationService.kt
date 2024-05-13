package com.mmsbackend.service

import com.google.firebase.messaging.*
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.stereotype.Service
import com.mmsbackend.data.NotificationRequest
import java.util.concurrent.ExecutionException

@Service
class NotificationService (val userEntityRepository: UserEntityRepository) {

    companion object {
        const val TIME: Long = 2
    }

    @Throws(InterruptedException::class, ExecutionException::class)
    fun sendMessageToToken(request: NotificationRequest): String {
        val message = preconfigureMessageToToken(request)
        return sendAndGetResponse(message)
    }

    @Throws(InterruptedException::class, ExecutionException::class)
    private fun sendAndGetResponse(message: Message): String {
        return FirebaseMessaging.getInstance().sendAsync(message).get()
    }

    private fun getAndroidConfig(topic: String): AndroidConfig {
        return AndroidConfig.builder()
            .setTtl(java.time.Duration.ofMinutes(TIME).toMillis())
            .setCollapseKey(topic)
            .setPriority(AndroidConfig.Priority.HIGH)
            .setNotification(AndroidNotification.builder()
                .setTag(topic).build()).build()
    }

    private fun getApnsConfig(topic: String): ApnsConfig {
        return ApnsConfig.builder()
            .setAps(Aps.builder().setCategory(topic).setThreadId(topic).build()).build()
    }

    private fun preconfigureMessageToToken(request: NotificationRequest): Message {
        return preconfigureMessageBuilder(request).setToken(request.deviceToken).build()
    }

    private fun preconfigureMessageBuilder(request: NotificationRequest): Message.Builder {
        val androidConfig = getAndroidConfig(request.topic)
        val apnsConfig = getApnsConfig(request.topic)
        val notification = Notification.builder()
            .setTitle(request.title)
            .setBody(request.body)
            .build()
        return Message.builder()
            .setApnsConfig(apnsConfig).setAndroidConfig(androidConfig).setNotification(notification)
    }
}