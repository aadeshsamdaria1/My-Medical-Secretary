package com.mmsbackend.jpa.entity

import jakarta.persistence.*
import java.util.Date

@Entity
data class JwtEntity (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    val user: UserEntity,

    @Column(nullable = false)
    val token: String,

    @Column(nullable = false)
    val expiryTime: Date
)
