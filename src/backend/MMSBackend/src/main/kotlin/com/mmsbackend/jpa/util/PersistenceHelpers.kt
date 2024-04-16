package com.mmsbackend.jpa.util

import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import com.mmsbackend.mapping.UserMapper
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
    } else{
        userEntityRepository.save(this)
    }
}
