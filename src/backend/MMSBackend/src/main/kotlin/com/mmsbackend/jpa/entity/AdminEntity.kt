package com.mmsbackend.jpa.entity

import jakarta.persistence.Entity
import java.util.*

@Entity
class AdminEntity (

    // Inherited fields
    mmsId: Int,
    email: String,
    password: String,
    username: String,

): UserEntity(
    mmsId = mmsId,
    email = email,
    password = password,
    username = username
)
