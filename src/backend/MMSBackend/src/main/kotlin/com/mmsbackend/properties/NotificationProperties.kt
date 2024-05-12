package com.mmsbackend.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("firebase")
data class NotificationProperties (
    val filePath: String
)