package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.PatientResourceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PatientResourceEntityRepository: JpaRepository<PatientResourceEntity, Int>
