package com.mmsbackend.service.security

import com.mmsbackend.config.security.JwtProperties
import com.mmsbackend.data.LoginRequest
import com.mmsbackend.jpa.repository.UserEntityRepository
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetails
import java.util.*

@ExtendWith(MockKExtension::class)
class AuthServiceTest {

    private lateinit var authService: AuthService

    private val username = UUID.randomUUID().toString()
    private val password = UUID.randomUUID().toString()
    private val validJwt = UUID.randomUUID().toString()
    private val expiry = 123456

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var tokenService: TokenService

    @MockK
    private lateinit var authManager: AuthenticationManager

    @MockK
    private lateinit var userDetailsService: CustomUserDetailsService

    @MockK
    private lateinit var jwtProperties: JwtProperties

    @MockK
    private lateinit var auth: Authentication

    @MockK
    private lateinit var userDetails: UserDetails

    @BeforeEach
    fun setup() {
        authService = AuthService(userEntityRepository, tokenService, authManager, userDetailsService, jwtProperties)

        every { authManager.authenticate(UsernamePasswordAuthenticationToken(username, password)) } returns auth
        every { userDetailsService.loadUserByUsername(username) } returns userDetails
        every { jwtProperties.accessTokenExpiration } returns expiry.toLong()
        every { tokenService.generate(userDetails, any(), any()) } returns validJwt
    }

    @Test
    fun `Successfully authenticate an email and password`() {
        val jwt = authService.authenticate(LoginRequest(username, password))
        assertEquals(validJwt, jwt)
    }

    @Test
    fun `Fail to authenticate when authentication not valid`() {
        every { authManager.authenticate(UsernamePasswordAuthenticationToken(username, password)) } throws
                Exception("Incorrect username or password.")
        val jwt = authService.authenticate(LoginRequest(username, password))
        assertNull(jwt)
    }
}
