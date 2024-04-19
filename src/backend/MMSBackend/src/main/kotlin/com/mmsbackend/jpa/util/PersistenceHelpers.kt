package com.mmsbackend.jpa.util

import com.mmsbackend.exception.AdminPatientUsernameMatchException
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.user.AdminEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import com.mmsbackend.mapping.UserMapper
import java.lang.ClassCastException
import kotlin.jvm.optionals.getOrNull

fun AppointmentEntity.persist(repository: AppointmentEntityRepository, mapper: AppointmentMapper): AppointmentEntity {

    val existingAppointment = repository.findById(this.id).getOrNull()
    return if (existingAppointment != null) {
        repository.save(mapper.updateExistingAppointment(existingAppointment, this))
    } else{
        repository.save(this)
    }
}

fun PatientEntity.persist(userEntityRepository: UserEntityRepository, mapper: UserMapper): PatientEntity {

    val existingPatient = userEntityRepository.findByPatientId(this.patientId)
    return if (existingPatient != null) {
        userEntityRepository.save(mapper.updateExistingPatient(existingPatient, this))
    } else {
        userEntityRepository.save(this)
    }
}

fun AdminEntity.persist(userEntityRepository: UserEntityRepository, mapper: UserMapper): AdminEntity {

    val existingAdmin = try {
        userEntityRepository.findByUsername(this.username) as AdminEntity?
    } catch (cce: ClassCastException) {
        throw AdminPatientUsernameMatchException(
            message = "Cannot create admin as a patient has taken this username."
        )
    }

    return if (existingAdmin != null) {
        userEntityRepository.save(mapper.updateExistingAdmin(existingAdmin, this))
    } else {
        userEntityRepository.save(this)
    }
}
