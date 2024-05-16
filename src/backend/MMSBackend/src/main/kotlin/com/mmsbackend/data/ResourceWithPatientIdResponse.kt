package com.mmsbackend.data

import com.mmsbackend.jpa.entity.ResourceEntity

data class ResourceWithPatientIdResponse(
    val patientIds: List<Int>,
    val resource: ResourceEntity
)
