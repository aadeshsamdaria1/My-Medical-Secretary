package com.mmsbackend.jpa.entity

import com.mmsbackend.enums.AppointmentStatus
import jakarta.persistence.*
import java.time.Instant

@Entity
data class AppointmentEntity(
    @Id
    val id: Int,
    val title: String,
    val dateCreate: Instant,
    val dateChange: Instant,
    val date: Instant,
    val duration: Int,
    val detail: String?,
    val note: String?,
    val userNote: String?,
    var status: AppointmentStatus,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    val patient: PatientEntity
)
