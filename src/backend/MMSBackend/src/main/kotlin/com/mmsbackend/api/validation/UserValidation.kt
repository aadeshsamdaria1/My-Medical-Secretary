package com.mmsbackend.api.validation

import com.mmsbackend.jpa.entity.user.PatientEntity
import org.springframework.stereotype.Service

@Service
class UserValidation {
    fun isValidPatient(patient: PatientEntity): Boolean = patient.patientId != 0
}
