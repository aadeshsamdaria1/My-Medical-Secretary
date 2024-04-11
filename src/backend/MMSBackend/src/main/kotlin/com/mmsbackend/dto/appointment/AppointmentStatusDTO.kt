package com.mmsbackend.dto.appointment

import com.mmsbackend.enums.AppointmentStatus

data class AppointmentStatusDTO (
    val appointmentId: Int,
    val status: AppointmentStatus
)
