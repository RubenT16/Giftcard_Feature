package com.example.gamewebshop.controller;

import com.example.gamewebshop.dao.CouponDAO;
import com.example.gamewebshop.dto.CouponDTO;
import com.example.gamewebshop.models.Coupon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:4200"})
@RequestMapping("/coupon")
public class CouponController {
    @Autowired
    private CouponDAO couponDAO;

    public CouponController(CouponDAO couponDAO) {
        this.couponDAO = couponDAO;
    }

    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons(){
        return ResponseEntity.ok(this.couponDAO.getAllCoupons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Coupon> getCouponById(@PathVariable Long id){
        return ResponseEntity.ok(this.couponDAO.getCouponById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable Long id, @RequestBody CouponDTO couponDTO){
        Coupon updatedCoupon = this.couponDAO.updateCoupon(couponDTO, id);
        return ResponseEntity.ok(updatedCoupon);
    }

    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon){
        Coupon newCoupon = this.couponDAO.createCoupon(coupon);
        return ResponseEntity.ok(newCoupon);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Long id){
        this.couponDAO.deleteById(id);
        return ResponseEntity.ok("Coupon deleted with id " + id);
    }
}