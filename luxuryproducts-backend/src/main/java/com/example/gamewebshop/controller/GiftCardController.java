package com.example.gamewebshop.controller;

import com.example.gamewebshop.dto.GiftCardDto;
import com.example.gamewebshop.dto.OrderDiscountDto;
import com.example.gamewebshop.services.GiftCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:4200"})
@RequestMapping("/giftcards")
public class GiftCardController {
    @Autowired
    private GiftCardService giftCardService;

    @PostMapping("/buy")
    public ResponseEntity<GiftCardDto> buyGiftCard(@RequestParam int amount,@RequestParam String email,Principal principal) {
        GiftCardDto giftCardDto = giftCardService.createGiftCard(amount, email,principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(giftCardDto);
    }
    @PutMapping("/apply")
    public ResponseEntity<OrderDiscountDto> applyGiftCard(@RequestParam double amount ,@RequestParam String code){
        return  ResponseEntity.status(HttpStatus.ACCEPTED).body(giftCardService.redeemGiftCard(code,amount)) ;
    }
    @GetMapping("/giftCards/by-user")
    public ResponseEntity<List<GiftCardDto>> getGiftCardsByUser(Principal principal){
         return  ResponseEntity.status(HttpStatus.ACCEPTED).body(giftCardService.getGiftCardsByUser(principal));
    }
    @GetMapping("")
    public ResponseEntity<List<GiftCardDto>> getAllGiftCards(Principal principal){
        return  ResponseEntity.status(HttpStatus.ACCEPTED).body(giftCardService.getAllGiftCards());
    }
    @PutMapping("")
    public ResponseEntity<GiftCardDto> updateGiftCard(@RequestBody GiftCardDto giftCardDto){
        return  ResponseEntity.status(HttpStatus.ACCEPTED).body(giftCardService.updateGiftCard(giftCardDto)) ;
    }
}
