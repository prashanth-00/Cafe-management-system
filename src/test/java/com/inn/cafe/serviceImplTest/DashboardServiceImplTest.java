package com.inn.cafe.serviceImplTest;
import com.inn.cafe.dao.BillDao;
import com.inn.cafe.dao.CategoryDao;
import com.inn.cafe.dao.ProductDao;
import com.inn.cafe.serviceImpl.DashboardServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class DashboardServiceImplTest {

    @Mock
    private CategoryDao categoryDao;

    @Mock
    private ProductDao productDao;

    @Mock
    private BillDao billDao;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCount_ReturnsCountOfCategoriesProductsAndBills() {
        // Arrange
        long categoryCount = 10;
        long productCount = 20;
        long billCount = 5;

        when(categoryDao.count()).thenReturn(categoryCount);
        when(productDao.count()).thenReturn(productCount);
        when(billDao.count()).thenReturn(billCount);

        Map<String, Object> expectedMap = new HashMap<>();
        expectedMap.put("category", categoryCount);
        expectedMap.put("product", productCount);
        expectedMap.put("bill", billCount);

        // Act
        ResponseEntity<Map<String, Object>> response = dashboardService.getCount();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expectedMap, response.getBody());
        
    }
}
