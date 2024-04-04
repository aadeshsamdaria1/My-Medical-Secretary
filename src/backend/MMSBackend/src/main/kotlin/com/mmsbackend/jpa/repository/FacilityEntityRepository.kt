package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.FacilityEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface FacilityEntityRepository : JpaRepository<FacilityEntity, Int>