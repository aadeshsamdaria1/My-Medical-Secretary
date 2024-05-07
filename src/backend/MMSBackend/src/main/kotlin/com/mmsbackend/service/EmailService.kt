package com.mmsbackend.service

import com.mmsbackend.exception.PatientAlreadyCreatedException
import com.mmsbackend.jpa.entity.OneTimePasscodeEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.OneTimePasscodeEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.properties.MailProperties
import com.mmsbackend.properties.PasscodeProperties
import com.mmsbackend.service.security.PasscodeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.util.*

@Service
class EmailService(
    val userEntityRepository: UserEntityRepository,
    val emailSender: JavaMailSender,
    val passcodeService: PasscodeService,
    val passcodeProperties: PasscodeProperties,
    val oneTimePasscodeEntityRepository: OneTimePasscodeEntityRepository,
    val passwordEncoder: PasswordEncoder
) {

    @Autowired
    lateinit var mailProperties: MailProperties

    fun sendSignUpEmail(email: String) {

        val patient = getPatient(email)

        if (patient.accountActive) {
            throw PatientAlreadyCreatedException("Patient account ${patient.patientId} already activated.")
        }

        val passcode = passcodeService.generateRandomCode(passcodeProperties.passcodeLength)
        persistCode(passcode, patient)

        sendEmail(
            to = patient.email,
            subject = signUpSubject,
            text = buildSignUpText(patient, passcode)
        )
    }

    fun sendForgotPasswordEmail(email: String) {

        val patient = getPatient(email)

        // TODO: Validate this patient

        sendEmail(
            to = patient.email,
            subject = forgotPasswordSubject,
            text = buildForgotPasswordText(patient)
        )
    }

    private fun getPatient(email: String): PatientEntity {
        return userEntityRepository.findByEmail(email)
            ?: throw Exception("User not found!")
    }

    private fun sendEmail(to: String, subject: String, text: String) {
        val message = SimpleMailMessage()
        message.from = mailProperties.username
        message.setTo(to)
        message.subject = subject
        message.text = text
        emailSender.send(message)
    }

    private fun persistCode(passcode: String, patient: PatientEntity) {
        val oneTimePasscodeEntity = OneTimePasscodeEntity(
            id = 0, // Automatically generated
            passcode = passwordEncoder.encode(passcode),
            expiry = getExpiry()
        )

        oneTimePasscodeEntityRepository.save(oneTimePasscodeEntity)
        patient.oneTimePasscode = oneTimePasscodeEntity
        userEntityRepository.save(patient)
    }

    private fun getExpiry(): Date {
        return Date(Date().time + passcodeProperties.passcodeExpiry)
    }

    private fun buildSignUpText(patient: PatientEntity, passcode: String): String {
        return """
        Dear ${patient.firstname.capitalise()},
        
        Welcome to My Medical Secretary!
        
        To complete your registration and log into your account, please follow the link below:
        
        <Link> Passcode: $passcode Patient ID: ${patient.patientId}
        
        You username is: ${patient.username}
        
        All the best,
        My Medical Secretary Team
    """.trimIndent()
    }

    private fun buildForgotPasswordText(patient: PatientEntity): String {
        return """
        Dear ${patient.firstname.capitalise()},
        
        To recover your account and change your password, follow the link below:
        
        <Link>
        
        All the best,
        My Medical Secretary Team
    """.trimIndent()
    }

    private fun String.capitalise(): String {
        return this.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString() }
    }

    private val signUpSubject = "My Medical Secretary Sign Up"
    private val forgotPasswordSubject = "My Medical Secretary - Forgotten Password"
}
