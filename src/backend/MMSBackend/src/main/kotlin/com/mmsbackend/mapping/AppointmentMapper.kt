package com.mmsbackend.mapping

import com.mmsbackend.dto.appointment.AppointmentDTO
import com.mmsbackend.enums.AppointmentStatus
import com.mmsbackend.jpa.entity.AppointmentEntity
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class AppointmentMapper {
    fun mapAppointmentDTO(appointmentDTO: AppointmentDTO):AppointmentEntity{
        return AppointmentEntity(
                id = 0,
                title = appointmentDTO.title,
                dateCreate = appointmentDTO.dateCreate,
                dateChange = Instant.now(),
                date = appointmentDTO.date,
                duration = appointmentDTO.duration,
                detail = appointmentDTO.detail,
                note = appointmentDTO.note,
                userNote = appointmentDTO.userNote,
                status = AppointmentStatus.UNCONFIRMED
        )
    }
}