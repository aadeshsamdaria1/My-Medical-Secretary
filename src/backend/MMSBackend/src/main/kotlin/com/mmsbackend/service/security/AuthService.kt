package com.mmsbackend.service.security

import com.mmsbackend.config.security.JwtProperties
import com.mmsbackend.data.LoginRequest
import com.mmsbackend.jpa.entity.RefreshTokenEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.entity.user.UserEntity
import com.mmsbackend.jpa.repository.RefreshTokenEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.*
import kotlin.jvm.optionals.getOrNull

@Service
class AuthService(
    val userEntityRepository: UserEntityRepository,
    val tokenService: TokenService,
    val authManager: AuthenticationManager,
    val userDetailsService: CustomUserDetailsService,
    val jwtProperties: JwtProperties,
    val refreshTokenEntityRepository: RefreshTokenEntityRepository
) {

    fun authenticate(request: LoginRequest): Triple<String, String, Int>? {
        try {
            authManager.authenticate(UsernamePasswordAuthenticationToken(request.username, request.password))
        } catch (e: Exception) {
            return null
        }

        val userDetails = userDetailsService.loadUserByUsername(request.username)
        val user = userEntityRepository.findByUsername(request.username)
            ?: return null

        val token = getToken(userDetails)
        val refreshToken = getRefreshToken(userDetails)

        persistRefreshToken(refreshToken, user)
        val userId = patientIdOrAdminMmsId(user)

        return Triple(token, refreshToken, userId)
    }

    private fun patientIdOrAdminMmsId(user: UserEntity): Int {
        return if (user is PatientEntity) {
            user.patientId
        } else{
            user.mmsId
        }
    }

    private fun persistRefreshToken(refreshToken: String, user: UserEntity) {
        refreshTokenEntityRepository.save(
            RefreshTokenEntity(
                refreshToken,
                user
            )
        )
    }

    private fun getToken(user: UserDetails) = tokenService.generate(
        userDetails = user,
        expiry = Date(System.currentTimeMillis() + jwtProperties.accessTokenExpiration)
    )

    private fun getRefreshToken(user: UserDetails) = tokenService.generate(
        userDetails = user,
        expiry = Date(System.currentTimeMillis() + jwtProperties.refreshTokenExpiration)
    )

    fun refreshAccessToken(token: String): String? {
        val extractedUsername = tokenService.extractUsername(token)

        return extractedUsername?.let { username ->
            val currentUserDetails = userDetailsService.loadUserByUsername(username)
            val user = refreshTokenEntityRepository.findById(token).getOrNull()?.user ?: return null
            val refreshTokenUserDetails = userDetailsService.loadUserByUsername(user.username)

            if (!tokenService.isExpired(token) && currentUserDetails.username == refreshTokenUserDetails.username) {
                getToken(currentUserDetails)
            } else{
                null
            }
        }
    }
}
