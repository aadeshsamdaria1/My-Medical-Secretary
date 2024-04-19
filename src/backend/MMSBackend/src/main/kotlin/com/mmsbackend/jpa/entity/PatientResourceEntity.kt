package com.mmsbackend.jpa.entity

import com.mmsbackend.jpa.entity.user.PatientEntity
import jakarta.persistence.*

@Entity
class PatientResourceEntity (

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resourceId")
    val resource: ResourceEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patientId")
    val patient: PatientEntity
)
