package com.mmsbackend

import com.mmsbackend.api.controllers.FacilityController
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
@AutoConfigureTestDatabase
class MmsBackendApplicationTests {


    @Autowired
    private lateinit var userController: FacilityController

    @Test
    fun contextLoads() {
        assertNotNull(userController)
    }
}
