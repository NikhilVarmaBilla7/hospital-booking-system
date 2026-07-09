package com.hospital.booking.dto;

public class AdminReportDto {
    private long totalDoctors;
    private long totalPatients;
    private long totalAppointments;
    private long scheduledAppointments;
    private long completedAppointments;
    private long cancelledAppointments;

    public AdminReportDto() {}

    public AdminReportDto(long totalDoctors, long totalPatients, long totalAppointments, 
                            long scheduledAppointments, long completedAppointments, long cancelledAppointments) {
        this.totalDoctors = totalDoctors;
        this.totalPatients = totalPatients;
        this.totalAppointments = totalAppointments;
        this.scheduledAppointments = scheduledAppointments;
        this.completedAppointments = completedAppointments;
        this.cancelledAppointments = cancelledAppointments;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalPatients() {
        return totalPatients;
    }

    public void setTotalPatients(long totalPatients) {
        this.totalPatients = totalPatients;
    }

    public long getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(long totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public long getScheduledAppointments() {
        return scheduledAppointments;
    }

    public void setScheduledAppointments(long scheduledAppointments) {
        this.scheduledAppointments = scheduledAppointments;
    }

    public long getCompletedAppointments() {
        return completedAppointments;
    }

    public void setCompletedAppointments(long completedAppointments) {
        this.completedAppointments = completedAppointments;
    }

    public long getCancelledAppointments() {
        return cancelledAppointments;
    }

    public void setCancelledAppointments(long cancelledAppointments) {
        this.cancelledAppointments = cancelledAppointments;
    }
}
