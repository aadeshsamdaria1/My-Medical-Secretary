package com.mmsbackend.jpa.entity.user

import jakarta.persistence.Column
import jakarta.persistence.Entity
import java.time.Instant

@Entity
class PatientEntity(

    // Inherited fields
    mmsId: Int,
    email: String,
    password: String,
    username: String,

    @Column(unique = true)
    val patientId: Int,

    val firstname: String,
    val middleName: String?,
    val surname: String,
    val dob: Instant,
    val address: String?,
    val suburb: String?,
    val state: String?,

    val temporaryPassword: String?

): UserEntity(
    mmsId = mmsId,
    email = email,
    password = password,
    username = username
)
