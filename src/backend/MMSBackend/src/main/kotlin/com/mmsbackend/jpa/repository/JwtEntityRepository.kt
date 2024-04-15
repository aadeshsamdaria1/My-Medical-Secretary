package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.JwtEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface JwtEntityRepository : JpaRepository<JwtEntity, Int> {

    // TODO: Call this function periodically
    fun deleteByExpiryTimeBefore(expiryTime: Date)
}
