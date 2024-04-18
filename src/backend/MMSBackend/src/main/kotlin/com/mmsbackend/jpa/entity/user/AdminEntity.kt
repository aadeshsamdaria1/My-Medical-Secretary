package com.mmsbackend.jpa.entity.user

import jakarta.persistence.Entity

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
