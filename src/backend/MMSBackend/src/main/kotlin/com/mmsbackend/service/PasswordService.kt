package com.mmsbackend.service

import org.springframework.stereotype.Service
import java.security.SecureRandom
import kotlin.io.encoding.Base64

@Service
class PasswordService {

    companion object {
        const val PASSWORD_LENGTH = 10
    }

    fun generateSecurePassword(): String {
        val allowedChars = ('a'..'z') + ('A'..'Z') + ('0'..'9')
        val secureRandom = SecureRandom()

        return (1..PASSWORD_LENGTH)
            .map { allowedChars[secureRandom.nextInt(allowedChars.size)] }
            .joinToString("")
    }
}
