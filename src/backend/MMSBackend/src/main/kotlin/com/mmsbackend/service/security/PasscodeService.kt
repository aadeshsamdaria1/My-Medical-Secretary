package com.mmsbackend.service.security

import org.springframework.stereotype.Service
import java.security.SecureRandom
import java.util.Base64

@Service
class PasscodeService {

    private val random = java.util.Random()
    fun generateRandomIntCode(): String {
        val randomInt = (random.nextInt(BOUND) + OFFSET).toString()
        return randomInt
    }

    companion object {
        const val BOUND = 900000
        const val OFFSET = 100000
    }
}
