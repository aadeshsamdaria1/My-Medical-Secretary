package com.mmsbackend.config.security

import com.mmsbackend.config.admin.RootAdminProperties
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.service.security.CustomUserDetailsService
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder

@Configuration
@EnableConfigurationProperties(JwtProperties::class, RootAdminProperties::class)
class Configuration {

    @Bean
    fun userDetailsService(userEntityRepository: UserEntityRepository): UserDetailsService {
        return CustomUserDetailsService(userEntityRepository)
    }

    @Bean
    fun encoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun authenticationProvider(userEntityRepository: UserEntityRepository): AuthenticationProvider {
        return DaoAuthenticationProvider()
            .also {
                it.setUserDetailsService(userDetailsService(userEntityRepository))
                it.setPasswordEncoder(encoder())
            }
    }

    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager {
        return config.authenticationManager
    }
}
