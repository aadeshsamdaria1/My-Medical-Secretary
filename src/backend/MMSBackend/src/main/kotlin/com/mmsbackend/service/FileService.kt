package com.mmsbackend.service

import com.mmsbackend.jpa.entity.persist
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import com.mmsbackend.jpa.repository.UserEntityRepository
import com.mmsbackend.mapping.AppointmentMapper
import com.mmsbackend.mapping.UserMapper
import org.jsoup.Jsoup
import org.springframework.stereotype.Service

@Service
class FileService(
    val userMapper: UserMapper,
    val userEntityRepository: UserEntityRepository,
    val appointmentMapper: AppointmentMapper,
    val appointmentEntityRepository: AppointmentEntityRepository
) {

    fun readAndUploadUserFile(fileBytes: String): List<Int> {

        val tableRows = Jsoup.parse(fileBytes)
            .getElementsByTag(TR_TAG)
            .map { it.getElementsByTag(TD_TAG).map { cell -> cell.text() }}

        val columns = tableRows
            .first()
            .withIndex()
            .associate { (index, columnName) -> columnName to index }

        return tableRows.drop(1).map { row ->
            userMapper.mapHtmlPatient(
                rowString = row,
                columns = columns
            ).persist(userEntityRepository, userMapper).patientId
        }
    }

    fun readAndUploadAppointmentFile(fileBytes: String): List<Int> {

        val tableRows = Jsoup.parse(fileBytes)
            .getElementsByTag(TR_TAG)
            .map { it.getElementsByTag(TD_TAG).map { cell -> cell.text() }}

        val columns = tableRows
            .first()
            .withIndex()
            .associate { (index, columnName) -> columnName to index }

        return tableRows.drop(1).mapNotNull { row ->
            appointmentMapper.mapHtmlAppointment(
                rowString = row,
                columns = columns
            )?.persist(appointmentEntityRepository, appointmentMapper)?.id
        }
    }

    companion object {
        const val TR_TAG = "tr"
        const val TD_TAG = "td"
    }
}
