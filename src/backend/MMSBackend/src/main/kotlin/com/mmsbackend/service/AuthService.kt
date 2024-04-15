package com.mmsbackend.service

import com.mmsbackend.exception.MissingPatientEmailException
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.stereotype.Service

@Service
class AuthService(
    val userEntityRepository: UserEntityRepository,
    val jwtService: JwtService
) {

    fun authenticate(email: String, password: String): String? {

        val patient = userEntityRepository.findByEmail(email) ?: 
            throw MissingPatientEmailException(email)
        
        return if (patient.password == password) generateJwt(patient) else null
    }
    
    private fun generateJwt(patient: PatientEntity): String {

        val subject = patient.patientId.toString()
        val jwt = jwtService.generateJwt(subject)

        // TODO: Persist jwt 
        return jwt
    }
}
