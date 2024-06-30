package com.example.gamewebshop.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.Set;

@Entity
public class UserReturn {
    @Id
    @GeneratedValue
    private long id;

    @Column(nullable = true)
    private String name;
    @Column(nullable = true)
    private String infix;
    @Column(nullable = true)
    private String last_name;
    @Column(nullable = true)
    private String returnDate;
    @Column(nullable = true)
    private String status;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JsonBackReference
    private CustomUser user;

    @OneToMany(mappedBy = "userReturn")
    @JsonManagedReference
    private Set<OrderLine> orderLines;

    public UserReturn() {
    }

    public UserReturn(String name, String infix, String lastName, CustomUser customUser) {
        this.name = name;
        this.infix = infix;
        this.last_name = lastName;
        this.user = customUser;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInfix() {
        return infix;
    }

    public void setInfix(String infix) {
        this.infix = infix;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public String getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(String orderDate) {
        this.returnDate = orderDate;
    }

    public CustomUser getUser() {
        return user;
    }

    public void setUser(CustomUser user) {
        this.user = user;
    }

    public Set<OrderLine> getOrderLines() {
        return orderLines;
    }

    public void setOrderLines(Set<OrderLine> orderLines) {
        this.orderLines = orderLines;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}