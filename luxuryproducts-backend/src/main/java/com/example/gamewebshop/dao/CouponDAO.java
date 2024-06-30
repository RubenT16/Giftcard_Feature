package com.example.gamewebshop.dao;

import com.example.gamewebshop.dto.CouponDTO;
import com.example.gamewebshop.models.Coupon;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class CouponDAO {
    private final CouponRepository couponRepository;

    public CouponDAO(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public List<Coupon> getAllCoupons(){
        return this.couponRepository.findAll();
    }

    public Coupon getCouponById(long id){
        Optional<Coupon> coupon = this.couponRepository.findById(id);

        return coupon.orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "No coupon found with that id"
        ));
    }

    public Coupon updateCoupon(CouponDTO couponDTO, Long id){
        Optional<Coupon> coupon = this.couponRepository.findById(id);

        if (coupon.isPresent()){
            coupon.get().setCode(couponDTO.code);
            coupon.get().setDiscountAmount(couponDTO.discountAmount);
            coupon.get().setExpiryDate(couponDTO.expiryDate);
            coupon.get().setPercentage(couponDTO.isPercentage);
            coupon.get().setActive(couponDTO.isActive);
            coupon.get().setUsageAmount(couponDTO.usageAmount);

            return this.couponRepository.save(coupon.get());
        } else {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No coupon found with that id"
            );
        }
    }

    public Coupon createCoupon(Coupon coupon){
        return this.couponRepository.save(coupon);
    }

    public void deleteById(Long id) {
        this.couponRepository.deleteById(id);
    }
}
