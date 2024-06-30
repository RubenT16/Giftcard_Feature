package com.example.gamewebshop.services;

import com.example.gamewebshop.dto.EmailDto;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;
    @Async
    public void sendMail(EmailDto emailDto) {
        MimeMessagePreparator messagePreparator = mimeMessage -> {
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage);
            messageHelper.setFrom("rubent162000@gmail.com");
            messageHelper.setTo(emailDto.getRecipient());
            messageHelper.setSubject(emailDto.getSubject());
            messageHelper.setText(emailDto.getBody(),true);
        };
        try {
            mailSender.send(messagePreparator);
            log.info("Gif Card email sent!!");
        } catch (MailException e) {
            log.error("Exception occurred when sending mail", e);
            throw new RuntimeException("Exception occurred when sending mail to " + emailDto.getRecipient(), e);
        }
    }
}