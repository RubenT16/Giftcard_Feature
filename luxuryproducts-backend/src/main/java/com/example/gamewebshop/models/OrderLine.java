package com.example.gamewebshop.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity(name = "orderlines")
public class OrderLine {
    @Id
    @GeneratedValue
    private Long id;

    private String name;
    @Column(length = 500)

    private String description;
    private Number price;
    private String imgURL;
    public int amount;
    @Column(length = 500)
    private String specifications;
    private String releaseDate;
    private String publisher;
    private String status;
    private int amountReturned;
    private String reasonForReturn;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JsonBackReference
    private Category category;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JsonBackReference
    private PlacedOrder placedOrder;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JsonBackReference
    private UserReturn userReturn;

    public OrderLine() {
    }

    public OrderLine(String name, String description, Double price, String imgURL, int amount, String specifications, String releaseDate, String publisher, PlacedOrder placedOrder) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imgURL = imgURL;
        this.amount = amount;
        this.specifications = specifications;
        this.releaseDate = releaseDate;
        this.publisher = publisher;
        this.status = "Delivered";
        this.placedOrder = placedOrder;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Number getPrice() {
        return price;
    }

    public void setPrice(Number price) {
        this.price = price;
    }

    public String getImgURL() {
        return imgURL;
    }

    public void setImgURL(String imgURL) {
        this.imgURL = imgURL;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public String getSpecifications() {
        return specifications;
    }

    public void setSpecifications(String specifications) {
        this.specifications = specifications;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public PlacedOrder getPlacedOrder() {
        return placedOrder;
    }

    public void setPlacedOrder(PlacedOrder placedOrder) {
        this.placedOrder = placedOrder;
    }

    public int getAmountReturned() {
        return amountReturned;
    }

    public void setAmountReturned(int amountReturned) {
        this.amountReturned = amountReturned;
    }

    public String getReasonForReturn() {
        return reasonForReturn;
    }

    public void setReasonForReturn(String reasonForReturn) {
        this.reasonForReturn = reasonForReturn;
    }

    public UserReturn getUserReturn() {
        return userReturn;
    }

    public void setUserReturn(UserReturn userReturn) {
        this.userReturn = userReturn;
    }
}

