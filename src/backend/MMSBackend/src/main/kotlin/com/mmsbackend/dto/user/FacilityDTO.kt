package com.mmsbackend.dto.user

import com.mmsbackend.enums.FacilityType

data class FacilityDTO (
    val name: String,
    val contact: String,
    val address: String,
    val fax: String?,
    val website: String?,
    val facilityType: FacilityType
)
