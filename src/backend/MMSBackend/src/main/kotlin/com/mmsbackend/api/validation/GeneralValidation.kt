package com.mmsbackend.api.validation

import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service

@Service
class GeneralValidation(
    val userEntityRepository: UserEntityRepository
) {

    fun isAdminOrSpecificPatientUsername(userDetails: UserDetails, requiredUsername: String?): Boolean {
        if (requiredUsername == null) {return false}
        return userDetails.authorities.any { it.authority == "ROLE_ADMIN" } ||
                (userDetails.authorities.any { it.authority == "ROLE_PATIENT" } &&
                        userDetails.username == requiredUsername)
    }

    fun isAdminOrSpecificPatientId(userDetails: UserDetails, requiredId: Int): Boolean {
        val requiredUsername = userEntityRepository.findByPatientId(requiredId)?.username ?: return false
        return isAdminOrSpecificPatientUsername(userDetails, requiredUsername)
    }

    fun isSpecificPatient(userDetails: UserDetails, requiredId: Int): Boolean {
        val requiredUsername = userEntityRepository.findByPatientId(requiredId)?.username ?: return false
        return (userDetails.authorities.any { it.authority == "ROLE_PATIENT" } &&
                userDetails.username == requiredUsername)
    }
}
