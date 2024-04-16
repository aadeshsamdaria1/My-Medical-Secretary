package com.mmsbackend.service.security

import com.mmsbackend.jpa.entity.JwtEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.JwtEntityRepository
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.*

@Service
class JwtService(
    val jwtEntityRepository: JwtEntityRepository
) {

    companion object {
        // TODO: Store a secure secret key in deployment environment
        const val SECRET_KEY = "Secret Key - 9FJL2NtVWq2T9HdGfRrT4w5z8BcEeHgKjNmPq5s8vBz3Cx6E9GjMbQeThWmZq4t"
        const val EXPIRATION_TIME: Long = 3_600_000 // 1 hour
    }

    @Scheduled(cron = "0 0 0 * * MON")
    fun cleanJwtRepository() {
        val oneHourAgo = Date(Date().time - EXPIRATION_TIME)
        jwtEntityRepository.deleteByExpiryTimeBefore(oneHourAgo)
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

    fun persistJwt(patient: PatientEntity, token: String, expiry: Date) {
        jwtEntityRepository.save(
            JwtEntity(
                id = 0, // Automatically generated
                user = patient,
                token = token,
                expiryTime = expiry
            )
        )
    }
}
