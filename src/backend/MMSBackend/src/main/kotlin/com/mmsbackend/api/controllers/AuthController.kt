package com.mmsbackend.api.controllers

import com.mmsbackend.api.security.objects.AuthenticationResponse
import com.mmsbackend.api.security.JwtManager
import com.mmsbackend.api.security.objects.LoginRequest
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(
    val authenticationManager: AuthenticationManager,
    val jwtManager: JwtManager,
    val userDetailsService: UserDetailsService
) {
    @PostMapping("/api/login")
    fun login(@RequestBody loginRequest: LoginRequest): ResponseEntity<*> {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password)
        )

        val userDetails = userDetailsService.loadUserByUsername(loginRequest.username)
        val token = jwtManager.generateToken(loginRequest.username)

        return ResponseEntity.ok(AuthenticationResponse(token))
    }
}
