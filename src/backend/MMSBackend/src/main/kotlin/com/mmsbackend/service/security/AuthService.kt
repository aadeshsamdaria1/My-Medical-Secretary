package com.mmsbackend.service.security

import com.mmsbackend.exception.MissingPatientByUsernameException
import com.mmsbackend.jpa.entity.JwtEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.JwtEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class AuthService(
    val userEntityRepository: UserEntityRepository,
    val jwtService: JwtService,
) {

    fun authenticate(username: String, password: String): String? {

        val patient = userEntityRepository.findByUsername(username) ?:
            throw MissingPatientByUsernameException(username)
        
        return if (patient.password == password) generateJwt(patient) else null
    }
    
    private fun generateJwt(patient: PatientEntity): String {

        val subject = patient.patientId.toString()
        val now = Date()
        val (jwt, expiryDate) = jwtService.generateJwt(subject, now)

        jwtService.persistJwt(patient = patient, token = jwt, expiry = expiryDate)

        return jwt
    }
}
