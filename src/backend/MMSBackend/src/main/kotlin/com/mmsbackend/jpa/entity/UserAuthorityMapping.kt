package com.mmsbackend.jpa.entity

import jakarta.persistence.*

@Entity
@Table(name = "user_authority")
data class UserAuthorityMapping(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne
    @JoinColumn(name = "user_id")
    val user: UserEntity,

    @ManyToOne
    @JoinColumn(name = "authority_id")
    val authority: Authority
)
