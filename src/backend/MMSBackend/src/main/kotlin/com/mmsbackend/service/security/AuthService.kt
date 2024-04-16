package com.mmsbackend.service.security

import com.mmsbackend.config.JwtProperties
import com.mmsbackend.data.LoginRequest
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.stereotype.Service
import java.util.*

@Service
class AuthService(
    val userEntityRepository: UserEntityRepository,
    val tokenService: TokenService,
    val authManager: AuthenticationManager,
    val userDetailsService: CustomUserDetailsService,
    val jwtProperties: JwtProperties
) {

    fun authenticate(request: LoginRequest): String? {
        try {
            println(request)
            authManager.authenticate(UsernamePasswordAuthenticationToken(request.username, request.password))
        } catch (e: Exception) {
            println("FAILURE")
            println(e.message)
            return null
        }

        val user = userDetailsService.loadUserByUsername(request.username)
        return tokenService.generate(
            userDetails = user,
            expiry = Date(System.currentTimeMillis() + jwtProperties.accessTokenExpiration)
        )
    }
}
