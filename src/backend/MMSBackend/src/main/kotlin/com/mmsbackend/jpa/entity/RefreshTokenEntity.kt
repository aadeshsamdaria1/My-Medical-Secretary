package com.mmsbackend.jpa.entity

import com.mmsbackend.jpa.entity.user.UserEntity
import jakarta.persistence.*
import org.hibernate.annotations.OnDelete
import org.hibernate.annotations.OnDeleteAction

@Entity
data class RefreshTokenEntity (

    @Id
    val token: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    val user: UserEntity
)
