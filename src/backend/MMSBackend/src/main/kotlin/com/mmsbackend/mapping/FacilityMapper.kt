package com.mmsbackend.mapping

import com.mmsbackend.dto.doctor.DoctorDTO
import com.mmsbackend.dto.user.FacilityDTO
import com.mmsbackend.enums.FacilityType
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.FacilityEntity
import org.springframework.stereotype.Service

@Service
class FacilityMapper {

    fun mapFacilityDTO(facilityDTO: FacilityDTO): FacilityEntity {
        return FacilityEntity(

            id = 0, // Auto generated
            name = facilityDTO.name,
            contact = facilityDTO.contact,
            address = facilityDTO.address,
            fax = facilityDTO.fax,
            website = facilityDTO.website,
            facilityType = facilityDTO.facilityType
        )
    }
}
