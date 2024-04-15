package com.mmsbackend.exception

class MissingPatientEmailException(email: String) : RuntimeException(
    "Patient with email '$email' does not exist."
)
