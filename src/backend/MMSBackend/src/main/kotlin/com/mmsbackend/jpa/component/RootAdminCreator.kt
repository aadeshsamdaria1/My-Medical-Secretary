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
        userEntityRepository.deleteByMmsId(admin.mmsId)
        userEntityRepository.save(admin)
    }

    private fun createAdmin(): AdminEntity {

        val email = System.getProperty("ROOT_ADMIN_EMAIL") ?: rootAdminProperties.defaultEmail
        val username = System.getProperty("ROOT_ADMIN_USERNAME") ?: rootAdminProperties.defaultUsername
        val password = System.getProperty("ROOT_ADMIN_PASSWORD") ?: rootAdminProperties.defaultPassword

        return AdminEntity(
            email = email,
            username = username,
            password = encoder.encode(password),

            // Automatically generated
            mmsId = 0,
        )
    }
}
