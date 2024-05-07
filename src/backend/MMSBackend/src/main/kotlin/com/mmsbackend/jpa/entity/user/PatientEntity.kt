package com.mmsbackend.jpa.entity.user

import com.mmsbackend.jpa.entity.OneTimePasscodeEntity
import jakarta.persistence.*
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

    var accountActive: Boolean,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passcodeId")
    var oneTimePasscode: OneTimePasscodeEntity?

): UserEntity(
    mmsId = mmsId,
    email = email,
    password = password,
    username = username
)
