package com.mmsbackend.api.validation

import com.mmsbackend.jpa.entity.AppointmentEntity
import org.springframework.stereotype.Service

@Service
class AppointmentValidation {

    fun isValidAppointment(appointment: AppointmentEntity) = appointment.id != 0
}
