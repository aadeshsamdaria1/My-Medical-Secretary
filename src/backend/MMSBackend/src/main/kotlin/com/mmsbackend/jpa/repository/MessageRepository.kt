package com.mmsbackend.jpa.repository

import com.mmsbackend.jpa.entity.MessageEntity
import org.springframework.data.jpa.repository.JpaRepository

interface MessageRepository : JpaRepository<MessageEntity, Int> {
    fun findByPatientId(patientId: Int): List<MessageEntity>
}