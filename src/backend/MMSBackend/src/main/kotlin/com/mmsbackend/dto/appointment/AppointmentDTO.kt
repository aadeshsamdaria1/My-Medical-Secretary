package com.mmsbackend.dto.appointment

import java.sql.Time
import java.time.Instant
import java.util.*

data class AppointmentDTO (
    val id: Int,
    val detail: String?,
    val reason: String?,
    val note: String?,
    val dateCreate: Instant,
    val lastUpdated: Instant,
    val startTime: Time,
    val startDate: Date,
    val duration: Int,
    val patientId: Int,
    val providerId: Int
)
