package com.mmsbackend.service.security

import io.mockk.every
import io.mockk.junit5.MockKExtension
import io.mockk.mockk
import io.mockk.mockkStatic
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
class PasswordServiceTest {

    private lateinit var passwordService: PasswordService

    @BeforeEach
    fun setup() {
        passwordService = PasswordService()
    }

    @Test
    fun `Successfully generate a secure password`() {
        val password = passwordService.generateSecurePassword()
        assertThat(password.length == PasswordService.PASSWORD_LENGTH)
    }
}
