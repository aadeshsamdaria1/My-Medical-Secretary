package com.mmsbackend.exception

class DoctorMissingException(
    val doctorId: Int,
    message: String
) : RuntimeException(message)
