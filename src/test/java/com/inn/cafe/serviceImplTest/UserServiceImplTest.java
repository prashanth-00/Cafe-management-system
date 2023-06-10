package com.inn.cafe.serviceImplTest;

import com.inn.cafe.JWT.CustomerUserDetailsService;
import com.inn.cafe.JWT.JwtFilter;
import com.inn.cafe.JWT.jwtUtil;
import com.inn.cafe.POJO.User;
import com.inn.cafe.constents.CafeConstants;
import com.inn.cafe.dao.UserDao;
import com.inn.cafe.serviceImpl.UserServiceImpl;
import com.inn.cafe.utils.CafeUtils;
import com.inn.cafe.utils.EmailUtil;
import com.inn.cafe.wrapper.UserWrapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

	@Mock
	private UserDao userDao;

	@Mock
	private jwtUtil jwtUtil;

	@Mock
	private JwtFilter jwtFilter;

	@Mock
	private CustomerUserDetailsService customerUserDetailsService;

	@Mock
	private EmailUtil emailUtil;

	@InjectMocks
	private UserServiceImpl userService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void testSignUp_WithValidRequestMap_ReturnsOkResponse() {
		// Arrange
		Map<String, String> requestMap = new HashMap<>();
		requestMap.put("name", "John Doe");
		requestMap.put("contactNumber", "1234567890");
		requestMap.put("email", "john.doe@example.com");
		requestMap.put("password", "secretpassword");
		requestMap.put("status", "true");

		// Act
		ResponseEntity<String> response = userService.signUp(requestMap);

		// Assert
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(CafeUtils.getResponeEntity("Successfully  Registered.", HttpStatus.OK), response);
	}

	@Test
	void testSignUp_WithExistingEmail_ReturnsOKResponse() {
		// Arrange
		Map<String, String> requestMap = new HashMap<>();
		requestMap.put("name", "John Doe");
		requestMap.put("contactNumber", "1234567890");
		requestMap.put("email", "john.doe@example.com");
		requestMap.put("password", "secretpassword");
		requestMap.put("status", "true");

		// Act
		ResponseEntity<String> response = userService.signUp(requestMap);

		// Assert
		assertEquals(CafeUtils.getResponeEntity("Successfully  Registered.", HttpStatus.OK), response);
	}

	@Test
	void testSignUp_WithInvalidRequestMap_ReturnsBadRequestResponse() {
		// Arrange
		Map<String, String> requestMap = new HashMap<>();

		// Act
		ResponseEntity<String> response = userService.signUp(requestMap);

		// Assert
		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertEquals(CafeUtils.getResponeEntity(CafeConstants.INVALID_DATA, HttpStatus.BAD_REQUEST), response);
	}

	@Test
	void testGetAllUser_WithAdmin_ReturnsUnauthorizedResponse() {
		// Act
		ResponseEntity<List<UserWrapper>> response = userService.getAllUser();

		// Assert
		assertEquals(new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED), response);
		assertEquals(0, response.getBody().size());
	}

	@Test
	void testLogin_WithInValidCredentialsAndApprovedUser() {
		// Arrange
		Map<String, String> requestMap = new HashMap<>();
		requestMap.put("email", "john.doe@example.com");
		requestMap.put("password", "secretpassword");

		User user = new User();
		user.setStatus("true");

		// Act
		ResponseEntity<String> response = userService.login(requestMap);

		// Assert
		assertEquals(new ResponseEntity<String>("{\"message\":\"" + "Bad Credentials." + "\"}", HttpStatus.BAD_REQUEST),
				response);
	}

	@Test
	void testLogin_WithInValidCredentialsAndUnapprovedUser_ReturnsBadRequestResponse() {
		// Arrange
		Map<String, String> requestMap = new HashMap<>();
		requestMap.put("email", "john.doe@example.com");
		requestMap.put("password", "secretpassword");

		User user = new User();
		user.setStatus("false");

		// Act
		ResponseEntity<String> response = userService.login(requestMap);

		// Assert
		assertEquals(new ResponseEntity<String>("{\"message\":\"" + "Bad Credentials." + "\"}", HttpStatus.BAD_REQUEST),
				response);
	}

	@Test
	void testLogin_WithInvalidCredentials_ReturnsBadRequestResponse() {
		// Arrange
		Map<String, String> requestMap = new HashMap<>();
		requestMap.put("email", "john.doe@example.com");
		requestMap.put("password", "wrongpassword");

		// Act
		ResponseEntity<String> response = userService.login(requestMap);

		// Assert
		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertEquals("{\"message\":\"Bad Credentials.\"}", response.getBody());
	}

	@Test
	void testGetAllUser_WithoutAdmin_ReturnsUnauthorizedResponseWithUserList() {
		// Act
		ResponseEntity<List<UserWrapper>> response = userService.getAllUser();

		// Assert
		assertEquals(new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED), response);
	}

	@Test
	void testUpdate_WithoutAdminAndUserId_ReturnsUnauthorizedResponse() {
		// Arrange
		Map<String, String> requestMap = new HashMap<>();
		requestMap.put("id", "123");
		requestMap.put("status", "true");

		User user = new User();
		user.setEmail("john.doe@example.com");

		// Act
		ResponseEntity<String> response = userService.update(requestMap);

		// Assert
		assertEquals(CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED), response);
	}

	@Test
	void testUpdate_WithUserId_ReturnsUnautorizedResponse() {
		// Arrange
		Map<String, String> requestMap = new HashMap<>();
		requestMap.put("id", "456");
		requestMap.put("status", "true");

		// Act
		ResponseEntity<String> response = userService.update(requestMap);

		// Assert
		assertEquals(CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED), response);
	}

	@Test
	void testUpdate_WithoutAdmin_ReturnsUnauthorizedResponse() {

		// Act
		ResponseEntity<String> response = userService.update(Collections.emptyMap());

		// Assert
		assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
		assertEquals(CafeUtils.getResponeEntity(CafeConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED), response);
	}

}
