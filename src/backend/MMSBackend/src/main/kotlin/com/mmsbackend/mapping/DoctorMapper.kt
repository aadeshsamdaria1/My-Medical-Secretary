package com.mmsbackend.mapping

import com.mmsbackend.dto.doctor.DoctorDTO
import com.mmsbackend.jpa.entity.DoctorEntity
import org.springframework.stereotype.Service

@Service
class DoctorMapper {
    fun mapDoctorDTO(doctorDTO: DoctorDTO): DoctorEntity {
        return DoctorEntity(
            name = doctorDTO.name,
            address = doctorDTO.address,
            contact = doctorDTO.contact,
            email = doctorDTO.email,
            expertise = doctorDTO.expertise,
            website = doctorDTO.website,
            id = 0 // Auto generated
        )
    }
}