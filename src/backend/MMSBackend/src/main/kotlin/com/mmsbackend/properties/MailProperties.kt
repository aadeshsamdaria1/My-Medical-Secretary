package com.mmsbackend.properties

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "spring.mail")
class MailProperties {
    lateinit var host: String
    var port: Int = 0
    lateinit var username: String
    lateinit var password: String
}
