package com.mmsbackend.api.controllers

import com.mmsbackend.data.LoginRequest
import com.mmsbackend.data.LoginResponse
import com.mmsbackend.data.UpdatePasswordRequest
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
import kotlin.random.Random

@ExtendWith(MockKExtension::class)
class AuthControllerTest {

    private lateinit var loginController: AuthController

    private val username = UUID.randomUUID().toString()
    private val password = UUID.randomUUID().toString()
    private val loginRequest = LoginRequest(username, password)
    private val validToken = UUID.randomUUID().toString()
    private val refreshToken = UUID.randomUUID().toString()
    private val userId = Random.nextInt()
    private val oldPassword = UUID.randomUUID().toString()
    private val newPassword = UUID.randomUUID().toString()
    private val updatePasswordRequest = UpdatePasswordRequest(username, oldPassword, newPassword)

    @MockK
    private lateinit var authService: AuthService

    @BeforeEach
    fun setup() {
        loginController = AuthController(
            authService
        )
        every { authService.authenticate(LoginRequest(username, password)) } returns Triple(validToken, refreshToken, userId)
        every { authService.updatePassword(username, oldPassword, newPassword) } returns true
        every { authService.updatePassword(username, "wrongPassword", newPassword) } returns false
    }

    @Test
    fun `Successfully log in and retrieve jwt token`() {
        val token = loginController.login(loginRequest).body
        val expectedResponse = LoginResponse(validToken, refreshToken, userId)
        assertEquals(expectedResponse, token)
    }

    @Test
    fun `Fail if patient authentication is unsuccessful`() {
        every { authService.authenticate(LoginRequest(username, password)) } returns null

        val response = loginController.login(loginRequest)
        val expectedResponse = ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Successfully update password`() {
        val response = loginController.updatePassword(updatePasswordRequest)
        val expectedResponse = ResponseEntity.ok().body("Password updated successfully.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Fail to update password with incorrect old password`() {
        val wrongRequest = updatePasswordRequest.copy(oldPassword = "wrongPassword")
        val response = loginController.updatePassword(wrongRequest)
        val expectedResponse = ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Update failed. Check your credentials and try again.")
        assertEquals(expectedResponse, response)
    }
}
