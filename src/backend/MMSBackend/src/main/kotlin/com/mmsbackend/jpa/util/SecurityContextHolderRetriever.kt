package com.mmsbackend.jpa.util

import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service

@Service
class SecurityContextHolderRetriever {

    fun getSecurityContext(): UserDetails{
        return SecurityContextHolder.getContext().authentication.principal as UserDetails
    }
}
