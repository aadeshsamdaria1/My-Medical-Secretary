package com.mmsbackend.service.security

import com.mmsbackend.config.JwtProperties
import com.mmsbackend.jpa.entity.PatientEntity
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.BeforeEach
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
    private lateinit var patient: PatientEntity

    @MockK
    private lateinit var jwtProperties: JwtProperties

    @BeforeEach
    fun setup() {
        jwtService = TokenService(jwtProperties)

        every { patient.patientId } returns patientId
    }

//    @Test
//    fun `Successfully generate a jwt`() {
//        val (jwt, expiry) = jwtService.generate()
//        assert(expiry.after(date))
//        assertEquals(validJwt, jwt)
//    }

//    @Test
//    fun `Persist a jwt`() {
//        jwtService.persistJwt(patient, validJwt, date)
//        verify (exactly = 1) { jwtEntityRepository.save(JwtEntity(0, patient, validJwt, date)) }
//    }
}
