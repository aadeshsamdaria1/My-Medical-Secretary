package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.JwtEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.Instant
import java.util.*

@Repository
interface JwtEntityRepository : JpaRepository<JwtEntity, Int> {

    // TODO: Call this function periodically 
    fun clearExpiredTokens() {
        val now = Date()
        val jwtEntities = this.findAll()

        jwtEntities.map {jwt ->
            if (jwt.expiryTime.before(now)) {
                jwt.id?.let {
                    id -> this.deleteById(id)
                }
            }
        }
    }
}
