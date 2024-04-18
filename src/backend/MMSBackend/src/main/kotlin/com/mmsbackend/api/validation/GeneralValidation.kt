package com.mmsbackend.api.validation

import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service

@Service
class GeneralValidation(
    val userEntityRepository: UserEntityRepository
) {

    fun isAdminOrSpecificPatientUsername(userDetails: UserDetails, requiredUsername: String): Boolean {
        return userDetails.authorities.any { it.authority == "ROLE_ADMIN" } ||
                (userDetails.authorities.any { it.authority == "ROLE_PATIENT" } &&
                        userDetails.username == requiredUsername)
    }
}
