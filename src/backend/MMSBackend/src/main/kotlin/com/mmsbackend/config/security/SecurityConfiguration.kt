package com.mmsbackend.config.security

import com.mmsbackend.enums.Role
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.DefaultSecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfiguration(
    private val authenticationProvider: AuthenticationProvider
) {

    @Bean
    fun securityFilterChain(
        http: HttpSecurity,
        jwtAuthenticationFilter: JwtAuthenticationFilter
    ): DefaultSecurityFilterChain {
        return http.csrf { it.disable() }
            .authorizeHttpRequests {
                it
                    // Open to anyone
                    .requestMatchers(
                        "/api/login",
                        "/api/login/refresh",
                        "/error"
                    )
                    .permitAll()

                    // Open to admins only
                    .requestMatchers("" +
                        "/api/users/create_admin",
                        "/api/users/create_patient",
                        "/api/users/get_admin/**",
                    )
                    .hasRole(Role.ADMIN.toString())

                    // Open to patients and admins
                    .requestMatchers(
                        "/api/users/get_patient/**"
                    )
                    .hasAnyRole(Role.ADMIN.toString(), Role.PATIENT.toString())

                    // Fully authenticate all requests
                    .anyRequest()
                    .fullyAuthenticated()
            }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
            .build()
    }
}
