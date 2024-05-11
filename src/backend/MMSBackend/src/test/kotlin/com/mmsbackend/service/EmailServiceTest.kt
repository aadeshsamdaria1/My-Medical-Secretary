package com.mmsbackend.service

import com.mmsbackend.exception.PatientAlreadyCreatedException
import com.mmsbackend.jpa.entity.OneTimePasscodeEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.OneTimePasscodeEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.properties.MailProperties
import com.mmsbackend.properties.PasscodeProperties
import com.mmsbackend.service.security.PasscodeService
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.justRun
import io.mockk.verify
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.security.crypto.password.PasswordEncoder
import java.util.*

@ExtendWith(MockKExtension::class)
class EmailServiceTest {

    private lateinit var emailService: EmailService

    private val email = UUID.randomUUID().toString()
    private val username = UUID.randomUUID().toString()
    private val firstname = UUID.randomUUID().toString()
    private val patientId = Random().nextInt()
    private val expiry = 3_600_000
    private val passcodeLength = 10
    private val passcode = UUID.randomUUID().toString()
    private val encodedPasscode = UUID.randomUUID().toString()

    @MockK
    private lateinit var userEntityRepository: UserEntityRepository

    @MockK
    private lateinit var emailSender: JavaMailSender

    @MockK
    private lateinit var passcodeService: PasscodeService

    @MockK
    private lateinit var passcodeProperties: PasscodeProperties

    @MockK
    private lateinit var oneTimePasscodeEntityRepository: OneTimePasscodeEntityRepository

    @MockK
    private lateinit var passwordEncoder: PasswordEncoder

    @MockK
    private lateinit var patient: PatientEntity

    @MockK
    private lateinit var oneTimePasscodeEntity: OneTimePasscodeEntity

    @MockK
    private lateinit var mailProperties: MailProperties

    @BeforeEach
    fun setup() {
        emailService = EmailService(
            userEntityRepository = userEntityRepository,
            emailSender = emailSender,
            passcodeService = passcodeService,
            passcodeProperties = passcodeProperties,
            oneTimePasscodeEntityRepository = oneTimePasscodeEntityRepository,
            passwordEncoder = passwordEncoder
        )
        emailService.mailProperties = mailProperties
        every { userEntityRepository.findByEmail(email) } returns listOf(patient)
        every { patient.accountActive } returns false
        every { patient.patientId } returns patientId
        every { patient.email } returns email
        every { patient.firstname } returns firstname
        every { patient.username } returns username
        every { passcodeService.generateRandomIntCode() } returns passcode
        every { passcodeProperties.passcodeExpiry } returns expiry
        every { passcodeProperties.passcodeLength } returns passcodeLength
        every { passwordEncoder.encode(passcode) } returns encodedPasscode
        every { oneTimePasscodeEntityRepository.save( any() ) } returns oneTimePasscodeEntity
        every { userEntityRepository.save( any() ) } returns patient
        every { mailProperties.username } returns username
        every { patient.oneTimePasscode } returns oneTimePasscodeEntity

        justRun { emailSender.send( any<SimpleMailMessage>() ) }
        justRun { patient.oneTimePasscode = any() }
    }

    @Test
    fun `Successfully send sign up email`() {
        emailService.sendActivateRecoverEmail(email)
        verify(exactly = 1) { emailSender.send( any<SimpleMailMessage>() ) }
    }

    @Test
    fun `Throw exception on sign up if patient doesnt exist`() {
        every { userEntityRepository.findByEmail(email) } returns emptyList()
        assertThrows<Exception> { emailService.sendActivateRecoverEmail(email) }
    }
}
