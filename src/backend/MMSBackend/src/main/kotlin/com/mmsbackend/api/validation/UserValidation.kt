package com.mmsbackend.api.validation

import com.mmsbackend.jpa.entity.UserEntity
import org.springframework.stereotype.Service

@Service
class UserValidation {

    fun isValidPatient(user: UserEntity) = (
        user.id != 0
        && user.dob != null
        && user.firstname != null
        && user.surname != null
    )

    fun isValidAdmin(user: UserEntity) = (
        user.id != 0
    )
}