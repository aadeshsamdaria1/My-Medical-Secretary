package com.mmsbackend.mapping

import com.mmsbackend.dto.doctor.DoctorDTO
import com.mmsbackend.jpa.entity.DoctorEntity
import io.mockk.junit5.MockKExtension
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.util.*
import kotlin.random.Random

@ExtendWith(MockKExtension::class)
class DoctorMapperTest {

    private lateinit var doctorMapper: DoctorMapper

    @BeforeEach
    fun setUp() {
        doctorMapper = DoctorMapper()
    }

    private val doctorId = Random.nextInt()
    private val doctorName = UUID.randomUUID().toString()
    private val doctorAddress = UUID.randomUUID().toString()
    private val doctorContact = UUID.randomUUID().toString()
    private val doctorEmail = UUID.randomUUID().toString()
    private val doctorExpertise = UUID.randomUUID().toString()
    private val doctorWebsite = UUID.randomUUID().toString()

    private val doctorDTO = DoctorDTO(
        doctorId, doctorName, doctorAddress, doctorContact, doctorEmail, doctorExpertise, doctorWebsite
    )

    @Test
    fun `Map a doctor DTO to doctor entity`() {
        val doctor = doctorMapper.mapDoctorDTO(doctorDTO)
        val expectedDoctor = DoctorEntity(
            doctorId, doctorName, doctorAddress, doctorContact, doctorEmail, doctorExpertise, doctorWebsite
        )
        assertThat(expectedDoctor).usingRecursiveComparison().isEqualTo(doctor)
    }
}