package com.example.gamewebshop.controller;

import com.example.gamewebshop.dao.ReturnDAO;
import com.example.gamewebshop.dto.Response;
import com.example.gamewebshop.dto.ReturnDTO;
import com.example.gamewebshop.models.UserReturn;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "http://s1148232.student.inf-hsleiden.nl:18232"})
@RequestMapping("/returns")
public class ReturnController {

    private final ReturnDAO returnDAO;

    public ReturnController(ReturnDAO returnDAO) {
        this.returnDAO = returnDAO;
    }

    @GetMapping
    public ResponseEntity<List<UserReturn>> getAllReturns(){
        return ResponseEntity.ok(this.returnDAO.getAllReturns());
    }

    @PutMapping("/approve-condition")
    public ResponseEntity<?> approveReturnCondition(@RequestParam Long orderLineId) {
        try {
            Boolean isGoodCondition = true;
            String result = this.returnDAO.processReturnCondition(orderLineId, isGoodCondition);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create return", "details", e.getMessage()));
        }
    }

    @PutMapping("/not-approve-condition")
    public ResponseEntity<?> notApproveReturnCondition(@RequestParam Long orderLineId) {
        try {
            Boolean isGoodCondition = false;
            String result = this.returnDAO.processReturnCondition(orderLineId, isGoodCondition);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create return", "details", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<Response> createReturn(@RequestBody ReturnDTO returnDTO) {
        this.returnDAO.createReturn(returnDTO);
        return ResponseEntity.ok(new Response("Succesfully processed return."));
    }
}
