package com.hospital.booking.dto;

public class ClinicalNotesRequest {
    private String clinicalNotes;
    private String prescription;

    public ClinicalNotesRequest() {}

    public String getClinicalNotes() {
        return clinicalNotes;
    }

    public void setClinicalNotes(String clinicalNotes) {
        this.clinicalNotes = clinicalNotes;
    }

    public String getPrescription() {
        return prescription;
    }

    public void setPrescription(String prescription) {
        this.prescription = prescription;
    }
}
