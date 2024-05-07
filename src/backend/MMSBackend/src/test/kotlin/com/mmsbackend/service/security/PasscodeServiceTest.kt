package com.mmsbackend.service.security

import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
class PasscodeServiceTest {

    private lateinit var passcodeService: PasscodeService
    private val length = 10

    @BeforeEach
    fun setup() {
        passcodeService = PasscodeService()
    }

    @Test
    fun `Generate a passcode`() {
        val response = passcodeService.generateRandomCode(length)
        assertThat(response.length).isEqualTo(length)
    }
}
