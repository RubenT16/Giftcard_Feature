package com.example.gamewebshop.dao;

import com.example.gamewebshop.dto.OrderDTO;
import com.example.gamewebshop.models.*;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import io.micrometer.common.util.StringUtils;


import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class OrderDAO {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderLineRepository orderLineRepository;
    private final CouponRepository couponRepository;

    public OrderDAO(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository, OrderLineRepository orderLineRepository, CouponRepository couponRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderLineRepository = orderLineRepository;
        this.couponRepository = couponRepository;
    }

    public List<PlacedOrder> getAllOrders(){
        return  this.orderRepository.findAll();
    }


    @Transactional
    public void createOrder(PlacedOrder placedOrder){
        this.userRepository.save(placedOrder.getUser() );

        this.orderRepository.save(placedOrder);

    }


    @Transactional
    public String createCustomOrder(OrderDTO orderDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUser customUser = this.userRepository.findByEmail(authentication.getName());

        ArrayList<Long> productIds = orderDTO.productIds;
        Map<Long, OrderLine> orderLineMap = new HashMap<>();

        Date now = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("MMM dd, yyyy");
        String datum = formatter.format(now);



        PlacedOrder placedOrder = new PlacedOrder(orderDTO.name, orderDTO.infix, orderDTO.last_name, orderDTO.zipcode, orderDTO.houseNumber, orderDTO.notes);

        if (orderDTO.couponId != null) {
            Optional<Coupon> appliedCouponOptional = this.couponRepository.findById(orderDTO.couponId);
            if (appliedCouponOptional.isEmpty()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found");
            }
            Coupon appliedCoupon = appliedCouponOptional.get();
            placedOrder.setAppliedCoupon(appliedCoupon);
        }
        if(StringUtils.isNotEmpty(orderDTO.getGiftCardCode())){
            placedOrder.setGiftCardCode(orderDTO.getGiftCardCode());
            placedOrder.setDiscountAmount(orderDTO.getDiscountAmount());
        }

        placedOrder.setUser(customUser);
        placedOrder.setOrderDate(datum);

        this.orderRepository.save(placedOrder);

        for (long productId : productIds) {
            Optional<Product> productOptional = this.productRepository.findById(productId);

            if (productOptional.isPresent()) {
                Product product = productOptional.get();
                OrderLine orderLine = orderLineMap.get(product.getId());

                if (orderLine == null) {
                    orderLine = new OrderLine(product.getName(), product.getDescription(), (Double) product.getPrice(), product.getImgURL(), 1, product.getSpecifications(), product.getReleaseDate(), product.getPublisher(), placedOrder);
                    orderLineMap.put(product.getId(), orderLine);
                } else {
                    orderLine.setAmount(orderLine.getAmount() + 1);
                }
                product.setStock(product.getStock()-1);
                this.productRepository.save(product);
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product ID not found");
            }
        }

        // Save all unique OrderLines
        this.orderLineRepository.saveAll(orderLineMap.values());

        return "Successfully placed order";
    }

    public List<PlacedOrder> getOrdersByUserId(long userId){
        Optional<List<PlacedOrder>> orderList = this.orderRepository.findByUserId(userId);
        if (orderList.isEmpty()){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No products found with that category id"
            );
        }
        return orderList.get();
    }




}
