package com.mmsbackend.jpa.entity

import com.mmsbackend.enums.UserType
import jakarta.persistence.*
import java.time.Instant

@Entity
data class UserEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,

    @Enumerated(EnumType.ORDINAL)
    val userType: UserType,

    val firstname: String?,
    val middleName: String?,
    val surname: String?,

    val dob: Instant?,
    val email: String,

    val street: String?,
    val suburb: String?,
    val state: String?,

    val password: String,

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_authority",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "authority_id")]
    )
    val authorities: Set<Authority> = emptySet()
)
