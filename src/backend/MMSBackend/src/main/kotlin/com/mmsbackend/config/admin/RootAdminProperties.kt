package com.mmsbackend.config.admin

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("admin")
data class RootAdminProperties(
    val defaultEmail: String,
    val defaultUsername: String,
    val defaultPassword: String
)
git ad