package com.mmsbackend.jpa.component

import com.mmsbackend.config.admin.RootAdminProperties
import com.mmsbackend.jpa.entity.user.AdminEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.time.Instant

@Component
class RootAdminCreator(
    val userEntityRepository: UserEntityRepository,
    val rootAdminProperties: RootAdminProperties,
    val encoder: PasswordEncoder
) {

    @EventListener(ApplicationReadyEvent::class)
    fun initializeRootUserEntities() {
        val admin = createAdmin()

        userEntityRepository.deleteByUsername(admin.username)
        userEntityRepository.save(admin)

        // TODO: Delete in production
        val patient = createPatient()

        if (!userEntityRepository.existsByUsername(patient.username)) {
            userEntityRepository.save(patient)
        }
    }

    private fun createAdmin(): AdminEntity {

        try {
            val email = System.getProperty("ROOT_ADMIN_EMAIL") ?: rootAdminProperties.defaultEmail
            val username = System.getProperty("ROOT_ADMIN_USERNAME") ?: rootAdminProperties.defaultUsername
            val password = System.getProperty("ROOT_ADMIN_PASSWORD") ?: rootAdminProperties.defaultPassword

            println("root admin!")
            println("Password $password")
            println("Username $username")
            println("Email  $email")
            println(System.getenv().entries)
            println(System.getProperties().entries)
            println(System.getenv().keys)
            println(System.getProperties().keys)
            println(System.getenv())
            println(System.getProperties())
        } catch (e: Exception) {
            println(e.message)
            e.printStackTrace()
        }

        val email = "email"
        val username = "admin"
        val password = "password"

        return AdminEntity(
            email = email,
            username = username,
            password = password,

            // Automatically generated
            mmsId = 0,
        )
    }

    private fun createPatient(): PatientEntity {

        return PatientEntity(
            mmsId = 0, // Automatically generated
            email = "sophievond@outlook.com",
            password = encoder.encode("password"),
            username = "patient_test_31",
            patientId = 999999999,
            firstname = "John",
            middleName = "Smith",
            surname = "Citizen",
            dob = Instant.now(),
            address = "1 Patient street, patient",
            suburb = "A good suburb",
            state = "Victoria",
            accountActive = true,
            oneTimePasscode = null
        )
    }
}
