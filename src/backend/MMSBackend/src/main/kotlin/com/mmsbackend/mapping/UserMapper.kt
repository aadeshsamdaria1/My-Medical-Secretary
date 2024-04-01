package com.mmsbackend.mapping

import com.mmsbackend.dto.user.AdminDTO
import com.mmsbackend.dto.user.PatientDTO
import com.mmsbackend.enums.UserType
import com.mmsbackend.jpa.entity.UserEntity
import org.apache.catalina.User
import org.springframework.stereotype.Service

@Service
class UserMapper {

    fun mapPatientDTO(patientDTO: PatientDTO): UserEntity{
        return UserEntity(
            userType = UserType.PATIENT,
            firstname = patientDTO.firstname,
            middleName = patientDTO.middleName,
            surname = patientDTO.surname,
            dob = patientDTO.dob,
            email = patientDTO.email,
            street = patientDTO.street,
            suburb = patientDTO.suburb,
            state = patientDTO.state,
            // ID is randomly generated
            id = 0
        )
    }

    fun mapAdminDTO(adminDTO: AdminDTO): UserEntity{
        return UserEntity(
            userType = UserType.ADMIN,
            firstname = null,
            middleName = null,
            surname = null,
            dob = null,
            email = adminDTO.email,
            street = null,
            suburb = null,
            state = null,
            // ID is randomly generated
            id = 0
        )
    }
}
