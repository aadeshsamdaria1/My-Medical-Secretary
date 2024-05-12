package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.DoctorEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface AppointmentEntityRepository : JpaRepository<AppointmentEntity, Int> {

    @Query("SELECT a FROM AppointmentEntity a WHERE a.patient.patientId = :patientId")
    fun findByPatientId(patientId: Int): List<AppointmentEntity>
}
