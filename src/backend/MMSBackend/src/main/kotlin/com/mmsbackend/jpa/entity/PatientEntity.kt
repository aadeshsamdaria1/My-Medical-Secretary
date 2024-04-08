package com.mmsbackend.jpa.entity

import com.mmsbackend.jpa.repository.UserEntityRepository
import jakarta.persistence.Entity
import java.time.Instant
import java.util.*

@Entity
class PatientEntity(

    // Inherited fields
    mmsId: Int,
    email: String,

    val patientId: Int,

    val firstname: String?,
    val middleName: String?,
    val surname: String?,
    val dob: Instant?,
    val address: String?,
    val suburb: String?,
    val state: String?

): UserEntity(mmsId, email)

fun PatientEntity.persist(userEntityRepository: UserEntityRepository): Int {
    return userEntityRepository.save(this).patientId
}
