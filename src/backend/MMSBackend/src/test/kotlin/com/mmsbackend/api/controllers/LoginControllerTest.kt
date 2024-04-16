package com.mmsbackend.api.controllers

import com.mmsbackend.data.LoginRequest
import com.mmsbackend.exception.MissingPatientByUsernameException
import com.mmsbackend.service.security.AuthService
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import java.util.*

@ExtendWith(MockKExtension::class)
class LoginControllerTest {

    private lateinit var loginController: AuthController

    private val username = UUID.randomUUID().toString()
    private val password = UUID.randomUUID().toString()
    private val loginRequest = LoginRequest(username, password)
    private val validToken = UUID.randomUUID().toString()

    @MockK
    private lateinit var authService: AuthService

    @BeforeEach
    fun setup() {
        loginController = AuthController(
            authService
        )
        every { authService.authenticate(username, password) } returns validToken
    }

    @Test
    fun `successfully log in and retrieve jwt token`() {
        val token = loginController.login(loginRequest).body
        assertEquals(validToken, token)
    }

    @Test
    fun `Fail is patient with given email does not exist`() {
        every { authService.authenticate(username, password) } throws MissingPatientByUsernameException("No patient.")

        val response = loginController.login(loginRequest)
        val expectedResponse = ResponseEntity.badRequest().body("Patient with username $username does not exist.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Fail if incorrect email & password combination`() {
        every { authService.authenticate(username, password) } returns null

        val response = loginController.login(loginRequest)
        val expectedResponse = ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            "Incorrect username or password.")
        assertEquals(expectedResponse, response)
    }
}