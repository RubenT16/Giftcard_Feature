package com.example.gamewebshop.dto;

import java.time.LocalDate;

public class CouponDTO {
    public Long id;
    public String code;
    public double discountAmount;
    public LocalDate expiryDate;
    public boolean isPercentage;
    public boolean isActive;
    public int usageAmount;

    public CouponDTO() {
    }

    public CouponDTO(Long id, String code, double discountAmount, LocalDate expiryDate, boolean isPercentage, boolean isActive, int usageAmount) {
        this.id = id;
        this.code = code;
        this.discountAmount = discountAmount;
        this.expiryDate = expiryDate;
        this.isPercentage = isPercentage;
        this.isActive = isActive;
        this.usageAmount = usageAmount;
    }

    public boolean isPercentage() {
        return isPercentage;
    }

    public void setPercentage(boolean percentage) {
        isPercentage = percentage;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public boolean isActive() {
        return isActive;
    }

    public int getUsageAmount() {
        return usageAmount;
    }

    public void setUsageAmount(int usageAmount) {
        this.usageAmount = usageAmount;
    }
}
