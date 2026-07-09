package com.hospital.booking.dto;

public class RescheduleRequest {
    private Long newSlotId;

    public RescheduleRequest() {}

    public Long getNewSlotId() {
        return newSlotId;
    }

    public void setNewSlotId(Long newSlotId) {
        this.newSlotId = newSlotId;
    }
}
