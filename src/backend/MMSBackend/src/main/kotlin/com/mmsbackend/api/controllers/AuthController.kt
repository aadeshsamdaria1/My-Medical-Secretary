package com.mmsbackend.api.controllers

import com.mmsbackend.api.security.objects.AuthenticationResponse
import com.mmsbackend.api.security.JwtManager
import com.mmsbackend.api.security.objects.LoginRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import javax.security.sasl.AuthenticationException

@RestController
class AuthController(
    val authenticationManager: AuthenticationManager,
    val jwtManager: JwtManager,
) {
    @PostMapping("/api/login")
    fun login(@RequestBody loginRequest: LoginRequest): ResponseEntity<*> {

        return try{
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(
                    loginRequest.username,
                    loginRequest.password
                )
            )
            val token = jwtManager.generateToken(loginRequest.username)
            ResponseEntity.ok(AuthenticationResponse(token))

        } catch (authenticationException: AuthenticationException) {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse("Invalid Username / Password pair."))
        }
    }
}

data class ErrorResponse(val message: String)
