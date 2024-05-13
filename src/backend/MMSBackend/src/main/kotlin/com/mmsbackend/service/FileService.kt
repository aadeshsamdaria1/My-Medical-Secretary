package com.mmsbackend.service

import com.mmsbackend.enums.StatusType
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.jpa.util.persist
import com.mmsbackend.mapping.AppointmentMapper
import com.mmsbackend.mapping.UserMapper
import org.jsoup.Jsoup
import org.springframework.stereotype.Service

@Service
class FileService(
    val userMapper: UserMapper,
    val userEntityRepository: UserEntityRepository,
    val appointmentMapper: AppointmentMapper,
    val appointmentEntityRepository: AppointmentEntityRepository,
) {

    fun readAndUploadUserFile(fileBytes: String): Pair<List<Int>, List<Int>> {

        val tableRows = Jsoup.parse(fileBytes)
            .getElementsByTag(TR_TAG)
            .map { it.getElementsByTag(TD_TAG).map { cell -> cell.text() }}

        val columns = tableRows
            .first()
            .withIndex()
            .associate { (index, columnName) -> columnName to index }

        val usernames = mutableSetOf<String>()

        val patientResults = tableRows.drop(1).map { row ->
            userMapper.mapHtmlPatient(
                rowString = row,
                columns = columns,
                usernames
            )
        }

        val failedPatientIds = patientResults
            .filter { it.first == StatusType.FAILURE }
            .map { it.second.toString().toInt()}

        val successfulPatients = patientResults
            .filter { it.first == StatusType.SUCCESS }
            .map { it.second as PatientEntity }

        successfulPatients.forEach { patientEntity ->
            (patientEntity).persist(userEntityRepository, userMapper).patientId
        }

        val successfulPatientIds = (successfulPatients).map {it.patientId}

        return Pair(failedPatientIds, successfulPatientIds)
    }

    fun readAndUploadAppointmentFile(fileBytes: String): Pair<List<Int>, List<Int>> {

        val tableRows = Jsoup.parse(fileBytes)
            .getElementsByTag(TR_TAG)
            .map { it.getElementsByTag(TD_TAG).map { cell -> cell.text() }}

        val columns = tableRows
            .first()
            .withIndex()
            .associate { (index, columnName) -> columnName to index }

        val appointmentResults = tableRows.drop(1).mapNotNull { row ->
            appointmentMapper.mapHtmlAppointment(
                rowString = row,
                columns = columns
            )
        }

        val failedAppointmentIds = appointmentResults
            .filter { it.first == StatusType.FAILURE }
            .map { it.second.toString().toInt()}

        val successfulAppointments = appointmentResults
            .filter { it.first == StatusType.SUCCESS }
            .map { it.second as AppointmentEntity }

        successfulAppointments.forEach { appointmentEntity ->
            (appointmentEntity).persist(appointmentEntityRepository, appointmentMapper).id
        }

        val successAppointmentIds = successfulAppointments.map {it.id}

        return Pair(failedAppointmentIds, successAppointmentIds)
    }

    companion object {
        const val TR_TAG = "tr"
        const val TD_TAG = "td"
    }
}
