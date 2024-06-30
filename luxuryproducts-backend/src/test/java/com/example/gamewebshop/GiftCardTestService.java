package com.example.gamewebshop;

import com.example.gamewebshop.dao.GiftCardRepository;
import com.example.gamewebshop.dao.UserRepository;
import com.example.gamewebshop.dto.EmailDto;
import com.example.gamewebshop.dto.GiftCardDto;
import com.example.gamewebshop.dto.OrderDiscountDto;
import com.example.gamewebshop.mappers.GiftCardMapper;
import com.example.gamewebshop.models.CustomUser;
import com.example.gamewebshop.models.GiftCard;
import com.example.gamewebshop.services.EmailService;
import com.example.gamewebshop.services.GiftCardMailContentBuilder;
import com.example.gamewebshop.services.GiftCardService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class GiftCardServiceTest {

    @InjectMocks
    private GiftCardService giftCardService;

    @Mock
    private GiftCardRepository giftCardRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private GiftCardMapper giftCardMapper;

    @Mock
    private GiftCardMailContentBuilder giftCardMailContentBuilder;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createGiftCard_Success() {
        double amount = 100.0;
        String email = "sender@example.com";
        Principal principal = mock(Principal.class);
        CustomUser customUser = new CustomUser();
        GiftCard giftCard = new GiftCard();
        GiftCardDto giftCardDto = new GiftCardDto();

        when(principal.getName()).thenReturn("sender@example.com");
        when(userRepository.findByEmail(email)).thenReturn(customUser);
        when(giftCardRepository.save(any(GiftCard.class))).thenReturn(giftCard);
        when(giftCardMailContentBuilder.build(anyString())).thenReturn("email content");
        when(giftCardMapper.map(any(GiftCard.class))).thenReturn(giftCardDto);

        GiftCardDto result = giftCardService.createGiftCard(amount, email, principal);

        assertNotNull(result);
        verify(giftCardRepository).save(any(GiftCard.class));
        verify(userRepository).save(customUser);
        verify(emailService).sendMail(any(EmailDto.class));
    }

    @Test
    void createGiftCard_SameEmailAsPrincipal_ThrowsException() {
        Principal principal = mock(Principal.class);
        when(principal.getName()).thenReturn("same@example.com");

        assertThrows(RuntimeException.class, () ->
                giftCardService.createGiftCard(100.0, "same@example.com", principal)
        );
    }

    @Test
    void redeemGiftCard_Success() {
        String code = "ABC123";
        double amount = 50.0;
        GiftCard giftCard = new GiftCard();
        giftCard.setBalance(100);
        giftCard.setActive(true);

        when(giftCardRepository.findByCode(code)).thenReturn(Optional.of(giftCard));

        OrderDiscountDto result = giftCardService.redeemGiftCard(code, amount);

        assertEquals(50.0, result.getDiscount());
        assertEquals(0.0, result.getAmount());
        assertEquals(50, giftCard.getBalance());
        assertTrue(giftCard.isActive());
        verify(giftCardRepository).save(giftCard);
    }

    @Test
    void redeemGiftCard_InvalidCode_ReturnsZeroDiscount() {
        when(giftCardRepository.findByCode(anyString())).thenReturn(Optional.empty());

        OrderDiscountDto result = giftCardService.redeemGiftCard("INVALID", 50.0);

        assertEquals(0.0, result.getDiscount());
        assertEquals(50.0, result.getAmount());
    }

    @Test
    void getGiftCardsByUser_ReturnsListOfGiftCards() {
        Principal principal = mock(Principal.class);
        CustomUser user = new CustomUser();
        user.setId(1L);
        List<GiftCard> giftCards = Arrays.asList(new GiftCard(), new GiftCard());

        when(principal.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail("user@example.com")).thenReturn(user);
        when(giftCardRepository.findActiveGiftCardsByUserId(1L)).thenReturn(giftCards);
        when(giftCardMapper.map(any(GiftCard.class))).thenReturn(new GiftCardDto());

        List<GiftCardDto> result = giftCardService.getGiftCardsByUser(principal);

        assertEquals(2, result.size());
        verify(giftCardRepository).findActiveGiftCardsByUserId(1L);
    }

    @Test
    void getAllGiftCards_ReturnsAllGiftCards() {
        List<GiftCard> giftCards = Arrays.asList(new GiftCard(), new GiftCard(), new GiftCard());
        when(giftCardRepository.findAll()).thenReturn(giftCards);
        when(giftCardMapper.map(any(GiftCard.class))).thenReturn(new GiftCardDto());

        List<GiftCardDto> result = giftCardService.getAllGiftCards();

        assertEquals(3, result.size());
        verify(giftCardRepository).findAll();
    }

    @Test
    void updateGiftCard_Success() {
        GiftCardDto giftCardDto = new GiftCardDto();
        giftCardDto.setId(1L);
        GiftCard existingGiftCard = new GiftCard();
        GiftCard updatedGiftCard = new GiftCard();

        when(giftCardRepository.findById(1L)).thenReturn(Optional.of(existingGiftCard));
        when(giftCardRepository.save(any(GiftCard.class))).thenReturn(updatedGiftCard);
        when(giftCardMapper.map(updatedGiftCard)).thenReturn(giftCardDto);

        GiftCardDto result = giftCardService.updateGiftCard(giftCardDto);

        assertNotNull(result);
        verify(giftCardMapper).update(existingGiftCard, giftCardDto);
        verify(giftCardRepository).save(existingGiftCard);
    }

    @Test
    void updateGiftCard_GiftCardNotFound_ThrowsException() {
        GiftCardDto giftCardDto = new GiftCardDto();
        giftCardDto.setId(1L);
        when(giftCardRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> giftCardService.updateGiftCard(giftCardDto));
    }
}