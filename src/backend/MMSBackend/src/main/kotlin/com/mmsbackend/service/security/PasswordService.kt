package com.mmsbackend.service.security

import com.mmsbackend.data.Name
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.stereotype.Service
import java.security.SecureRandom

@Service
class PasswordService(
    val userEntityRepository: UserEntityRepository
) {

    fun generateSecurePassword(): String {
        return generateSecureSequence(PASSWORD_LENGTH)
    }

    fun generateUsernameFromName(name: Name): String {
        val baseUsername = getBaseUsername(name)
        return generateSequence(1) { it + 1 }
            .map { baseUsername + it.toString() }
            .first { !userEntityRepository.existsByUsername(it) }
    }

    private fun getBaseUsername(name: Name): String {
        return when {
            isAcceptableLength(name.firstname) -> name.firstname
            isAcceptableLength(name.surname) -> name.surname
            isAcceptableLength(name.firstname + name.surname) -> name.firstname + name.surname
            else -> generateRandomUsername()
        }
    }

    private fun isAcceptableLength(username: String): Boolean {
        return username.length in MIN_BASE_USERNAME_LENGTH..MAX_BASE_USERNAME_LENGTH
    }

    private fun generateRandomUsername(): String {
        return generateSecureSequence(MIN_BASE_USERNAME_LENGTH)
    }

    private fun generateSecureSequence(length: Int): String {
        val secureRandom = SecureRandom()
        val allowedChars =
            ('a'..'z') +
                    ('A'..'Z') +
                    ('0'..'9')

        return (1..length)
            .map { allowedChars[secureRandom.nextInt(allowedChars.size)] }
            .joinToString("")
    }

    companion object {
        // TODO: Tune these with team
        const val MIN_BASE_USERNAME_LENGTH = 5
        const val MAX_BASE_USERNAME_LENGTH = 20
        const val PASSWORD_LENGTH = 10
    }
}
