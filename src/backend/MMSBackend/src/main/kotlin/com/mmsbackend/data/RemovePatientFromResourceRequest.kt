package com.mmsbackend.data

data class RemovePatientFromResourceRequest(
    val patientId: Int,
    val resourceId: Int
)
