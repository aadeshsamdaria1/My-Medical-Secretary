package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.ResourceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ResourceEntityRepository: JpaRepository<ResourceEntity, Int>


