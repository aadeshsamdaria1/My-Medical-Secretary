package com.mmsbackend.jpa.entity.user

import com.fasterxml.jackson.annotation.JsonIgnore
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.OneTimePasscodeEntity
import com.mmsbackend.jpa.entity.PatientResourceEntity
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

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true)
    @JoinColumn(name = "passcodeId")
    var oneTimePasscode: OneTimePasscodeEntity?,

    var deviceToken: String?

): UserEntity(
    mmsId = mmsId,
    email = email,
    password = password,
    username = username
)
