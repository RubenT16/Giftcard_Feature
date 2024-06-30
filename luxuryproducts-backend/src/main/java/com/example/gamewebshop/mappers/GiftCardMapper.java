package com.example.gamewebshop.mappers;

import com.example.gamewebshop.dto.GiftCardDto;
import com.example.gamewebshop.models.GiftCard;
import io.micrometer.common.util.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class GiftCardMapper {
    public GiftCard map(GiftCardDto giftCardDto){
        GiftCard giftCard=new GiftCard();
        giftCard.setId(giftCardDto.getId());
        giftCard.setBalance(giftCardDto.getBalance());
        giftCard.setActive(giftCardDto.isActive());
        giftCard.setCode(giftCardDto.getCode());
        giftCard.setRecipientEmail(giftCardDto.getRecipientEmail());
        return giftCard;
    }
    public GiftCardDto map(GiftCard giftCard) {
        GiftCardDto giftCardDto = new GiftCardDto();
        giftCardDto.setId(giftCard.getId());
        giftCardDto.setBalance(giftCard.getBalance());
        giftCardDto.setActive(giftCard.isActive());
        giftCardDto.setCode(giftCard.getCode());
        giftCardDto.setRecipientEmail(giftCard.getRecipientEmail());
        if(giftCard.getCustomUser()!=null) giftCardDto.setUserEmail(giftCard.getCustomUser().getEmail());
        return giftCardDto;
        }

    public void update(GiftCard giftCard, GiftCardDto giftCardDto) {
        if(StringUtils.isNotEmpty(giftCardDto.getCode())) giftCard.setCode(giftCardDto.getCode());
        if(giftCardDto.getBalance()>=0) giftCard.setBalance(giftCardDto.getBalance());
        giftCard.setActive(giftCardDto.isActive());
    }
}
