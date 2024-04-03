package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.DoctorEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface DoctorEntityRepository : JpaRepository<DoctorEntity, Int>
