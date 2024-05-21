package com.mmsbackend.data

data class RefreshTokenRequest(
    val token: String,
    val patientId: Int
)
