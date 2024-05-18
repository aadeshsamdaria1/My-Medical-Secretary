package com.mmsbackend.api.controllers

import com.mmsbackend.exception.DoctorMissingException
import com.mmsbackend.exception.IdException
import com.mmsbackend.exception.ValueException
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
    companion object {
        const val IDS_TO_DISPLAY = 10
    }

    @PostMapping("/upload/patients")
    fun uploadUserFile(@RequestParam("file") file: MultipartFile): ResponseEntity<String> {
        return try{
            val (fails, successes) = fileService.readAndUploadUserFile(
                fileBytes = String(file.bytes)
            )

            if (fails.isNotEmpty()) {
                ResponseEntity.badRequest().body("Failed to upload some patients. Ensure they have valid data. " +
                        "Failed patient Ids: ${fails.take(IDS_TO_DISPLAY)}...")
            } else {
                ResponseEntity.ok("Successfully created users with these ids: $successes.")
            }

        } catch (ie: IdException) {
            ResponseEntity.badRequest().body("Failed to upload patients, patient id column missing.")
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

            if (fails.isNotEmpty()) {
                ResponseEntity.badRequest().body("Failed to upload some appointments. Ensure they have valid data." +
                        "Failed appointment Ids: ${fails.take(IDS_TO_DISPLAY)}...")
            } else {
                ResponseEntity.ok("Successfully uploaded appointments with these ids: $successes.")
            }

        } catch (de: DoctorMissingException) {
            ResponseEntity.badRequest().body("Failed to upload appointments, doctor with id ${de.doctorId} missing.")
        } catch (ie: IdException) {
            ResponseEntity.badRequest().body("Failed to upload appointments, appointment id column missing.")
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Error while uploading appointments: ${e.message}.")
        }
    }
}
