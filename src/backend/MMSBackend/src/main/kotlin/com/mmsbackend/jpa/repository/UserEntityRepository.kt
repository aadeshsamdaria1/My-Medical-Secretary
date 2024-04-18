package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.entity.UserEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Repository

@Repository
interface UserEntityRepository: JpaRepository<UserEntity, Int> {

    @Query("SELECT u FROM PatientEntity u WHERE u.patientId = :patientId")
    fun findByPatientId(patientId: Int): PatientEntity?

    @Query("SELECT u FROM UserEntity u WHERE u.username = :username")
    fun findByUsername(username: String): UserEntity?

    fun existsByUsername(username: String): Boolean
}
