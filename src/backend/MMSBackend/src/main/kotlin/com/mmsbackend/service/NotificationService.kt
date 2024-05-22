package com.mmsbackend.service

import org.springframework.stereotype.Service
import com.mmsbackend.data.NotificationRequest
import okhttp3.*
import java.io.IOException
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import java.text.SimpleDateFormat
import java.util.*

@Service
class NotificationService (
    private val okHttpClient: OkHttpClient
) {

    companion object {
        const val EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"
    }

    @Throws(IOException::class)
    fun sendMessageToToken(request: NotificationRequest): String {
        val json = preconfigureMessageToToken(request)
        return sendAndGetResponse(json)
    }

    private fun sendAndGetResponse(json: String): String {
        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()
        val body = json.toRequestBody(mediaType)
        val request = Request.Builder()
            .url(EXPO_PUSH_URL)
            .post(body)
            .addHeader("Content-Type", "application/json")
            .build()

        okHttpClient.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")

            return response.body.string()
        }
    }

    private fun preconfigureMessageToToken(request: NotificationRequest): String {
        val message = mapOf(
            "to" to request.deviceToken,
            "title" to request.title,
            "body" to request.body
        )
        return message.toJson()
    }

    private fun Map<String, Any>.toJson(): String {
        return jacksonObjectMapper().writeValueAsString(this)
    }

    fun sendAppointmentReminder(patient: PatientEntity, appointment: AppointmentEntity) {
        val dateFormat = SimpleDateFormat("EEE MMM dd yyyy", Locale.ENGLISH)
        val formattedDate = dateFormat.format(appointment.startDate)

        val request = NotificationRequest(
            deviceToken = patient.deviceToken ?: throw IllegalArgumentException("Device token is missing"),
            title = "Appointment Reminder",
            body = "You have an appointment on $formattedDate at ${appointment.startTime}. Please be on time."
        )
        sendMessageToToken(request)
    }
}
