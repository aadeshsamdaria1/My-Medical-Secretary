package com.mmsbackend.data

data class UpdatePasswordRequest(
        val username: String,
        val oldPassword: String,
        val newPassword: String
)