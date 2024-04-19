package com.mmsbackend.config.security

import com.fasterxml.jackson.databind.ObjectMapper
import com.mmsbackend.service.security.CustomUserDetailsService
import com.mmsbackend.service.security.TokenService
import io.jsonwebtoken.ExpiredJwtException
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.time.Instant

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

        try {
            val username = tokenService.extractUsername(jwtToken)

            if (username != null && SecurityContextHolder.getContext().authentication == null) {
                val user = userDetailsService.loadUserByUsername(username)
                if (tokenService.isValid(jwtToken, user)) {
                    updateContext(user, request)
                }

                filterChain.doFilter(request, response)
            }
        } catch (eje: ExpiredJwtException) {
            sendErrorResponse(request, response, "Jwt token is expired.")
        } catch (ue: UsernameNotFoundException) {
            sendErrorResponse(request, response, "User for this jwt has been deleted.")
        } catch (e: Exception) {
            sendErrorResponse(request, response, "Error validating JWT: ${e.message}")
        }
    }

    private fun sendErrorResponse(
        request: HttpServletRequest,
        response: HttpServletResponse,
        errorMessage: String
    ) {
        val responseBody = mapOf(
            "timestamp" to Instant.now().toString(),
            "status" to HttpStatus.UNAUTHORIZED.value(),
            "error" to HttpStatus.UNAUTHORIZED.reasonPhrase,
            "message" to errorMessage,
            "path" to request.servletPath
        )
        response.contentType = MediaType.APPLICATION_JSON_VALUE
        response.status = HttpStatus.UNAUTHORIZED.value()
        response.writer.write(ObjectMapper().writeValueAsString(responseBody))
    }

    private fun updateContext(user: UserDetails, request: HttpServletRequest) {
        val authToken = UsernamePasswordAuthenticationToken(user, null, user.authorities)
        authToken.details = WebAuthenticationDetailsSource().buildDetails(request)

        SecurityContextHolder.getContext().authentication = authToken
    }

    private fun String.extractTokenValue(): String {
        return this.substringAfter("Bearer ")
    }
}
