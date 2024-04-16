package com.mmsbackend.api.controllers

import com.mmsbackend.service.FileService
import io.mockk.every
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.ResponseEntity
import org.springframework.web.multipart.MultipartFile

@ExtendWith(MockKExtension::class)
class FileControllerTest {

    private lateinit var fileController: FileController

    @MockK
    private lateinit var fileService: FileService

    @MockK
    private lateinit var userFile: MultipartFile

    @MockK
    private lateinit var appointmentFile: MultipartFile

    private val patientBytes = ""
    private val appointmentBytes = ""
    private val userIds = listOf(1,2,3)
    private val appointmentIds = listOf(2,3,4)

    @BeforeEach
    fun setup(){
        fileController = FileController(fileService)
        every { fileService.readAndUploadUserFile(patientBytes) } returns userIds
        every { fileService.readAndUploadAppointmentFile(appointmentBytes) } returns appointmentIds
        every { userFile.bytes } returns patientBytes.toByteArray()
        every { appointmentFile.bytes } returns appointmentBytes.toByteArray()
    }

    @Test
    fun `Successfully upload patients file`() {
        val response = fileController.uploadUserFile(userFile)
        val expectedResponse = ResponseEntity.ok("Successfully created users with " +
                "these ids: $userIds.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Elegantly handle exception in patients upload`() {
        val message = "An exception occurred with users"
        every { fileService.readAndUploadUserFile(patientBytes) } throws Exception(message)

        val response = fileController.uploadUserFile(userFile)
        val expectedResponse = ResponseEntity.badRequest().body("Error while uploading patients: $message.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Successfully upload appointments file`() {
        val response = fileController.uploadAppointmentFile(appointmentFile)
        val expectedResponse = ResponseEntity.ok("Successfully uploaded appointments with " +
                "these ids: $appointmentIds.")
        assertEquals(expectedResponse, response)
    }

    @Test
    fun `Elegantly handle exception in appointments upload`() {
        val message = "An exception occurred with appointments"
        every { fileService.readAndUploadAppointmentFile(appointmentBytes) } throws Exception(message)

        val response = fileController.uploadAppointmentFile(appointmentFile)
        val expectedResponse = ResponseEntity.badRequest().body("Error while uploading appointments: $message.")
        assertEquals(expectedResponse, response)
    }
}