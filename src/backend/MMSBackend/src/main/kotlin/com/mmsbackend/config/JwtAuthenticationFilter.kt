package com.mmsbackend.config

import com.mmsbackend.service.security.CustomUserDetailsService
import com.mmsbackend.service.security.TokenService
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    val userDetailsService: CustomUserDetailsService,
    val tokenService: TokenService
): OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader: String? = request.getHeader("Authorization")

        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            filterChain.doFilter(request, response)
            return
        }

        val jwtToken = authHeader.extractTokenValue()
        val username = tokenService.extractUsername(jwtToken)

        if (username != null && SecurityContextHolder.getContext().authentication == null) {
            val user = userDetailsService.loadUserByUsername(username)
            println("Loaded user ${user.username}")
            if (tokenService.isValid(jwtToken, user)) {
                updateContext(user, request)
            }

            filterChain.doFilter(request, response)
        }
    }

    private fun updateContext(user: UserDetails, request: HttpServletRequest) {
        val authToken = UsernamePasswordAuthenticationToken(user, null, user.authorities)
        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)

        SecurityContextHolder.getContext().authentication = authToken
    }

    private fun String.extractTokenValue(): String {
        return this.substringAfter("Bearer")
    }
}
