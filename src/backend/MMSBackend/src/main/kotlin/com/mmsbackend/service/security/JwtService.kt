package com.mmsbackend.service.security

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.*

@Service
class JwtService {

    companion object {
        // TODO: Store a secure secret key in deployment environment
        const val SECRET_KEY = "Secret Key - 9FJL2NtVWq2T9HdGfRrT4w5z8BcEeHgKjNmPq5s8vBz3Cx6E9GjMbQeThWmZq4t"
        const val EXPIRATION_TIME: Long = 864_000_000
    }

    fun generateJwt(subject: String, now: Date): Pair<String, Date> {
        val expiryDate = Date(now.time + EXPIRATION_TIME)
        val key = Keys.hmacShaKeyFor(SECRET_KEY.toByteArray(Charsets.UTF_8))
        val jwt = Jwts.builder()
            .setSubject(subject)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(key, SignatureAlgorithm.HS256)
            .compact()
        return Pair(jwt, expiryDate)
    }
}
