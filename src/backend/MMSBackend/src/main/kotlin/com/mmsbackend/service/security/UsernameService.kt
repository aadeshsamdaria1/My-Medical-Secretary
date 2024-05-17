package com.mmsbackend.service.security

import com.mmsbackend.data.Name
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.stereotype.Service

@Service
class UsernameService(
    val userEntityRepository: UserEntityRepository,
) {

    fun generateUsernameFromName(name: Name, usernames: Set<String>): String {
        val firstname = name.firstname
        val surname = name.surname ?: ""
        val base = getBaseUsername(firstname = normalise(firstname), surname = normalise(surname))
        return if (!base.isTaken(usernames)) {
            base
        } else {
            generateSequence(1) { it + 1 }
                .map { base + it.toString() }
                .first { !it.isTaken(usernames) }
        }
    }

    private fun String.isTaken(usernames: Set<String>): Boolean {
        return userEntityRepository.existsByUsername(this)
                || usernames.contains(this)
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
