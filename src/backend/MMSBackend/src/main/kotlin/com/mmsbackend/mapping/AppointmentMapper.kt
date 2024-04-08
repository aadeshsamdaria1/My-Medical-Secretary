package com.mmsbackend.mapping

import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.enums.AppointmentStatus
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.PatientEntity
import org.springframework.stereotype.Service

@Service
class AppointmentMapper {
    fun mapAppointmentDTO(appDTO: AppointmentDTO, patient: PatientEntity, doctor: DoctorEntity): AppointmentEntity{
        return AppointmentEntity(
            id = appDTO.id,
            detail = appDTO.detail,
            reason = appDTO.reason,
            note = appDTO.note,
            dateCreate = appDTO.dateCreate,
            lastUpdated = appDTO.lastUpdated,
            startDate = appDTO.startDate,
            duration = appDTO.duration,
            startTime = appDTO.startTime,

            userNote = "",
            status = AppointmentStatus.UNCONFIRMED,

            patient = patient,
            doctor = doctor
        )
    }
}