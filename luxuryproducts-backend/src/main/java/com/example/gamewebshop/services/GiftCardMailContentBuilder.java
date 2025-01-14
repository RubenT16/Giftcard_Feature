package com.example.gamewebshop.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
@Service
@AllArgsConstructor
public class GiftCardMailContentBuilder {
    private final TemplateEngine templateEngine;
    public String build(String message) {
        Context context = new Context();
        context.setVariable("message", message);
        return templateEngine.process("GiftCardMailTemplate.html", context);
    }
}
