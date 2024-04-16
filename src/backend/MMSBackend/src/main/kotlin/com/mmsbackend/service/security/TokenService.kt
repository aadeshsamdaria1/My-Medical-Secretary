package com.mmsbackend.service.security

import com.mmsbackend.config.JwtProperties
import com.mmsbackend.jpa.entity.JwtEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.JwtEntityRepository
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.*

@Service
class TokenService(
    val jwtEntityRepository: JwtEntityRepository,
    private val jwtProperties: JwtProperties
) {

    private val secretKey = Keys.hmacShaKeyFor(
        jwtProperties.key.toByteArray()
    )

//    @Scheduled(cron = "0 0 0 * * MON")
//    fun cleanJwtRepository() {
//        val oneHourAgo = Date(Date().time - EXPIRATION_TIME)
//        jwtEntityRepository.deleteByExpiryTimeBefore(oneHourAgo)
//    }

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

//    fun generateJwt(subject: String, now: Date): Pair<String, Date> {
//        val expiryDate = Date(now.time + EXPIRATION_TIME)
//        val key = Keys.hmacShaKeyFor(SECRET_KEY.toByteArray(Charsets.UTF_8))
//        val jwt = Jwts.builder()
//            .setSubject(subject)
//            .setIssuedAt(now)
//            .setExpiration(expiryDate)
//            .signWith(key, SignatureAlgorithm.HS256)
//            .compact()
//        return Pair(jwt, expiryDate)
//    }

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
