package com.mmsbackend.service

import com.mmsbackend.enums.AppointmentStatus
import com.mmsbackend.jpa.entity.AppointmentEntity
import com.mmsbackend.jpa.entity.user.PatientEntity
import com.mmsbackend.jpa.repository.AppointmentEntityRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit


@Service
class AppointmentReminderService(
    val appointmentEntityRepository: AppointmentEntityRepository,
    val notificationService: NotificationService
) {

    companion object {
        const val FIXED_RATE: Long = 60000
        const val DAYS_BEFORE_APPOINTMENT: Long = 1
    }

    @Scheduled(fixedRate = FIXED_RATE)
    fun sendReminders() {

        val now = Instant.now()
        val reminderTime = now.plus(DAYS_BEFORE_APPOINTMENT, ChronoUnit.DAYS)

        val appointments = appointmentEntityRepository.findByStartTimeBetween(now, reminderTime)

        appointments.forEach { appointment ->
            val patient = appointment.patient
            val lastNotifiedTime = appointment.lastNotifiedTime

            if (isValidAppointment(patient, appointment, lastNotifiedTime)) {
                notificationService.sendAppointmentReminder(patient, appointment)
                appointment.lastNotifiedTime = Instant.now()
                appointmentEntityRepository.save(appointment)
            }
        }
    }

    private fun isValidAppointment(patient: PatientEntity, appointment: AppointmentEntity, lastNotifiedTime: Instant?): Boolean {
        return patient.accountActive
            && patient.deviceToken != null
            && appointment.status == AppointmentStatus.ACTIVE
            && lastNotifiedTime == null
    }
}
