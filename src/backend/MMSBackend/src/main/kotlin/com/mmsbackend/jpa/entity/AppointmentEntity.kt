package com.mmsbackend.jpa.entity

import com.mmsbackend.jpa.entity.user.PatientEntity
import jakarta.persistence.*
import java.sql.Time
import java.time.Instant
import java.util.Date

@Entity
data class AppointmentEntity(
    @Id
    val id: Int,

    // Called 'name' in Genie
    val detail: String?,

    val reason: String?,
    val note: String?,

    val dateCreate: Instant,
    val lastUpdated: Instant,

    val startTime: Time,
    val startDate: Date,
    val duration: Int,

    // Can be edited by the user
    var userNote: String?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    val patient: PatientEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "providerId")
    val doctor: DoctorEntity
)
