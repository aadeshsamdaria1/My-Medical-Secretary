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
            val (fails, successes) = fileService.readAndUploadUserFile(
                fileBytes = String(file.bytes)
            )

            // TODO: Return these to actual file to frontend
            if (fails.isNotEmpty()) {
                ResponseEntity.ok("Successfully created users with these ids: $successes, but failed to upload" +
                        " these ids: $fails.")
            }
            else {
                ResponseEntity.ok("Successfully created users with these ids: $successes.")
            }
        } catch (e: Exception){
            ResponseEntity.badRequest().body("Error while uploading patients: ${e.message}.")
        }
    }

    @PostMapping("/upload/appointments")
    fun uploadAppointmentFile(@RequestParam("file") file: MultipartFile): ResponseEntity<String> {
        return try {
            val (fails, successes) = fileService.readAndUploadAppointmentFile(
                fileBytes = String(file.bytes)
            )

            // TODO: Return these to actual file to frontend
            if (fails.isNotEmpty()) {
                ResponseEntity.ok("Successfully uploaded appointments with these ids: $successes, " +
                        "but failed to upload these ids: $fails.")
            }
            else {
                ResponseEntity.ok("Successfully uploaded appointments with these ids: $successes.")
            }
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Error while uploading appointments: ${e.message}.")
        }
    }
}
