package com.mmsbackend.jpa.entity

import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import jakarta.persistence.*
import java.sql.Time
import java.time.Instant
import java.util.Date
import kotlin.jvm.optionals.getOrNull

@Entity
data class AppointmentEntity(
    @Id
    val id: Int,

    // Called 'name' in Genie
    val detail: String?,

    val reason: String?,
    val note: String?,

    val dateCreate: Instant,
    val lastUpdated: Instant,

    val startTime: Time,
    val startDate: Date,
    val duration: Int,

    // Can be edited by the user
    var userNote: String?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    val patient: PatientEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "providerId")
    val doctor: DoctorEntity
)

fun AppointmentEntity.persist(repository: AppointmentEntityRepository, mapper: AppointmentMapper): AppointmentEntity {

    val existingAppointment = repository.findById(this.id).getOrNull()
    return if (existingAppointment != null) {
        repository.save(mapper.updateExistingAppointment(existingAppointment, this))
    } else{
        repository.save(this)
    }
}
