package com.mmsbackend.jpa.entity
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
class ResourceEntity (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,

    val link: String?,
    val text: String?,
)
