package com.example.gamewebshop.services;


import com.example.gamewebshop.dao.GiftCardRepository;
import com.example.gamewebshop.dao.UserRepository;
import com.example.gamewebshop.dto.EmailDto;
import com.example.gamewebshop.dto.GiftCardDto;
import com.example.gamewebshop.dto.OrderDiscountDto;
import com.example.gamewebshop.mappers.GiftCardMapper;
import com.example.gamewebshop.models.CustomUser;
import com.example.gamewebshop.models.GiftCard;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class GiftCardService {
    private final GiftCardRepository giftCardRepository;

    private final EmailService emailService;
    private final GiftCardMapper giftCardMapper;
    private final GiftCardMailContentBuilder giftCardMailContentBuilder;
    private final UserRepository userRepository;
    public GiftCardDto createGiftCard(double amount, String email,Principal principal) {
        if(!email.equals(principal.getName())){
            throw new RuntimeException("invalid email");
        }
        CustomUser customUser=userRepository.findByEmail(email);
        GiftCard giftCard = new GiftCard();
        giftCard.setCode(UUID.randomUUID().toString().substring(0, 6));
        giftCard.setBalance((int) amount);
        giftCard.setActive(true);
        giftCard.setRecipientEmail(email);
        giftCard.setCustomUser(customUser);
        GiftCard savedGiftCard= giftCardRepository.save(giftCard);
        if (customUser.getGiftCards() == null) {
            customUser.setGiftCards(new HashSet<>());
        }
        customUser.getGiftCards().add(savedGiftCard);
        userRepository.save(customUser);
        String message = giftCardMailContentBuilder.build("This is your gift Card code : " +giftCard.getCode()+" the amount of your giftCard is :" + amount);
        emailService.sendMail(new EmailDto("Gift card", email, message));
        return giftCardMapper.map(giftCard);
    }

    public OrderDiscountDto redeemGiftCard(String code, double amount) {
        Optional<GiftCard> optionalGiftCard = giftCardRepository.findByCode(code);
        OrderDiscountDto orderDiscountDto =new OrderDiscountDto();

        if (!optionalGiftCard.isPresent() || !optionalGiftCard.get().isActive() || amount<= 0) {
            orderDiscountDto.setDiscount(0.0);
            orderDiscountDto.setAmount(amount);
            return orderDiscountDto;
        }

        GiftCard giftCard = optionalGiftCard.get();
        double balance = giftCard.getBalance();
        double redeemedAmount = Math.min(balance, amount);

        if (redeemedAmount > 0) {
            giftCard.setBalance((int) (balance - redeemedAmount));
            giftCard.setActive(giftCard.getBalance() > 0);
            giftCardRepository.save(giftCard);
        }
        orderDiscountDto.setAmount(amount-redeemedAmount);
        orderDiscountDto.setDiscount(redeemedAmount);
        return orderDiscountDto;
    }

    public List<GiftCardDto> getGiftCardsByUser(Principal principal) {
        CustomUser user =userRepository.findByEmail(principal.getName());
        List<GiftCard> giftCards=giftCardRepository.findActiveGiftCardsByUserId(user.getId());
        return giftCards.stream().map(giftCardMapper::map).toList();
    }

    public List<GiftCardDto>  getAllGiftCards() {
        return giftCardRepository.findAll().stream().map(giftCardMapper::map).toList();
    }

    public GiftCardDto updateGiftCard(GiftCardDto giftCardDto) {
        GiftCard giftCard=giftCardRepository.findById(giftCardDto.getId()).orElseThrow(()->new RuntimeException("no gift card with this id"));
        giftCardMapper.update(giftCard,giftCardDto);
        GiftCard savedGiftCard =giftCardRepository.save(giftCard);
        return giftCardMapper.map(savedGiftCard);
    }
}
