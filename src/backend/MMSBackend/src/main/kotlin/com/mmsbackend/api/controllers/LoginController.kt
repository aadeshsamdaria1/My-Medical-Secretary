package com.mmsbackend.api.controllers

import com.mmsbackend.data.LoginRequest
import com.mmsbackend.exception.MissingPatientEmailException
import com.mmsbackend.service.AuthService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api")
class LoginController(
    val authService: AuthService
) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<String> {
        val token = try {
            authService.authenticate(request.email, request.password)
        } catch (mpe: MissingPatientEmailException) {
            return ResponseEntity.badRequest().body("Patient with email ${request.email} does not exist.")
        }

        return if (token != null){
            ResponseEntity.ok(token)
        } else {
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect email or password.")
        }
    }
}
