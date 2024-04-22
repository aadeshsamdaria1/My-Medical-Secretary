package com.mmsbackend.config.admin

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("admin")
data class RootAdminProperties(
    // TODO: Store these as environment variables not plaintext in application.yaml 
    val defaultEmail: String,
    val defaultUsername: String,
    val defaultPassword: String
)
