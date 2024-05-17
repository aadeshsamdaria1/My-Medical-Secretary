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

        if (!userEntityRepository.existsByUsername(admin.username)) {
            userEntityRepository.save(admin)
        }

        // TODO: Delete in production
        val patient = createPatient()

        if (!userEntityRepository.existsByUsername(patient.username)) {
            userEntityRepository.save(patient)
        }
    }

    private fun createAdmin(): AdminEntity {

        val email = rootAdminProperties.defaultEmail
        val username = rootAdminProperties.defaultUsername
        val password = encoder.encode(rootAdminProperties.defaultPassword)

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
