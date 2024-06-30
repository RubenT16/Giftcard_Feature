package com.example.gamewebshop.dao;


import com.example.gamewebshop.models.GiftCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GiftCardRepository extends JpaRepository<GiftCard, Long> {
    Optional<GiftCard> findByCode(String code);
    @Query(value = "SELECT * FROM gift_card WHERE user_id = :userId AND active = true", nativeQuery = true)
    List<GiftCard> findActiveGiftCardsByUserId(@Param("userId") Long userId);
}
