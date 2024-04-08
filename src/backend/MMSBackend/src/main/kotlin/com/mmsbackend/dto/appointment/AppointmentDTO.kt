package com.mmsbackend.dto.appointment

import com.mmsbackend.enums.AppointmentStatus
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

    val userId: Int
)
