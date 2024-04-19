package com.mmsbackend.jpa.entity

import com.mmsbackend.enums.FacilityType
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class FacilityEntity (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,

    val name: String,
    val contact: String,
    val address: String,
    val fax: String?,
    val website: String?,
    val facilityType: FacilityType
)
