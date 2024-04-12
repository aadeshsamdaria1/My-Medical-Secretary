package com.mmsbackend.api.validation

import com.mmsbackend.jpa.entity.FacilityEntity
import org.springframework.stereotype.Service

@Service
class FacilityValidation {
    fun isValidFacility(facility: FacilityEntity) = facility.id != 0
}