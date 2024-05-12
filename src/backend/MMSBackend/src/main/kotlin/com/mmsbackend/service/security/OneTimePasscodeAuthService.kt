package com.mmsbackend.service.security

import com.mmsbackend.data.ActivateRequest
import com.mmsbackend.jpa.entity.OneTimePasscodeEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.util.Date

@Service
class OneTimePasscodeAuthService(
    val userEntityRepository: UserEntityRepository,
    val passwordEncoder: PasswordEncoder
) {

    fun authenticateOneTimePasscode(request: ActivateRequest): Boolean {

        val patients = userEntityRepository.findByEmail(request.email)
            .filter { isValidPasscode(it.oneTimePasscode, request.oneTimeCode) }

        if (patients.size != 1) { return false }

        // Only one patient found
        activate(patients[0], request.password)
        return true
    }

    private fun activate(patient: PatientEntity, password: String) {
        // Clear existing passcode (hence one-time-only)
        patient.oneTimePasscode = null
        patient.password = passwordEncoder.encode(password)
        patient.accountActive = true
        userEntityRepository.save(patient)
    }

    private fun isValidPasscode(oneTimePasscode: OneTimePasscodeEntity?, passcodeAttempt: String): Boolean {
        return passwordEncoder.matches(passcodeAttempt, oneTimePasscode?.passcode) && isNotExpired(oneTimePasscode)
    }

    private fun isNotExpired(oneTimePasscode: OneTimePasscodeEntity?): Boolean {
        return oneTimePasscode?.let { Date().before(oneTimePasscode.expiry) } ?: false
    }
}
