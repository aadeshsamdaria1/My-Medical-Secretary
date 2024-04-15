package com.mmsbackend.service.security

import com.mmsbackend.exception.MissingPatientEmailException
import com.mmsbackend.jpa.entity.JwtEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.JwtEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
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

    private val email = UUID.randomUUID().toString()
    private val password = UUID.randomUUID().toString()
    private val patientId = Random.nextInt()
    private val validJwt = UUID.randomUUID().toString()
    private val expiry = Date()

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var jwtService: JwtService

    @MockK
    private lateinit var jwtEntityRepository: JwtEntityRepository

    @MockK
    private lateinit var patient: PatientEntity

    @BeforeEach
    fun setup() {
        val jwtEntity = JwtEntity(0, patient, validJwt, expiry)
        authService = AuthService(
            userEntityRepository, jwtService, jwtEntityRepository
        )
        every { userEntityRepository.findByEmail(email) } returns patient
        every { jwtService.generateJwt(patientId.toString(), any()) } returns Pair(validJwt, expiry)
        every { patient.patientId } returns patientId
        every { patient.password } returns password
        every { jwtEntityRepository.save(any()) } returns jwtEntity
    }

    @Test
    fun `Successfully authenticate an email and password`() {
        val jwt = authService.authenticate(email, password)
        assertEquals(validJwt, jwt)
    }

    @Test
    fun `Fail to authenticate when email does not exist`() {
        every { userEntityRepository.findByEmail(email) } returns null
        assertThrows<MissingPatientEmailException> { authService.authenticate(email, password) }
    }

    @Test
    fun `Return null when password incorrect`() {
        every { patient.password } returns UUID.randomUUID().toString()
        val jwt = authService.authenticate(email, password)
        assertNull(jwt)
    }
}
