package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.OneTimePasscodeEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface OneTimePasscodeEntityRepository: JpaRepository<OneTimePasscodeEntity, Int>
