package com.mmsbackend.jpa.entity

import com.mmsbackend.jpa.entity.user.UserEntity
import jakarta.persistence.*

@Entity
data class RefreshTokenEntity (

    @Id
    val token: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    val user: UserEntity
)
