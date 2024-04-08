package com.mmsbackend.jpa.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class DoctorEntity(
    @Id
    val id: Int,

    val name: String,
    val address: String,
    val contact: String,
    val email: String,
    val expertise: String,
    val website: String
)