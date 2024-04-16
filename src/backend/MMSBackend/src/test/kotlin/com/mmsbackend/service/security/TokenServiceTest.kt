package com.mmsbackend.service.security

import com.mmsbackend.jpa.entity.JwtEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.JwtEntityRepository
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.justRun
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.time.Instant
import java.util.*

@ExtendWith(MockKExtension::class)
class TokenServiceTest {

    private lateinit var jwtService: TokenService

    private val patientId = 3
    private val validJwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiaWF0IjoxLCJleHAiOjM2MDF9." +
            "RATq_9JLEvkpCsXSYgruWa0kVOKUFns82stGuhOJvlw"

    private val date = Date.from(Instant.ofEpochMilli(1000))

    @MockK
    private lateinit var jwtEntityRepository: JwtEntityRepository

    @MockK
    private lateinit var patient: PatientEntity

    @MockK
    private lateinit var jwtEntity: JwtEntity

    @BeforeEach
    fun setup() {
        jwtService = TokenService(jwtEntityRepository)

        every { jwtEntityRepository.save( any() ) } returns jwtEntity
        every { patient.patientId } returns patientId
    }

    @Test
    fun `Successfully generate a jwt`() {
        val (jwt, expiry) = jwtService.generateJwt(patientId.toString(), date)
        assert(expiry.after(date))
        assertEquals(validJwt, jwt)
    }

    @Test
    fun `Persist a jwt`() {
        jwtService.persistJwt(patient, validJwt, date)
        verify (exactly = 1) { jwtEntityRepository.save(JwtEntity(0, patient, validJwt, date)) }
    }

    @Test
    fun `Delete stale JWTs`() {
        justRun { jwtEntityRepository.deleteByExpiryTimeBefore( any() ) }
        jwtService.cleanJwtRepository()
        verify { jwtEntityRepository.deleteByExpiryTimeBefore( any() ) }
    }
}
