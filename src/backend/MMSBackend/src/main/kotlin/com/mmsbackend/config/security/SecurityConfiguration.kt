package com.mmsbackend.config.security

import com.mmsbackend.enums.Role
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
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
                    // Open to anyone on the internet
                    .requestMatchers(
                        "/api/login",
                        "/api/activate",
                        "/api/refresh",
                        "/api/enter_email/**",
                        "/error"
                    ).permitAll()

                    // Open to admins only
                    .requestMatchers(
                        "/api/users/create_admin",
                        "/api/users/create_patient",
                        "/api/users/get_admin/**",
                        "/api/files/**",
                        "/api/resources/create",
                        "/api/resources/delete/**",
                        "/api/facilities/create",
                        "/api/facilities/delete/**",
                        "/api/doctors/create",
                        "/api/doctors/delete/**",
                        "/api/doctors/get_all",
                        "/api/appointments/create",
                        "/api/users/get_all_patients",
                        "/api/users/delete_patient/**",
                        "/api/users/delete_admin/**",
                        "/api/users/get_account_status/**"
                    ).hasRole(Role.ADMIN.toString())

                    // Open to patients only
                    .requestMatchers(
                        "/api/appointments/user_note/update"
                    ).hasRole(Role.PATIENT.toString())

                    // Open to patients and admins
                    .requestMatchers(
                        "/api/users/get_patient/**",
                        "/api/resources/get/**",
                        "/api/resources/get_all/**",
                        "/api/facilities/get/**",
                        "/api/facilities/get_all",
                        "/api/facilities/get_all_by_type/**",
                        "/api/doctors/get/**",
                        "/api/doctors/get_by_patient/id/**",
                        "/api/appointments/get/**",
                        "/api/appointments/get_all"
                    ).hasAnyRole(
                        Role.ADMIN.toString(),
                        Role.PATIENT.toString()
                    )

                    // Fully authenticate all requests
                    .anyRequest()
                    .fullyAuthenticated()
            }
            .sessionManagement {
                it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
            .requiresChannel { it.anyRequest().requiresSecure() }
            .build()
    }
}
