package com.mmsbackend.api.controllers

import com.mmsbackend.service.FileService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/files")
class FileController(
    val fileService: FileService
) {
    @PostMapping("/upload/patients")
    fun uploadUserFile(@RequestParam("file") file: MultipartFile): ResponseEntity<String> {
        return try{
            val ids = fileService.readAndUploadUserFile(
                fileBytes = String(file.bytes)
            )
            ResponseEntity.ok("Successfully created users with these ids: $ids.")
        } catch (e: Exception){
            ResponseEntity.badRequest().body("Error while uploading patients: ${e.message}.")
        }
    }

    @PostMapping("/upload/appointments")
    fun uploadAppointmentFile(@RequestParam("file") file: MultipartFile): ResponseEntity<String> {
        return try {
            val ids = fileService.readAndUploadAppointmentFile(
                fileBytes = String(file.bytes)
            )
            ResponseEntity.ok("Successfully uploaded appointments with these ids: $ids.")
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Error while uploading appointments: ${e.message}.")
        }
    }
}
