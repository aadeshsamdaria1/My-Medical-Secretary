package com.mmsbackend.service.security

import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.util.Base64

@Service
class PasscodeService {

    fun generateRandomCode(length: Int): String {
        val randomBytes = ByteArray(length)
        SecureRandom().nextBytes(randomBytes)
        val base64String = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes)
        return base64String.substring(0, length)
    }
}
