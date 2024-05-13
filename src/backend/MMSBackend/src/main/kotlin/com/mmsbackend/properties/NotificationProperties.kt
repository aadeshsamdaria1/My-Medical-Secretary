package com.mmsbackend.properties

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.PropertySource
import org.springframework.stereotype.Component

@ConfigurationProperties("firebase")
data class NotificationProperties (
    val filePath: String
)