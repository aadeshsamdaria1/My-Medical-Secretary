package com.mmsbackend.service.security

import com.mmsbackend.data.Name
import com.mmsbackend.jpa.repository.UserEntityRepository
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
class UsernameServiceTest {

    private lateinit var usernameService: UsernameService

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @BeforeEach
    fun setup() {
        usernameService = UsernameService(userEntityRepository)
    }

    @Test
    fun `Generate a username from unseen first name of acceptable length`() {
        val name = Name("firstname", "lastname")
        val expectedUsername = "firstname"
        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = usernameService.generateUsernameFromName(name, mutableSetOf<String>())
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Generate a username where first name is too long`() {
        val name = Name("qwertyuiopasdfghjklzxcvbnm", "lastname")
        val expectedUsername = "lastname"
        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = usernameService.generateUsernameFromName(name, mutableSetOf<String>())
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Generate a username where first name is too short`() {
        val name = Name("aa", "lastname")
        val expectedUsername = "lastname"
        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = usernameService.generateUsernameFromName(name, mutableSetOf<String>())
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Generate a username where both first and last name are too short`() {
        val name = Name("aaaa", "bbbb")
        val expectedUsername = "aaaabbbb"
        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = usernameService.generateUsernameFromName(name, mutableSetOf<String>())
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Generate a username where both first and last name are too long`() {
        val name = Name("qwertyuiopasdfghjklzxcvbnm", "qwertyuiopasdfghjklzxcvbnm")
        val expectedUsername = "qwert"
        every { userEntityRepository.existsByUsername( expectedUsername ) } returns false

        val username = usernameService.generateUsernameFromName(name, mutableSetOf<String>())
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Generate a username where first name is too short and last name is too long`() {
        val name = Name("a", "qwertyuiopasdfghjklzxcvbnm")
        val expectedUsername = "patient_a"
        every { userEntityRepository.existsByUsername( expectedUsername ) } returns false

        val username = usernameService.generateUsernameFromName(name, mutableSetOf<String>())
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Generate a username where last name is too short and first name is too long`() {
        val name = Name("qwertyuiopasdfghjklzxcvbnm", "a")
        val expectedUsername = "qwert"
        every { userEntityRepository.existsByUsername( expectedUsername ) } returns false

        val username = usernameService.generateUsernameFromName(name, mutableSetOf<String>())
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Generate a username where multiple names are taken`() {
        val name = Name("firstname", "lastname")
        val expectedUsername = "firstname4"

        every { userEntityRepository.existsByUsername("firstname") } returns true
        every { userEntityRepository.existsByUsername("firstname1") } returns true
        every { userEntityRepository.existsByUsername("firstname2") } returns true
        every { userEntityRepository.existsByUsername("firstname3") } returns true
        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = usernameService.generateUsernameFromName(name, mutableSetOf<String>())
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Generate a username from a name with whitespace`() {
        val name = Name(" f i r s   t  ", "lastname")
        val expectedUsername = "first"
        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = usernameService.generateUsernameFromName(name, mutableSetOf<String>())
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Lowercase entire username & remove whitespace simultaneously`() {
        val name = Name("Van Gogh", "lastname")
        val expectedUsername = "vangogh1"

        every { userEntityRepository.existsByUsername( "vangogh") } returns true
        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = usernameService.generateUsernameFromName(name, mutableSetOf<String>())
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Pad very short names with user tag`() {
        val name = Name("ab", "cd")
        val expectedUsername = "patient_ab"

        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = usernameService.generateUsernameFromName(name, mutableSetOf<String>())
        assertEquals(username, expectedUsername)
    }

    @Test
    fun `Handle null surname`() {
        val name = Name("ab", null)
        val expectedUsername = "patient_ab"

        every { userEntityRepository.existsByUsername(expectedUsername) } returns false

        val username = usernameService.generateUsernameFromName(name, mutableSetOf<String>())
        assertEquals(username, expectedUsername)
    }
}
