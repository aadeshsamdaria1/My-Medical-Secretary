package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.RefreshTokenEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface RefreshTokenEntityRepository: JpaRepository<RefreshTokenEntity, String>
