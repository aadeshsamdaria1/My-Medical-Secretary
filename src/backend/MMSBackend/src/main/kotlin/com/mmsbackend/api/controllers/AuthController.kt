package com.mmsbackend.api.controllers

import com.mmsbackend.data.*
import com.mmsbackend.service.security.AuthService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class AuthController(
    val authService: AuthService
) {

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
}
