package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.PatientEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PatientEntityRepository : JpaRepository<PatientEntity, Int>
