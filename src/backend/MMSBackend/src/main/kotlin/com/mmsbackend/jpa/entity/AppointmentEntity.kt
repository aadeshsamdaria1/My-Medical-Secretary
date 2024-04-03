package com.mmsbackend.jpa.entity

import com.mmsbackend.enums.AppointmentStatus
import com.mmsbackend.enums.UserType
import jakarta.persistence.*
import java.time.Instant

@Entity
data class AppointmentEntity(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int,
        val title: String,
        val dateCreate: Instant,
        val dateChange: Instant,
        val date: Instant,
        val duration: Int,
        val detail: String?,
        val note: String?,
        val userNote: String?,
        var status: AppointmentStatus
)
