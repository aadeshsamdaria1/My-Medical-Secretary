package com.mmsbackend.api.validation

import com.mmsbackend.jpa.entity.AdminEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.entity.UserEntity
import org.springframework.stereotype.Service

@Service
class UserValidation {
    fun isValidPatient(patient: PatientEntity) = patient.patientId != 0
}
