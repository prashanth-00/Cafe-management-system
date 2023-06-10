package com.inn.cafe.serviceImplTest;
import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.POJO.Category;
import com.inn.cafe.POJO.Product;
import com.inn.cafe.constents.CafeConstants;
import com.inn.cafe.dao.CategoryDao;
import com.inn.cafe.dao.ProductDao;
import com.inn.cafe.serviceImpl.productServiceImpl;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.utils.EmailUtil;
import com.inn.cafe.wrapper.ProductWrapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class productServiceImplTest {

    @Mock
    private ProductDao productDao;

    @Mock
    private JwtFilter jwtFilter;

    @Mock
    private EmailUtil emailUtil;

    @InjectMocks
    private productServiceImpl productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddNewProduct_WithValidAdminCredentialsAndValidRequestMap_ReturnsOkResponse() {
        // Arrange
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("name", "Coffee");
        requestMap.put("description", "Delicious coffee");
        requestMap.put("price", "5");
        requestMap.put("categoryId", "1");

        when(jwtFilter.isAdmin()).thenReturn(true);
        when(productDao.save(any(Product.class))).thenReturn(new Product());

        // Act
        ResponseEntity<String> response = productService.addNewProduct(requestMap);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(CafeUtils.getResponeEntity("Product Added Successfully", HttpStatus.OK), response);
        verify(productDao).save(any(Product.class));
    }

    @Test
    void testAddNewProduct_WithoutAdminCredentials_ReturnsUnauthorizedResponse() {
        // Arrange
        Map<String, String> requestMap = new HashMap<>();

        when(jwtFilter.isAdmin()).thenReturn(false);

        // Act
        ResponseEntity<String> response = productService.addNewProduct(requestMap);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED), response);
        verify(productDao, never()).save(any(Product.class));
    }

    @Test
    void testAddNewProduct_WithInvalidRequestMap_ReturnsInternalServerErrorResponse() {
        // Arrange
        Map<String, String> requestMap = new HashMap<>();

        when(jwtFilter.isAdmin()).thenReturn(true);

        // Act
        ResponseEntity<String> response = productService.addNewProduct(requestMap);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals(CafeUtils.getResponeEntity(CafeConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR), response);
        verify(productDao, never()).save(any(Product.class));
    }

    @Test
    void testGetAllProduct_ReturnsOkResponseWithProductList() {
        // Arrange
        when(productDao.getAllProduct()).thenReturn(Collections.singletonList(new ProductWrapper()));

        // Act
        ResponseEntity<List<ProductWrapper>> response = productService.getAllProduct();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(productDao).getAllProduct();
    }

    @Test
    void testUpdate_WithValidAdminCredentialsAndValidRequestMapAndExistingProductId_ReturnsOkResponse() {
        // Arrange
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("id", "123");
        requestMap.put("name", "Coffee");
        requestMap.put("description", "Delicious coffee");
        requestMap.put("price", "5");
        requestMap.put("categoryId", "1");

        Product existingProduct = new Product();
        existingProduct.setId(123);
        when(jwtFilter.isAdmin()).thenReturn(true);
        when(productDao.findById(123)).thenReturn(Optional.of(existingProduct));
        when(productDao.save(any(Product.class))).thenReturn(new Product());

        // Act
        ResponseEntity<String> response = productService.update(requestMap);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(CafeUtils.getResponeEntity("Product is updated successfully", HttpStatus.OK), response);
        verify(productDao).findById(123);
        verify(productDao).save(any(Product.class));
    }

    @Test
    void testUpdate_WithValidAdminCredentialsAndValidRequestMapAndNonExistingProductId_ReturnsOkResponseWithErrorMessage() {
        // Arrange
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("id", "456");
        requestMap.put("name", "Coffee");
        requestMap.put("description", "Delicious coffee");
        requestMap.put("price", "5");
        requestMap.put("categoryId", "1");

        when(jwtFilter.isAdmin()).thenReturn(true);
        when(productDao.findById(456)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<String> response = productService.update(requestMap);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(CafeUtils.getResponeEntity("Product id doesn't exist", HttpStatus.OK), response);
        verify(productDao).findById(456);
        verify(productDao, never()).save(any(Product.class));
    }

    @Test
    void testUpdate_WithoutAdminCredentials_ReturnsUnauthorizedResponse() {
        // Arrange
        when(jwtFilter.isAdmin()).thenReturn(false);

        // Act
        ResponseEntity<String> response = productService.update(Collections.emptyMap());

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED), response);
        verify(productDao, never()).findById(anyInt());
        verify(productDao, never()).save(any(Product.class));
    }

    @Test
    void testDelete_WithValidAdminCredentialsAndExistingProductId_ReturnsOkResponse() {
        // Arrange
        int productId = 123;
        when(jwtFilter.isAdmin()).thenReturn(true);
        when(productDao.findById(productId)).thenReturn(Optional.of(new Product()));

        // Act
        ResponseEntity<String> response = productService.delete(productId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(CafeUtils.getResponeEntity("Product is deleted successfully", HttpStatus.OK), response);
        verify(productDao).findById(productId);
        verify(productDao).deleteById(productId);
    }

    @Test
    void testDelete_WithValidAdminCredentialsAndNonExistingProductId_ReturnsOkResponseWithErrorMessage() {
        // Arrange
        int productId = 456;
        when(jwtFilter.isAdmin()).thenReturn(true);
        when(productDao.findById(productId)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<String> response = productService.delete(productId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(CafeUtils.getResponeEntity("Product id doesn't exist", HttpStatus.OK), response);
        verify(productDao).findById(productId);
        verify(productDao, never()).deleteById(productId);
    }

    @Test
    void testDelete_WithoutAdminCredentials_ReturnsUnauthorizedResponse() {
        // Arrange
        when(jwtFilter.isAdmin()).thenReturn(false);

        // Act
        ResponseEntity<String> response = productService.delete(123);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED), response);
        verify(productDao, never()).findById(anyInt());
        verify(productDao, never()).deleteById(anyInt());
    }

    @Test
    void testGetByCategory_ReturnsOkResponseWithProductList() {
        // Arrange
        int categoryId = 1;
        when(productDao.getByCategory(categoryId)).thenReturn(Collections.singletonList(new ProductWrapper()));

        // Act
        ResponseEntity<List<ProductWrapper>> response = productService.getByCategory(categoryId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(productDao).getByCategory(categoryId);
    }

    @Test
    void testGetProductById_ReturnsOkResponseWithProductWrapper() {
        // Arrange
        int productId = 123;
        when(productDao.getProductById(productId)).thenReturn(new ProductWrapper());

        // Act
        ResponseEntity<ProductWrapper> response = productService.getProductById(productId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(productDao).getProductById(productId);
    }
}
