package com.inn.cafe.serviceImplTest;
import com.inn.cafe.dao.CategoryDao;
import com.inn.cafe.serviceImpl.CategoryServiceImpl;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.POJO.Category;
import com.inn.cafe.constents.CafeConstants;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class CategoryServiceImplTest {

    @Mock
    private CategoryDao categoryDao;
    
    @Mock
    private  JwtFilter jwtFilter;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddNewCategory_WithValidData_ReturnsSuccessResponse() {
        // Arrange
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("name", "Category Name");

        // Act
        ResponseEntity<String> response = categoryService.addNewCategory(requestMap);

        // Assert
        assertEquals(CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED), response);
    }

    @Test
    void testAddNewCategory_WithoutAdminAccess_ReturnsUnauthorizedResponse() {
        // Arrange
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("name", "Category Name");
        when(jwtFilter.isAdmin()).thenReturn(false);

        // Act
        ResponseEntity<String> response = categoryService.addNewCategory(requestMap);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED), response);
    }


    @Test
    void testGetAllCategory_WithValueTrue_ReturnsEmptyCategoryList() {
        // Arrange
        String value = "true";

        // Act
        ResponseEntity<List<Category>> response = categoryService.getAllCategory(value);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Collections.emptyList(), response.getBody());
        verify(categoryDao, never()).findAll();
    }

    @Test
    void testGetAllCategory_WithoutValue_ReturnsAllCategories() {
        // Arrange
        String value = null;
        List<Category> categories = Collections.singletonList(new Category());

        when(categoryDao.findAll()).thenReturn(categories);

        // Act
        ResponseEntity<List<Category>> response = categoryService.getAllCategory(value);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(categories, response.getBody());
        verify(categoryDao, times(1)).findAll();
    }

    @Test
    void testUpdate_WithValidDataAndExistingCategory_ReturnsSuccessResponse() {
        // Arrange
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("id", "1");
        requestMap.put("name", "Updated Category");

        Optional<Category> existingCategory = Optional.of(new Category());
        when(categoryDao.findById(1)).thenReturn(existingCategory);

        // Act
        ResponseEntity<String> response = categoryService.update(requestMap);

        // Assert
        assertEquals(CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED), response);
        
    }


    @Test
    void testUpdate_WithoutAdminAccess_ReturnsUnauthorizedResponse() {
        // Arrange
        Map<String, String> requestMap = new HashMap<>();
        requestMap.put("id", "1");
        requestMap.put("name", "Updated Category");

        when(jwtFilter.isAdmin()).thenReturn(false);

        // Act
        ResponseEntity<String> response = categoryService.update(requestMap);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED), response);
        
    }

    @Test
    void testUpdate_WithInvalidData_ReturnsBadRequestResponse() {
        // Arrange
        Map<String, String> requestMap = new HashMap<>();

        // Act
        ResponseEntity<String> response = categoryService.update(requestMap);

        // Assert
//        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED), response);
        verify(categoryDao, never()).save(any(Category.class));
    }
}
