package com.mmsbackend.service.security

import com.mmsbackend.data.Name
import com.mmsbackend.jpa.repository.UserEntityRepository
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
class PasswordServiceTest {

    private lateinit var passwordService: PasswordService

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @BeforeEach
    fun setup() {
        passwordService = PasswordService(userEntityRepository)
    }

    @Test
    fun `Successfully generate a secure password`() {
        val password = passwordService.generateSecurePassword()
        assertThat(password.length == PasswordService.PASSWORD_LENGTH)
    }

    @Test
    fun `Generate a username from unseen first name of acceptable length`() {
        val name = Name("Firstname", "Lastname")
        val expectedUsername = "Firstname1"
        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = passwordService.generateUsernameFromName(name)
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Generate a username where first name is too long`() {
        val name = Name("qwertyuiopasdfghjklzxcvbnm", "Lastname")
        val expectedUsername = "Lastname1"
        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = passwordService.generateUsernameFromName(name)
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Generate a username where first name is too short`() {
        val name = Name("aa", "Lastname")
        val expectedUsername = "Lastname1"
        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = passwordService.generateUsernameFromName(name)
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Generate a username where both first and last name are too short`() {
        val name = Name("aaaa", "bbbb")
        val expectedUsername = "aaaabbbb1"
        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = passwordService.generateUsernameFromName(name)
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Generate a username where both first and last name are too long`() {
        val name = Name("qwertyuiopasdfghjklzxcvbnm", "qwertyuiopasdfghjklzxcvbnm")

        every { userEntityRepository.existsByUsername( any() ) } returns false

        val username = passwordService.generateUsernameFromName(name)
        assertEquals(username.length, PasswordService.MIN_BASE_USERNAME_LENGTH + 1)
    }

    @Test
    fun `Generate a username where multiple names are taken`() {
        val name = Name("Firstname", "Lastname")
        val expectedUsername = "Firstname4"

        every { userEntityRepository.existsByUsername("Firstname1") } returns true
        every { userEntityRepository.existsByUsername("Firstname2") } returns true
        every { userEntityRepository.existsByUsername("Firstname3") } returns true
        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = passwordService.generateUsernameFromName(name)
        assertEquals(username, expectedUsername)
    }
}
