package com.mmsbackend.service.security

import com.mmsbackend.enums.Role
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.entity.UserEntity
import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    val userEntityRepository: UserEntityRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        return userEntityRepository.findByUsername(username)
            ?.mapToUserDetails()
            ?: throw UsernameNotFoundException("Username not found!")
    }

    private fun UserEntity.mapToUserDetails(): UserDetails {
        return User.builder()
            .username(this.username)
            .password(this.password)
            .roles(this.getRole().name)
            .build()
    }

    private fun UserEntity.getRole(): Role {
        return if (this is PatientEntity) {
            Role.PATIENT
        } else{
            Role.ADMIN
        }
    }
}
