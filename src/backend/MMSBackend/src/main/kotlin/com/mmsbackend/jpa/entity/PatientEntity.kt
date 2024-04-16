package com.mmsbackend.jpa.entity

import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.UserMapper
import jakarta.persistence.Column
import jakarta.persistence.Entity
import org.jetbrains.annotations.NotNull
import java.time.Instant
import java.util.*

@Entity
class PatientEntity(

    // Inherited fields
    mmsId: Int,
    email: String,
    password: String,
    username: String,

    @Column(unique = true)
    val patientId: Int,

    val firstname: String?,
    val middleName: String?,
    val surname: String?,
    val dob: Instant?,
    val address: String?,
    val suburb: String?,
    val state: String?

): UserEntity(
    mmsId = mmsId,
    email = email,
    password = password,
    username = username
)
