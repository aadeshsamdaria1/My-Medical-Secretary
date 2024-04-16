package com.mmsbackend.jpa.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import java.util.UUID

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
open class UserEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open val mmsId: Int,

    @Column(nullable = false, unique = true)
    open val username: String,

    @Column(nullable = false)
    open val email: String,

    // Do not return password in REST requests
    @JsonIgnore
    @Column(nullable = false)
    open var password: String
)
