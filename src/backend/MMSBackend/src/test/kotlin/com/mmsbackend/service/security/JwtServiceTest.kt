package com.mmsbackend.service.security

import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.time.Instant
import java.util.*

@ExtendWith(MockKExtension::class)
class JwtServiceTest {

    private lateinit var jwtService: JwtService

    private val patientId = 3
    private val validJwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiaWF0I" +
            "joxLCJleHAiOjg2NDAwMX0.S87LSCb48ICAmnKoKxmQXxHmP4fX17wuXX5kQO9ldok"

    private val date = Date.from(Instant.ofEpochMilli(1000))

    @BeforeEach
    fun setup() {
        jwtService = JwtService()
    }

    @Test
    fun `Successfully generate a jwt`() {
        val (jwt, expiry) = jwtService.generateJwt(patientId.toString(), date)
        assert(expiry.after(date))
        assertEquals(validJwt, jwt)
    }
}
