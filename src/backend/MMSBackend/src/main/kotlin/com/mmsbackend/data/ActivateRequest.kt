package com.mmsbackend.data

data class ActivateRequest(
    val patientId: Int,
    val oneTimeCode: String,
    val password: String
)
