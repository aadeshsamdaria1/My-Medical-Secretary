package com.mmsbackend.service.security

import com.mmsbackend.data.Name
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.security.SecureRandom

@Service
class PasswordService(
    val userEntityRepository: UserEntityRepository,
    val encoder: PasswordEncoder
) {

    fun generateAndEncodeSecurePassword(): String {
        val secureRandom = SecureRandom()
        val allowedChars =
            ('a'..'z') +
            ('A'..'Z') +
            ('0'..'9')

        val securePassword = (1..PASSWORD_LENGTH)
            .map { allowedChars[secureRandom.nextInt(allowedChars.size)] }
            .joinToString("")

        return encoder.encode(securePassword)
    }

    fun generateUsernameFromName(name: Name): String {
        val firstname = name.firstname
        val surname = name.surname ?: ""
        val base = getBaseUsername(firstname = normalise(firstname), surname = normalise(surname))
        return if ( !userEntityRepository.existsByUsername(base)) {
            base
        } else {
            generateSequence(1) { it + 1 }
                .map { base + it.toString() }
                .first { !userEntityRepository.existsByUsername(it) }
        }
    }

    private fun normalise(name: String): String {
        return name.lowercase().replace("\\s".toRegex(), "")
    }

    private fun getBaseUsername(firstname: String, surname: String): String {
        return when {
            isAcceptableLength(firstname) -> firstname
            isAcceptableLength(surname) -> surname
            isAcceptableLength(firstname + surname) -> firstname + surname
            isTooShort(firstname) -> USERNAME_PAD + firstname
            else -> firstname.take(MIN_BASE_USERNAME_LENGTH)
        }
    }

    private fun isAcceptableLength(username: String): Boolean {
        return username.length in MIN_BASE_USERNAME_LENGTH..MAX_BASE_USERNAME_LENGTH
    }

    private fun isTooShort(username: String): Boolean {
        return username.length < MIN_BASE_USERNAME_LENGTH
    }

    companion object {
        const val MIN_BASE_USERNAME_LENGTH = 5
        const val MAX_BASE_USERNAME_LENGTH = 20
        const val PASSWORD_LENGTH = 10
        const val USERNAME_PAD = "patient_"
    }
}
