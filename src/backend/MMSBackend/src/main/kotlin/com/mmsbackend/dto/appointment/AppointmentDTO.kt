package com.mmsbackend.dto.appointment

import java.time.Instant

data class AppointmentDTO (
    val id: Int,
    val title: String,
    val dateCreate: Instant,
    val date: Instant,
    val duration: Int,
    val detail: String?,
    val note: String?,
    val userNote: String?,

    val patientId: Int
)
