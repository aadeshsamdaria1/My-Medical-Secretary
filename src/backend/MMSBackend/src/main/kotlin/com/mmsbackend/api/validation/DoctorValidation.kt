package com.mmsbackend.api.validation

import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.UserEntity
import org.springframework.stereotype.Service

@Service
class DoctorValidation {
    fun isValidDoctor(doctor: DoctorEntity) = doctor.id != 0
}