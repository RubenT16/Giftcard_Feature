package com.example.gamewebshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmailDto {
    private String subject;
    private String recipient;
    private String body;
}