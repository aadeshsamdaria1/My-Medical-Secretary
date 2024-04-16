package com.mmsbackend.api.controllers

import com.mmsbackend.data.LoginRequest
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
    fun login(@RequestBody request: LoginRequest): ResponseEntity<String> {

        val token = authService.authenticate(request)

        return if (token != null){
            ResponseEntity.ok(token)
        } else {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password.")
        }
    }
}
