package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.PatientResourceEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface PatientResourceEntityRepository: JpaRepository<PatientResourceEntity, Int>{

    @Query("SELECT pr FROM PatientResourceEntity pr WHERE pr.patient.patientId = :patientId")
    fun findAllByPatientId(patientId: Int): List<PatientResourceEntity>
}
