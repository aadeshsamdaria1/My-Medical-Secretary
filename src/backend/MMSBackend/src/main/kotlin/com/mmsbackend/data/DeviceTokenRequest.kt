package com.mmsbackend.data

data class DeviceTokenRequest(
    val patientId: Int,
    val deviceToken: String
)