package com.mmsbackend.service.security

import com.mmsbackend.jpa.entity.user.AdminEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.util.*

@ExtendWith(MockKExtension::class)
class CustomUserDetailsServiceTest {

    private lateinit var customUserDetailsService: CustomUserDetailsService

    private val patientUsername = UUID.randomUUID().toString()
    private val patientPassword = UUID.randomUUID().toString()
    private val adminUsername = UUID.randomUUID().toString()
    private val adminPassword = UUID.randomUUID().toString()

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var patient: PatientEntity

    @MockK
    private lateinit var admin: AdminEntity

    @BeforeEach
    fun setup() {
        customUserDetailsService = CustomUserDetailsService(userEntityRepository)
        every { userEntityRepository.findByUsername(patientUsername) } returns patient
        every { userEntityRepository.findByUsername(adminUsername) } returns admin
        every { patient.username } returns patientUsername
        every { patient.password } returns patientPassword
        every { admin.username } returns adminUsername
        every { admin.password } returns adminPassword
    }

    @Test
    fun `Load a patient details by username`() {
        val response = customUserDetailsService.loadUserByUsername(patientUsername)

        assertThat(response.username).isEqualTo(patientUsername)
        assertThat(response.password).isEqualTo(patientPassword)
        assertThat(response.authorities)
            .extracting("authority")
            .containsExactly("ROLE_PATIENT")
    }

    @Test
    fun `Load an admin details by username`() {
        val response = customUserDetailsService.loadUserByUsername(adminUsername)

        assertThat(response.username).isEqualTo(adminUsername)
        assertThat(response.password).isEqualTo(adminPassword)
        assertThat(response.authorities)
            .extracting("authority")
            .containsExactly("ROLE_ADMIN")
    }
}
