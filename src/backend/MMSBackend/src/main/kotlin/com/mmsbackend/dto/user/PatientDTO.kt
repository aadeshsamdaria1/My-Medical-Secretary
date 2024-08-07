package com.mmsbackend.dto.user

import java.time.Instant

data class PatientDTO (
    val patientId: Int,
    val firstname: String,
    val middleName: String?,
    val surname: String,
    val dob: Instant,
    val email: String,
    val address: String?,
    val suburb: String?,
    val state: String?
)
