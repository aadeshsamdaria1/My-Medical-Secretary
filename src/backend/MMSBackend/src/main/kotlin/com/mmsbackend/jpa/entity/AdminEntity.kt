package com.mmsbackend.jpa.entity

import jakarta.persistence.Entity
import java.util.*

@Entity
class AdminEntity (

    // Inherited fields
    mmsId: Int,
    email: String,
    password: String,

    val username: String,

): UserEntity(mmsId, email, password)
