package com.mmsbackend.jpa.entity

import com.mmsbackend.enums.UserType
import com.mmsbackend.jpa.repository.UserEntityRepository
import jakarta.persistence.*
import java.time.Instant

@Entity
data class UserEntity(
    @Id
    val id: Int,

    @Enumerated(EnumType.ORDINAL)
    val userType: UserType,

    val firstname: String?,
    val middleName: String?,
    val surname: String?,

    val dob: Instant?,
    val email: String,

    val address: String?,
    val suburb: String?,
    val state: String?
)

fun UserEntity.persist(userEntityRepository: UserEntityRepository): Int {
    return userEntityRepository.save(this).id
}
