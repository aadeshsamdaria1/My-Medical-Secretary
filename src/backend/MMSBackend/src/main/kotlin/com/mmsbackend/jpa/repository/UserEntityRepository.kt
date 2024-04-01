package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.UserEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserEntityRepository : JpaRepository<UserEntity, Int>
