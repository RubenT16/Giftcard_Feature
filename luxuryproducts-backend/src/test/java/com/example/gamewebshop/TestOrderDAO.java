package com.example.gamewebshop;

import com.example.gamewebshop.dto.OrderDTO;
import com.example.gamewebshop.dao.*;
import com.example.gamewebshop.models.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class TestOrderDAO {
    @Mock
    private OrderRepository orderRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderLineRepository orderLineRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private OrderDAO orderDAO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void should_ReturnAllOrders_When_GetAllOrdersIsCalled() {
        List<PlacedOrder> orders = new ArrayList<>();
        orders.add(new PlacedOrder());
        when(orderRepository.findAll()).thenReturn(orders);

        List<PlacedOrder> result = orderDAO.getAllOrders();

        assertEquals(1, result.size());
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    void should_SaveUserAndOrder_When_CreateOrderIsCalled() {
        PlacedOrder placedOrder = new PlacedOrder();
        CustomUser user = new CustomUser();
        placedOrder.setUser(user);

        orderDAO.createOrder(placedOrder);

        verify(userRepository, times(1)).save(user);
        verify(orderRepository, times(1)).save(placedOrder);
    }

    @Test
    void should_SaveOrderAndOrderLines_When_CreateCustomOrderIsCalledAndProductsExist() {
        CustomUser customUser = new CustomUser();
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.productIds = new ArrayList<>(Arrays.asList(1L, 2L));
        Product product1 = new Product();
        product1.setId(1L);
        product1.setStock(10);
        Product product2 = new Product();
        product2.setId(2L);
        product2.setStock(5);

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(customUser);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));
        when(productRepository.findById(2L)).thenReturn(Optional.of(product2));

        String result = orderDAO.createCustomOrder(orderDTO);

        assertEquals("Successfully placed order", result);
        verify(orderRepository, times(1)).save(any(PlacedOrder.class));
        verify(orderLineRepository, times(1)).saveAll(anyIterable());
    }

    @Test
    void should_ThrowNotFoundException_When_CreateCustomOrderIsCalledAndProductDoesNotExist() {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.productIds = new ArrayList<>(Collections.singletonList(1L));

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("user@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(new CustomUser());
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            orderDAO.createCustomOrder(orderDTO);
        });

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("Product ID not found", exception.getReason());
    }

    @Test
    void should_ReturnOrders_When_GetOrdersByUserIdIsCalledAndOrdersExist() {
        List<PlacedOrder> orders = new ArrayList<>();
        orders.add(new PlacedOrder());

        when(orderRepository.findByUserId(1L)).thenReturn(Optional.of(orders));

        List<PlacedOrder> result = orderDAO.getOrdersByUserId(1L);

        assertEquals(1, result.size());
        verify(orderRepository, times(1)).findByUserId(1L);
    }

    @Test
    void should_ThrowNotFoundException_When_GetOrdersByUserIdIsCalledAndOrdersDoNotExist() {
        when(orderRepository.findByUserId(1L)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            orderDAO.getOrdersByUserId(1L);
        });

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("No products found with that category id", exception.getReason());
    }
}
