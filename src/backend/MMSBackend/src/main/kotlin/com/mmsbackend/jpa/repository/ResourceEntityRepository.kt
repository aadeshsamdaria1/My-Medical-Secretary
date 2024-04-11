package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.entity.ResourceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface ResourceEntityRepository: JpaRepository<ResourceEntity, Int>


