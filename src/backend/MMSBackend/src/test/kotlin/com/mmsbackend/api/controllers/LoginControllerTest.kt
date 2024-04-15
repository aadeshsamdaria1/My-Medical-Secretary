package com.mmsbackend.api.controllers

import com.mmsbackend.service.AuthService
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
class LoginControllerTest {

    private lateinit var loginController: LoginController

    @MockK
    private lateinit var authService: AuthService

    @BeforeEach
    fun setup() {
        loginController = LoginController(
            authService
        )
    }

    @Test
    fun `successfully log in and retrieve jwt token`() {

    }

    @Test
    fun `Fail is patient with given email does not exist`() {

    }

    @Test
    fun `Fail if incorrect email & password combination`() {

    }
}