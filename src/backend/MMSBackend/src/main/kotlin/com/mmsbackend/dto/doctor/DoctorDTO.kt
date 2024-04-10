package com.mmsbackend.dto.doctor

data class DoctorDTO (
    val id: Int,
    val name: String,
    val address: String,
    val contact: String,
    val email: String,
    val expertise: String,
    val website: String
)