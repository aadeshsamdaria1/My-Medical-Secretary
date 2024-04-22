package com.mmsbackend.api.controllers

import com.mmsbackend.data.LoginRequest
import com.mmsbackend.data.LoginResponse
import com.mmsbackend.data.RefreshTokenRequest
import com.mmsbackend.data.RefreshTokenResponse
import com.mmsbackend.service.security.AuthService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

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
}
