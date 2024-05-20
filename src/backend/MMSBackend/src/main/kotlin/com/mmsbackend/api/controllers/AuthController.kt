package com.mmsbackend.api.controllers

import com.mmsbackend.data.*
import com.mmsbackend.exception.PatientNotFoundException
import com.mmsbackend.service.EmailService
import com.mmsbackend.service.security.AuthService
import com.mmsbackend.service.security.OneTimePasscodeAuthService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class AuthController(
    val authService: AuthService,
    val oneTimePasscodeAuthService: OneTimePasscodeAuthService,
    val emailService: EmailService,
) {

    @GetMapping("/health")
    fun getResource(): String {
        return "Success"
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<Any> {
        val response = authService.authenticate(request)
        return if (response != null){
            ResponseEntity.ok().body(
                LoginResponse(
                    jwtToken = response.first,
                    refreshToken = response.second,
                    userId = response.third
                )
            )
        } else {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password.")
        }
    }

    @PostMapping("/refresh")
    fun refreshToken(@RequestBody request: RefreshTokenRequest): ResponseEntity<Any> {
        return ResponseEntity.ok().body(
            RefreshTokenResponse(
                authService.refreshAccessToken(request.token)
                    ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token.")
            )
        )
    }

    @PutMapping("/update_password")
    fun updatePassword(@RequestBody request: UpdatePasswordRequest): ResponseEntity<Any> {
        return if (authService.updatePassword(request.username, request.oldPassword, request.newPassword)) {
            ResponseEntity.ok().body("Password updated successfully.")
        } else {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Update failed. Check your credentials and try again.")
        }
    }

    @PostMapping("/activate")
    fun activate(@RequestBody request: ActivateRequest): ResponseEntity<Any> {
        val response = oneTimePasscodeAuthService.authenticateOneTimePasscode(request)
        return if (response.first) {
            ResponseEntity.ok().body(response.second?.username)
        } else{
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid one-time code.")
        }
    }

    @PostMapping("/enter_email/{email}")
    fun enterEmail(@PathVariable email: String): ResponseEntity<Any> {
        return try {
            emailService.sendActivateRecoverEmail(email)
            ResponseEntity.ok().body("Email successfully sent.")
        } catch (pne: PatientNotFoundException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient with this email does not exist.")
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Issue sending email: ${e.message}")
        }
    }
}
