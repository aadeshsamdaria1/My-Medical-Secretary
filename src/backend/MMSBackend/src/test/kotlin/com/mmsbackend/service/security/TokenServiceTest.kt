package com.mmsbackend.service.security

import com.mmsbackend.config.security.JwtProperties
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.security.core.userdetails.UserDetails
import java.time.Instant
import java.util.*

@ExtendWith(MockKExtension::class)
class TokenServiceTest {

    private lateinit var tokenService: TokenService

    private lateinit var jwtProperties: JwtProperties

    private val jwtStart = "eyJhbGciOiJIUzUxMiJ9"
    private val expiry = Date.from(Instant.ofEpochMilli(1000))
    private val username = UUID.randomUUID().toString()


    @MockK
    private lateinit var userDetails: UserDetails

    @BeforeEach
    fun setup() {
        jwtProperties = JwtProperties(
            key = "Secret key - a_very_very_very_very_very_very_very_very_very_secret_key",
            accessTokenExpiration = 300_000,
            refreshTokenExpiration = 600_000
        )
        tokenService = TokenService(jwtProperties)
        every { userDetails.username } returns username
    }

    @Test
    fun `Generate a jwt`() {
        val claims = mapOf("Claim" to "Hello")
        val jwt = tokenService.generate(userDetails, expiry, claims)
        assert( jwt.startsWith(jwtStart))
    }
}
