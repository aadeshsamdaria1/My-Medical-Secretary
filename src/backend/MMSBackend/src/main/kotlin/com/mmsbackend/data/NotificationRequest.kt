package com.mmsbackend.data

data class NotificationRequest (
    val deviceToken: String,
    val title: String,
    val body: String
)