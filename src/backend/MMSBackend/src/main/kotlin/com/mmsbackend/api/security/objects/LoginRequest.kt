package com.mmsbackend.api.security.objects

data class LoginRequest(
    val username: String,
    val password: String
)
