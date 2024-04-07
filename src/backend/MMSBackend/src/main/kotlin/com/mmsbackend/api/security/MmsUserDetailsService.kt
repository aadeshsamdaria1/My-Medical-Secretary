package com.mmsbackend.api.security

import com.mmsbackend.jpa.repository.UserEntityRepository
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class MmsUserDetailsService(
    val userEntityRepository: UserEntityRepository
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {
        val user = userEntityRepository.findByEmail(username)
            ?: throw UsernameNotFoundException("User not found with username(email): $username")

        return org.springframework.security.core.userdetails.User(
            user.email,
            user.password,
            user.authorities.map { SimpleGrantedAuthority(it.name) }
        )
    }
}
