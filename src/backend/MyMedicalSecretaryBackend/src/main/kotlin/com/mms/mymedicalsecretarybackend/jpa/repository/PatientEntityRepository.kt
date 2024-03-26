package com.mms.mymedicalsecretarybackend.jpa.repository

import com.mms.mymedicalsecretarybackend.jpa.entity.PatientEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PatientEntityRepository : JpaRepository<PatientEntity, Int>
