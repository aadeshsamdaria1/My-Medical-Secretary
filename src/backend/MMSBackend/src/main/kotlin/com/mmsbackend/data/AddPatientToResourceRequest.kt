package com.mmsbackend.data

data class AddPatientToResourceRequest(
    val patientId: Int,
    val resourceId: Int
)
