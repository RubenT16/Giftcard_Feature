package com.example.gamewebshop.dto;

import lombok.Data;

import java.util.ArrayList;
@Data
public class OrderDTO{

    public String name;
    public String infix;
    public String last_name;
    public String zipcode;
    public int houseNumber;
    public String notes;
    public ArrayList<Long> productIds;
    public Long couponId;
    public  double discountAmount;
    public String giftCardCode;


}