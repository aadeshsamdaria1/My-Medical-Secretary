package com.mmsbackend.api.validation

import com.mmsbackend.jpa.entity.AdminEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.entity.UserEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.stereotype.Service

@Service
class UserValidation {
    fun isValidPatient(patient: PatientEntity): Boolean {

        return patient.patientId != 0
    }

    private fun hasUniqueEmail(patient: PatientEntity) {
        // TODO: Finish this

    }
}
