package com.example.gamewebshop;

import com.example.gamewebshop.dto.OrderLineDTO;
import com.example.gamewebshop.dto.ReturnDTO;
import com.example.gamewebshop.models.*;
import com.example.gamewebshop.dao.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TestReturnDAO {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderLineRepository orderLineRepository;

    @Mock
    private ReturnRepository returnRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private ReturnDAO returnDAO;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    public void Should_ThrowException_When_OrderLineNotFoundDuringReturnCreation() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("user@example.com");
        CustomUser customUser = new CustomUser();
        when(userRepository.findByEmail("user@example.com")).thenReturn(customUser);

        OrderLineDTO orderLineDTO = new OrderLineDTO();
        orderLineDTO.setId(1L);
        orderLineDTO.setAmountReturned(1);
        orderLineDTO.setReasonForReturn("Defective");

        ReturnDTO returnDTO = new ReturnDTO();
        returnDTO.setOrderLines(Collections.singletonList(orderLineDTO));

        when(orderLineRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            returnDAO.createReturn(returnDTO);
        });
        assertThat(exception.getStatusCode(), is(HttpStatus.NOT_FOUND));
        assertThat(exception.getReason(), is("No orderline found with that id"));
    }

    @Test
    public void Should_ProcessReturnSuccessfully_When_ValidOrderLineProvided() {
        // Arrange
        OrderLine orderLine = new OrderLine();
        orderLine.setId(1L);
        orderLine.setStatus("pending");
        orderLine.setReasonForReturn("Defective");
        orderLine.setAmount(1);
        orderLine.setName("Game A");

        UserReturn userReturn = new UserReturn();
        userReturn.setOrderLines(new HashSet<>(Collections.singletonList(orderLine)));
        orderLine.setUserReturn(userReturn);

        when(orderLineRepository.findById(1L)).thenReturn(Optional.of(orderLine));
        when(productRepository.findByName("Game A")).thenReturn(Optional.of(new Product()));

        // Act
        String result = returnDAO.processReturnCondition(1L, true);

        // Assert
        assertThat(result, is("Return processed succesfully"));
        verify(orderLineRepository, times(1)).save(orderLine);
        verify(returnRepository, times(1)).save(userReturn);
        verify(productRepository, times(1)).save(org.mockito.ArgumentMatchers.any(Product.class));
    }

    @Test
    public void Should_ThrowException_When_OrderLineNotFoundDuringReturnProcessing() {
        // Arrange
        when(orderLineRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            returnDAO.processReturnCondition(1L, true);
        });
        assertThat(exception.getStatusCode(), is(HttpStatus.NOT_FOUND));
        assertThat(exception.getReason(), is("No orderline found with that id"));
    }

    @Test
    public void Should_ReturnTrue_When_ReturnContainsPendingOrderLines() {
        // Arrange
        OrderLine orderLine = new OrderLine();
        orderLine.setStatus("pending");

        UserReturn userReturn = new UserReturn();
        userReturn.setOrderLines(new HashSet<>(Collections.singletonList(orderLine)));
        orderLine.setUserReturn(userReturn);

        // Act
        Boolean result = returnDAO.doesReturnContainPendingOrderLines(orderLine);

        // Assert
        assertThat(result, is(true));
    }

    @Test
    public void Should_ReturnFalse_When_ReturnDoesNotContainPendingOrderLines() {
        // Arrange
        OrderLine orderLine = new OrderLine();
        orderLine.setStatus("Returned");

        UserReturn userReturn = new UserReturn();
        userReturn.setOrderLines(new HashSet<>(Collections.singletonList(orderLine)));
        orderLine.setUserReturn(userReturn);

        // Act
        Boolean result = returnDAO.doesReturnContainPendingOrderLines(orderLine);

        // Assert
        assertThat(result, is(false));
    }

    @Test
    public void Should_UpdateProductStock_When_ProductIsReturnedInGoodCondition() {
        // Arrange
        OrderLine orderLine = new OrderLine();
        orderLine.setName("Game A");
        orderLine.setAmount(1);

        Product product = new Product();
        product.setStock(10);

        when(productRepository.findByName("Game A")).thenReturn(Optional.of(product));

        // Act
        returnDAO.updateProductStockAfterGoodConditionReturn(orderLine);

        // Assert
        assertThat(product.getStock(), is(11));
        verify(productRepository, times(1)).save(product);
    }

    @Test
    public void Should_ThrowException_When_ProductNotFoundDuringStockUpdate() {
        // Arrange
        OrderLine orderLine = new OrderLine();
        orderLine.setName("Game A");

        when(productRepository.findByName("Game A")).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            returnDAO.updateProductStockAfterGoodConditionReturn(orderLine);
        });
        assertThat(exception.getStatusCode(), is(HttpStatus.NOT_FOUND));
        assertThat(exception.getReason(), is("No product found with that name"));
    }

    @Test
    public void Should_FindCustomUserByToken_When_AuthenticationIsValid() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("user@example.com");
        CustomUser customUser = new CustomUser();
        when(userRepository.findByEmail("user@example.com")).thenReturn(customUser);

        // Act
        CustomUser result = returnDAO.findCustomUserByToken();

        // Assert
        assertThat(result, is(customUser));
    }

    @Test
    public void Should_InitializeUserInfoToReturn_When_ReturnDTOProvided() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("user@example.com");
        CustomUser customUser = new CustomUser();
        when(userRepository.findByEmail("user@example.com")).thenReturn(customUser);

        ReturnDTO returnDTO = new ReturnDTO();
        returnDTO.setName("John");
        returnDTO.setInfix("D");
        returnDTO.setLast_name("Doe");

        // Act
        UserReturn result = returnDAO.initializeUserInfoToReturn(returnDTO);

        // Assert
        assertThat(result.getName(), is("John"));
        assertThat(result.getInfix(), is("D"));
        assertThat(result.getLast_name(), is("Doe"));
        assertThat(result.getUser(), is(customUser));
        assertThat(result.getStatus(), is("Pending"));
    }

    @Test
    public void Should_CopyOrderLineInfoToReturnObject_When_ReturnDTOAndUserReturnProvided() {
        // Arrange
        OrderLineDTO orderLineDTO = new OrderLineDTO();
        orderLineDTO.setId(1L);
        orderLineDTO.setAmountReturned(1);
        orderLineDTO.setReasonForReturn("Defective");

        ReturnDTO returnDTO = new ReturnDTO();
        returnDTO.setOrderLines(Collections.singletonList(orderLineDTO));

        OrderLine currentOrderLine = new OrderLine();
        currentOrderLine.setId(1L);
        currentOrderLine.setAmount(2);
        currentOrderLine.setReasonForReturn("Defective");

        when(orderLineRepository.findById(1L)).thenReturn(Optional.of(currentOrderLine));

        UserReturn userReturn = new UserReturn();

        // Act
        Set<OrderLine> result = returnDAO.copyOrderLineInfoToReturnObject(returnDTO, userReturn);

        // Assert
        assertThat(result.size(), is(1));
        OrderLine newOrderLine = result.iterator().next();
        assertThat(newOrderLine.getAmount(), is(1));
        assertThat(newOrderLine.getStatus(), is("Returned (Approval pending)"));
        assertThat(newOrderLine.getUserReturn(), is(userReturn));
        verify(orderLineRepository, times(2)).save(org.mockito.ArgumentMatchers.any(OrderLine.class));
    }

    @Test
    public void Should_ThrowException_When_OrderLineNotFoundDuringCopyOrderLineInfoToReturnObject() {
        // Arrange
        OrderLineDTO orderLineDTO = new OrderLineDTO();
        orderLineDTO.setId(1L);
        orderLineDTO.setAmountReturned(1);
        orderLineDTO.setReasonForReturn("Defective");

        ReturnDTO returnDTO = new ReturnDTO();
        returnDTO.setOrderLines(Collections.singletonList(orderLineDTO));

        when(orderLineRepository.findById(1L)).thenReturn(Optional.empty());

        UserReturn userReturn = new UserReturn();

        // Act & Assert
        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            returnDAO.copyOrderLineInfoToReturnObject(returnDTO, userReturn);
        });
        assertThat(exception.getStatusCode(), is(HttpStatus.NOT_FOUND));
        assertThat(exception.getReason(), is("No orderline found with that id"));
    }

    @Test
    public void Should_GetTodaysDateAsString_When_Called() {
        // Act
        String result = returnDAO.getTodaysDateAsString();

        // Assert
        assertThat(result, is(notNullValue()));
        assertThat(result, matchesPattern("\\w{3} \\d{2}, \\d{4}"));
    }
}