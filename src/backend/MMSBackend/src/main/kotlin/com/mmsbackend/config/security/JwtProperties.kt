package com.mmsbackend.config.security

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("jwt")
data class JwtProperties(
    // TODO: Store these as environment variables not plaintext in application.yaml
    val key: String,
    val accessTokenExpiration: Long,
    val refreshTokenExpiration: Long
)
