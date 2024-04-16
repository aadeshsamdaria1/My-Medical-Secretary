package com.mmsbackend.service.security

import com.mmsbackend.exception.MissingPatientByUsernameException
import com.mmsbackend.jpa.entity.JwtEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.JwtEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.justRun
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import java.util.*
import kotlin.random.Random

@ExtendWith(MockKExtension::class)
class AuthServiceTest {

    private lateinit var authService: AuthService

    private val username = UUID.randomUUID().toString()
    private val password = UUID.randomUUID().toString()
    private val patientId = Random.nextInt()
    private val validJwt = UUID.randomUUID().toString()
    private val expiry = Date()

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var jwtService: JwtService

    @MockK
    private lateinit var patient: PatientEntity

    @BeforeEach
    fun setup() {
        val jwtEntity = JwtEntity(0, patient, validJwt, expiry)
        authService = AuthService(
            userEntityRepository, jwtService
        )
        every { userEntityRepository.findByUsername(username) } returns patient
        every { jwtService.generateJwt(patientId.toString(), any()) } returns Pair(validJwt, expiry)
        justRun { jwtService.persistJwt(patient, validJwt, expiry) }
        every { patient.patientId } returns patientId
        every { patient.password } returns password
    }

    @Test
    fun `Successfully authenticate an email and password`() {
        val jwt = authService.authenticate(username, password)
        assertEquals(validJwt, jwt)
    }

    @Test
    fun `Fail to authenticate when email does not exist`() {
        every { userEntityRepository.findByUsername(username) } returns null
        assertThrows<MissingPatientByUsernameException> { authService.authenticate(username, password) }
    }

    @Test
    fun `Return null when password incorrect`() {
        every { patient.password } returns UUID.randomUUID().toString()
        val jwt = authService.authenticate(username, password)
        assertNull(jwt)
    }
}
