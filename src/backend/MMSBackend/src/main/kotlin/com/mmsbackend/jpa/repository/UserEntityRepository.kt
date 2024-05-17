package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.user.AdminEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.entity.user.UserEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface UserEntityRepository : JpaRepository<UserEntity, Int> {

    @Query("SELECT u FROM PatientEntity u WHERE u.patientId = :patientId")
    fun findByPatientId(patientId: Int): PatientEntity?

    @Query("SELECT u FROM AdminEntity u WHERE u.mmsId = :mmsId")
    fun findByMmsId(mmsId: Int): AdminEntity?

    @Query("SELECT u FROM PatientEntity u WHERE u.email = :email")
    fun findByEmail(email: String): List<PatientEntity>

    @Query("SELECT u FROM UserEntity u WHERE u.username = :username")
    fun findByUsername(username: String): UserEntity?

    fun existsByUsername(username: String): Boolean

    @Modifying
    @Transactional
    @Query("DELETE FROM PatientEntity u WHERE u.patientId = :patientId")
    fun deleteByPatientId(patientId: Int)

    @Modifying
    @Transactional
    @Query("DELETE FROM AdminEntity u WHERE u.mmsId = :mmsId")
    fun deleteByMmsId(mmsId: Int)
}
