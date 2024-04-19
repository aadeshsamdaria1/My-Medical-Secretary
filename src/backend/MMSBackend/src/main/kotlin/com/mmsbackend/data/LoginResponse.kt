package com.mmsbackend.data

data class LoginResponse(
    val jwtToken: String,
    val refreshToken: String
)
