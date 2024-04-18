package com.mmsbackend.jpa.component

import com.mmsbackend.config.admin.RootAdminProperties
import com.mmsbackend.jpa.entity.user.AdminEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class RootAdminCreator(
    val userEntityRepository: UserEntityRepository,
    val rootAdminProperties: RootAdminProperties,
    val encoder: PasswordEncoder
) {

    @EventListener(ApplicationReadyEvent::class)
    fun initializeAdminEntity() {
        val admin = createAdmin()

        if (!userEntityRepository.existsByUsername(admin.username)) {
            userEntityRepository.save(admin)
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
}