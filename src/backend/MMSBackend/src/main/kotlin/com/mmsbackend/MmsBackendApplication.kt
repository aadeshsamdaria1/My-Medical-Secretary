package com.mmsbackend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan

@SpringBootApplication
class MmsBackendApplication

fun main(args: Array<String>) {
    runApplication<MmsBackendApplication>(*args)
}
