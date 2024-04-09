package com.mmsbackend.service

import com.mmsbackend.api.validation.AppointmentValidation
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.PatientEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.DoctorEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import org.jsoup.Jsoup
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.sql.Time
import java.text.SimpleDateFormat
import java.util.*

@Service
class AppointmentFileService(
        private val appointmentMapper: AppointmentMapper,
        private val appointmentEntityRepository: AppointmentEntityRepository,
        private val userEntityRepository: UserEntityRepository,
        private val doctorEntityRepository: DoctorEntityRepository,
        private val appointmentValidation: AppointmentValidation
) {
    @Transactional
    fun uploadAppointmentFile(file: MultipartFile): List<Int> {
        val document = Jsoup.parse(String(file.bytes))
        val tableRows = document.getElementsByTag("tr")

        val columns = tableRows.first()
                .getElementsByTag("th")
                .eachText()
                .withIndex()
                .associate { (index, columnName) -> columnName to index }

        val appointmentIds = mutableListOf<Int>()

        for (row in tableRows.drop(1)) {
            val cells = row.getElementsByTag("td").eachText()
            try {
                val patientId = cells[columns["PatientId"]!!].toInt()
                val doctorId = cells[columns["DoctorId"]!!].toInt()
                val patient = userEntityRepository.findById(patientId).orElse(null) as? PatientEntity
                val doctor = doctorEntityRepository.findById(doctorId).orElse(null)
                if (patient != null && doctor != null) {
                    val appointmentDTO = appointmentMapper.mapHtmlAppointment(cells, columns)
                    val appointment = appointmentMapper.mapAppointmentDTO(appointmentDTO, patient, doctor)
                    if (appointmentValidation.isValidAppointment(appointment)) {
                        appointmentEntityRepository.save(appointment).also {
                            appointmentIds.add(it.id)
                        }
                    }
                }
            } catch (_: Exception) {
            }
        }
        return appointmentIds
    }
}
