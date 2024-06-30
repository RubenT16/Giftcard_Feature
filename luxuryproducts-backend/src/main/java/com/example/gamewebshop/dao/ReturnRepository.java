package com.example.gamewebshop.dao;

import com.example.gamewebshop.models.Category;
import com.example.gamewebshop.models.UserReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

//maps the category class to the database using the Long type as default of ID's
@Repository
public interface ReturnRepository extends JpaRepository<UserReturn, Long> {
}

