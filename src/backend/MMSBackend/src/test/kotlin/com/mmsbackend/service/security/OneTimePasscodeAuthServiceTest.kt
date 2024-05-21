package com.mmsbackend.service.security

import com.mmsbackend.data.ActivateRequest
import com.mmsbackend.jpa.entity.OneTimePasscodeEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.justRun
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.security.crypto.password.PasswordEncoder
import kotlin.random.Random
import org.junit.jupiter.api.Assertions.assertEquals
import java.util.*

@ExtendWith(MockKExtension::class)
class OneTimePasscodeAuthServiceTest {

    private lateinit var oneTimePasscodeAuthService: OneTimePasscodeAuthService

    private val encodedPassword = UUID.randomUUID().toString()
    private val encodedPasscode = UUID.randomUUID().toString()
    private val passcode = UUID.randomUUID().toString()
    private val password = UUID.randomUUID().toString()
    private val email = UUID.randomUUID().toString()

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var passwordEncoder: PasswordEncoder

    @MockK
    private lateinit var patient: PatientEntity

    @BeforeEach
    fun setup() {
        oneTimePasscodeAuthService = OneTimePasscodeAuthService(
            userEntityRepository = userEntityRepository,
            passwordEncoder = passwordEncoder
        )
        every { userEntityRepository.save(any()) } returns patient
        every { userEntityRepository.findByEmail(email) } returns listOf(patient)
        every { passwordEncoder.encode(password) } returns encodedPassword
        every { passwordEncoder.matches(password, encodedPassword) } returns true
        every { passwordEncoder.matches(passcode, encodedPasscode) } returns true
        every { patient.oneTimePasscode } returns OneTimePasscodeEntity(
            id = 1,
            passcode = encodedPasscode,
            expiry = Date(Date().time + 3_600_00)
        )

        justRun { patient.oneTimePasscode = null }
        justRun { patient.password = encodedPassword }
        justRun { patient.accountActive = true }
    }

    @Test
    fun `Successfully authenticate one time password`() {
        val response = oneTimePasscodeAuthService.authenticateOneTimePasscode(
            request = ActivateRequest(
                email = email,
                oneTimeCode = passcode,
                password = password
            )
        )
        assertEquals(response, Pair(true, patient))
    }

    @Test
    fun `Fail to authenticate one time password when passcode is wrong`() {
        val badPasscode = UUID.randomUUID().toString()
        every { passwordEncoder.matches(badPasscode, encodedPasscode) } returns false
        val response = oneTimePasscodeAuthService.authenticateOneTimePasscode(
            request = ActivateRequest(
                email = email,
                oneTimeCode = badPasscode,
                password = password
            )
        )
        assertEquals(response, Pair(false, null))
    }

    @Test
    fun `Fail to authenticate one time password when patient cannot be found`() {

        every { userEntityRepository.findByEmail(email) } returns emptyList()

        val response = oneTimePasscodeAuthService.authenticateOneTimePasscode(
            request = ActivateRequest(
                email = email,
                oneTimeCode = passcode,
                password = password
            )
        )
        assertEquals(response, Pair(false, null))
    }
}
