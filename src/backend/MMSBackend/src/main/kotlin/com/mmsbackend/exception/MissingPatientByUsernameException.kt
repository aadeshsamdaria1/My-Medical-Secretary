package com.mmsbackend.exception

class MissingPatientByUsernameException(username: String) : RuntimeException(
    "Patient with username '$username' does not exist."
)
