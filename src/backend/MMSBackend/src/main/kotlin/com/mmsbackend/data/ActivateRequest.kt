package com.mmsbackend.data

data class ActivateRequest(
    val email: String,
    val oneTimeCode: String,
    val password: String
)
