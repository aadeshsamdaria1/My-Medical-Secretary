package com.mmsbackend.api.controllers

import com.mmsbackend.data.ActivateRequest
import com.mmsbackend.data.LoginRequest
import com.mmsbackend.data.LoginResponse
import com.mmsbackend.data.UpdatePasswordRequest
import com.mmsbackend.exception.PatientAlreadyCreatedException
import com.mmsbackend.exception.PatientNotFoundException
import com.mmsbackend.service.EmailService
import com.mmsbackend.service.security.AuthService
import com.mmsbackend.service.security.OneTimePasscodeAuthService
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.justRun
import org.assertj.core.api.Assertions.assertThat
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

    private lateinit var authController: AuthController

    private val username = UUID.randomUUID().toString()
    private val password = UUID.randomUUID().toString()
    private val loginRequest = LoginRequest(username, password)
    private val validToken = UUID.randomUUID().toString()
    private val refreshToken = UUID.randomUUID().toString()
    private val userId = Random.nextInt()
    private val oldPassword = UUID.randomUUID().toString()
    private val newPassword = UUID.randomUUID().toString()
    private val updatePasswordRequest = UpdatePasswordRequest(username, oldPassword, newPassword)
    private val email = UUID.randomUUID().toString()

    @MockK
    private lateinit var authService: AuthService

    @MockK
    private lateinit var oneTimePasscodeAuthService: OneTimePasscodeAuthService

    @MockK
    private lateinit var emailService: EmailService

    @BeforeEach
    fun setup() {
        authController = AuthController(
            authService,
            oneTimePasscodeAuthService,
            emailService
        )
        every { authService.authenticate(LoginRequest(username, password)) } returns Triple(validToken, refreshToken, userId)
        every { authService.updatePassword(username, oldPassword, newPassword) } returns true
        every { authService.updatePassword(username, "wrongPassword", newPassword) } returns false

        justRun { emailService.sendSignUpEmail(email) }
    }

    @Test
    fun `Successfully log in and retrieve jwt token`() {
        val token = authController.login(loginRequest).body
        val expectedResponse = LoginResponse(validToken, refreshToken, userId)
        assertEquals(expectedResponse, token)
    }

    @Test
    fun `Fail if patient authentication is unsuccessful`() {
        every { authService.authenticate(LoginRequest(username, password)) } returns null

        val response = authController.login(loginRequest)
        val expectedResponse = ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Successfully update password`() {
        val response = authController.updatePassword(updatePasswordRequest)
        val expectedResponse = ResponseEntity.ok().body("Password updated successfully.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Fail to update password with incorrect old password`() {
        val wrongRequest = updatePasswordRequest.copy(oldPassword = "wrongPassword")
        val response = authController.updatePassword(wrongRequest)
        val expectedResponse = ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Update failed. Check your credentials and try again.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Successfully activate account`() {
        every { oneTimePasscodeAuthService.authenticateOneTimePasscode( any() ) } returns true

        val request = ActivateRequest(
            patientId = userId,
            oneTimeCode = "One Time Code",
            password = "New Password"
        )
        val expectedResponse = ResponseEntity.ok().body("Account activated successfully.")
        val response = authController.activate(request)
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Fail to activate account when auth fails`() {
        every { oneTimePasscodeAuthService.authenticateOneTimePasscode( any() ) } returns false

        val request = ActivateRequest(
            patientId = userId,
            oneTimeCode = "One Time Code",
            password = "New Password"
        )
        val expectedResponse = ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid one-time code.")
        val response = authController.activate(request)
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Successfully send email for sign up`() {
        val response = authController.enterEmail(email)
        val expectedResponse = ResponseEntity.ok().body("Email successfully sent.")
        assertThat(response).isEqualTo(expectedResponse)
    }

    @Test
    fun `Fail to send email for sign up when account already activated`() {
        every { emailService.sendSignUpEmail(email) } throws PatientAlreadyCreatedException("Error")

        val response = authController.enterEmail(email)
        val expectedResponse = ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body("Account already activated. Use forgot password instead.")
        assertThat(response).isEqualTo(expectedResponse)
    }

    @Test
    fun `Fail to send email for sign up when patient not found`() {
        every { emailService.sendSignUpEmail(email) } throws PatientNotFoundException("Error")

        val response = authController.enterEmail(email)
        val expectedResponse = ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body("Patient with this email does not exist.")
        assertThat(response).isEqualTo(expectedResponse)
    }

    @Test
    fun `Fail to send email for sign up when unknown error occurs`() {
        val message = "An error occurred"
        every { emailService.sendSignUpEmail(email) } throws Exception(message)

        val response = authController.enterEmail(email)
        val expectedResponse = ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body("Issue sending email: $message")
        assertThat(response).isEqualTo(expectedResponse)
    }
}
