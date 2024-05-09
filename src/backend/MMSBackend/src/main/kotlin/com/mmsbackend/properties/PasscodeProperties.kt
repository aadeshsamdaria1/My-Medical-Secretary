package com.mmsbackend.properties

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties("passcode")
data class PasscodeProperties(
    val passcodeLength: Int,
    val passcodeExpiry: Int
)
