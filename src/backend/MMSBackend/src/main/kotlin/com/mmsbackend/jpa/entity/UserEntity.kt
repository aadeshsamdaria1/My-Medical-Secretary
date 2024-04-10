package com.mmsbackend.jpa.entity

import jakarta.persistence.*
import java.util.UUID

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
open class UserEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open val mmsId: Int,
    open val email: String,
)
