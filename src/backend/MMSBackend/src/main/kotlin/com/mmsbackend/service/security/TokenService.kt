package com.mmsbackend.service.security

import com.mmsbackend.config.JwtProperties
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.*

@Service
class TokenService(
    private final val jwtProperties: JwtProperties
) {

    private val secretKey = Keys.hmacShaKeyFor(
        jwtProperties.key.toByteArray()
    )

    fun generate(userDetails: UserDetails, expiry: Date, claims: Map<String, Any> = emptyMap()): String {
        return Jwts.builder()
            .claims()
            .subject(userDetails.username)
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(expiry)
            .add(claims)
            .and()
            .signWith(secretKey)
            .compact()
    }

    fun extractUsername(token: String): String? {
        return getAllClaims(token)
            .subject
    }

    fun isExpired(token: String): Boolean {
        return getAllClaims(token)
            .expiration
            .before(Date(System.currentTimeMillis()))
    }

    fun isValid(token: String, userDetails: UserDetails): Boolean {
        val username = extractUsername(token)
        return username == userDetails.username && !isExpired(token)
    }

    private fun getAllClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(secretKey)
            .build()
            .parseSignedClaims(token)
            .payload
    }
}
