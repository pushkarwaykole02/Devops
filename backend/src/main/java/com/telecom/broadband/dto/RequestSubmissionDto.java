package com.telecom.broadband.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public class RequestSubmissionDto {

    @NotBlank(message = "Contact Name is required")
    private String contactName;

    @NotBlank(message = "Contact Phone is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be a valid 10-digit number")
    private String contactPhone;

    @NotBlank(message = "Contact Email is required")
    @Email(message = "Please provide a valid email address")
    private String contactEmail;

    @NotBlank(message = "Installation Address Line 1 is required")
    private String addressLine1;

    private String addressLine2;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Postal Code is required")
    @Pattern(regexp = "^[0-9]{5,6}$", message = "Postal code must be 5 to 6 digits")
    private String postalCode;

    @NotNull(message = "Preferred Installation Date is required")
    private LocalDate preferredDate;

    @NotBlank(message = "Broadband Plan Name is required")
    private String planName;

    @NotBlank(message = "Plan Speed is required")
    private String planSpeed;

    @NotNull(message = "Plan Price is required")
    private Double planPrice;

    public RequestSubmissionDto() {
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public LocalDate getPreferredDate() {
        return preferredDate;
    }

    public void setPreferredDate(LocalDate preferredDate) {
        this.preferredDate = preferredDate;
    }

    public String getPlanName() {
        return planName;
    }

    public void setPlanName(String planName) {
        this.planName = planName;
    }

    public String getPlanSpeed() {
        return planSpeed;
    }

    public void setPlanSpeed(String planSpeed) {
        this.planSpeed = planSpeed;
    }

    public Double getPlanPrice() {
        return planPrice;
    }

    public void setPlanPrice(Double planPrice) {
        this.planPrice = planPrice;
    }
}
