package com.mms.mymedicalsecretarybackend.jpa.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import java.time.Instant

@Entity
data class PatientEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,

    val firstname: String,
    val middleName: String?,
    val surname: String?,

    val dob: Instant,
    val email: String,

    val street: String?,
    val suburb: String?,
    val state: String?
)
