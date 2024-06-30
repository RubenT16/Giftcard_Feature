package com.example.gamewebshop.dao;

import com.example.gamewebshop.dto.OrderLineDTO;
import com.example.gamewebshop.dto.ReturnDTO;
import com.example.gamewebshop.models.CustomUser;
import com.example.gamewebshop.models.OrderLine;
import com.example.gamewebshop.models.Product;
import com.example.gamewebshop.models.UserReturn;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.text.SimpleDateFormat;
import java.util.*;

@Component
public class ReturnDAO {
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderLineRepository orderLineRepository;
    private final ReturnRepository returnRepository;

    public ReturnDAO(UserRepository userRepository, ProductRepository productRepository, OrderLineRepository orderLineRepository, ReturnRepository returnRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderLineRepository = orderLineRepository;
        this.returnRepository = returnRepository;
    }

    public List<UserReturn> getAllReturns(){
        return this.returnRepository.findAll();
    }

    @Transactional
    public void createReturn(ReturnDTO returnDTO) {

        if (returnDTO.orderLines.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No items to return"
            );
        }

        UserReturn userReturn = this.initializeUserInfoToReturn(returnDTO);

        Set<OrderLine> returnOrderLines = this.copyOrderLineInfoToReturnObject(returnDTO, userReturn);

        userReturn.setOrderLines(returnOrderLines);

        userReturn.setReturnDate(getTodaysDateAsString());

        returnRepository.save(userReturn);

    }

    @Transactional
    public String processReturnCondition(Long orderLineId, Boolean isGoodCondition) {
        Optional<OrderLine> orderLineOptional = this.orderLineRepository.findById(orderLineId);

        if (orderLineOptional.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No orderline found with that id"
            );
        }

        OrderLine orderLine = orderLineOptional.get();
        orderLine.setStatus("Returned (" + orderLine.getReasonForReturn() + ")");

        if (!doesReturnContainPendingOrderLines(orderLine)) {
            orderLine.getUserReturn().setStatus("Processed");
            this.returnRepository.save(orderLine.getUserReturn());
        }

        this.orderLineRepository.save(orderLine);

        if (isGoodCondition) {
            updateProductStockAfterGoodConditionReturn(orderLine);
        }

        return "Return processed succesfully";
    }

    public Boolean doesReturnContainPendingOrderLines(OrderLine orderLine) {
        for (OrderLine orderLineObject : orderLine.getUserReturn().getOrderLines()) {
            if (orderLineObject.getStatus().contains("pending")) {
                return true;
            }
        }
        return false;
    }

    public void updateProductStockAfterGoodConditionReturn(OrderLine orderLine) {
        Optional<Product> productOptional = this.productRepository.findByName(orderLine.getName());

        if (productOptional.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "No product found with that name"
            );
        }

        Product product = productOptional.get();
        product.setStock(product.getStock() + orderLine.amount);
        this.productRepository.save(product);
    }

    public CustomUser findCustomUserByToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return this.userRepository.findByEmail(authentication.getName());
    }

    public UserReturn initializeUserInfoToReturn(ReturnDTO returnDTO) {
        CustomUser customUser = this.findCustomUserByToken();
        UserReturn userReturn = new UserReturn(returnDTO.name, returnDTO.infix, returnDTO.last_name, customUser);
        userReturn.setStatus("Pending");
        return userReturn;
    }

    public Set<OrderLine> copyOrderLineInfoToReturnObject(ReturnDTO returnDTO, UserReturn userReturn) {
        Set<OrderLine> returnOrderLines = new HashSet<>();

        for (OrderLineDTO orderLineDTO : returnDTO.orderLines) {

            Optional<OrderLine> currentOrderLineOptional = this.orderLineRepository.findById(orderLineDTO.getId());

            if (currentOrderLineOptional.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "No orderline found with that id"
                );
            }

            OrderLine currentOrderLine = currentOrderLineOptional.get();
            currentOrderLine.setAmount(currentOrderLine.getAmount()-orderLineDTO.getAmountReturned());
            orderLineRepository.save(currentOrderLine);

            OrderLine newOrderLine = getNewOrderLine(userReturn, orderLineDTO, currentOrderLine);
            orderLineRepository.save(newOrderLine);
            returnOrderLines.add(newOrderLine);
        }

        return returnOrderLines;
    }

    private static OrderLine getNewOrderLine(UserReturn userReturn, OrderLineDTO orderLineDTO, OrderLine currentOrderLine) {
        OrderLine newOrderLine = new OrderLine();
        newOrderLine.setAmount(orderLineDTO.getAmountReturned());
        newOrderLine.setStatus("Returned (Approval pending)");
        newOrderLine.setName(currentOrderLine.getName());
        newOrderLine.setDescription(currentOrderLine.getDescription());
        newOrderLine.setPrice(currentOrderLine.getPrice());
        newOrderLine.setImgURL(currentOrderLine.getImgURL());
        newOrderLine.setSpecifications(currentOrderLine.getSpecifications());
        newOrderLine.setReleaseDate(currentOrderLine.getReleaseDate());
        newOrderLine.setPublisher(currentOrderLine.getPublisher());
        newOrderLine.setReasonForReturn(currentOrderLine.getReasonForReturn());
        newOrderLine.setPlacedOrder(currentOrderLine.getPlacedOrder());
        newOrderLine.setUserReturn(userReturn); // Set the userReturn reference
        newOrderLine.setReasonForReturn(orderLineDTO.getReasonForReturn());
        return newOrderLine;
    }

    public String getTodaysDateAsString() {
        Date now = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("MMM dd, yyyy");
        return formatter.format(now);

    }
}
