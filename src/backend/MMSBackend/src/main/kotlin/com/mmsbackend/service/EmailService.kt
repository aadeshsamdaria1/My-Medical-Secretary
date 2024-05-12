package com.mmsbackend.service

import com.mmsbackend.exception.PasscodeNotSetException
import com.mmsbackend.exception.PatientNotFoundException
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

    fun sendActivateRecoverEmail(email: String) {

        val patients = getPatients(email)
        val patientsWithCodes = patients
            .zip(
                patients.map { persistCode(passcodeService.generateRandomIntCode(), it)  }
            ) { patient, code ->
                Pair(patient, code)
            }

        patients.forEach { patient ->
            if (patient.oneTimePasscode == null) {
                throw PasscodeNotSetException("Passcode for patient ${patient.patientId} not set.")
            }
        }

        sendEmail(
            to = email,
            subject = signUpSubject,
            text = buildSignUpText(patientsWithCodes)
        )
    }

    private fun getPatients(email: String): List<PatientEntity> {
        val patients = userEntityRepository.findByEmail(email)
        if (patients.isEmpty()){
            throw PatientNotFoundException("Patient not found!")
        }
        return patients
    }

    private fun sendEmail(to: String, subject: String, text: String) {
        val message = SimpleMailMessage()
        message.from = mailProperties.username
        message.setTo(to)
        message.subject = subject
        message.text = text
        emailSender.send(message)
    }

    private fun persistCode(passcode: String, patient: PatientEntity): String {
        val oneTimePasscodeEntity = OneTimePasscodeEntity(
            id = 0, // Automatically generated
            passcode = passwordEncoder.encode(passcode),
            expiry = getExpiry()
        )
        oneTimePasscodeEntityRepository.save(oneTimePasscodeEntity)
        patient.oneTimePasscode = oneTimePasscodeEntity
        userEntityRepository.save(patient)
        return passcode
    }

    private fun getExpiry(): Date {
        return Date(Date().time + passcodeProperties.passcodeExpiry)
    }

    private fun buildSignUpText(patients: List<Pair<PatientEntity, String>>): String {
        return getIntroduction(patients) + "\n\n" +
                "Welcome to My Medical Secretary!\n\n" +
                getLinkText(patients) + "\n\n" +
                "All the best,\n" +
                "My Medical Secretary Team"
    }

    private fun getIntroduction(patients: List<Pair<PatientEntity, String>>): String {
        val firstNames = when {
            patients.size == 1 -> patients[0].first.firstname.capitalise()
            patients.size == 2 -> "${patients[0].first.firstname.capitalise()} & ${patients[1].first.firstname.capitalise()}"
            else -> {
                val allButLast = patients.dropLast(1).joinToString(", ") { it.first.firstname.capitalise() }
                val last = patients.last().first.firstname.capitalise()
                "$allButLast, & $last"
            }
        }
        return "Dear $firstNames,"
    }

    private fun getLinkText(patients: List<Pair<PatientEntity, String>>): String {
        return if (patients.size == 1) {
            "To update your password and access your account, please follow these steps:\n\n" +
                    "1. Open the 'My Medical Secretary' app.\n" +
                    "2. Copy in the 6-digit code provided below:\n\n" +
                    "Code: ${patients[0].second}\n\n" +
                    "Your username is '${patients[0].first.username}'"
        } else {
            "We notice that there are multiple accounts using this email address\n\n" +
                    "To update your password and access your account, please follow these steps:\n\n" +
                    "1. Open the 'My Medical Secretary' app.\n" +
                    "2. Copy the 6-digit code below related to the account you want to access:\n\n" +
                    multiPersonCode(patients)
        }
    }

    private fun multiPersonCode(patients: List<Pair<PatientEntity, String>>): String {
        return patients.joinToString("\n") { "Code: ${it.second} (${it.first.firstname} ${it.first.surname})" }
    }

    private fun String.capitalise(): String {
        return this.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString() }
    }

    private val signUpSubject = "My Medical Secretary Sign Up"
}
