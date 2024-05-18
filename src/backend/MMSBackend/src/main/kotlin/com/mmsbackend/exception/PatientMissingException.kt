package com.mmsbackend.exception

class PatientMissingException(
    val patientId: Int,
    message: String
) : RuntimeException(message)
