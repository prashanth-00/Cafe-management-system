package com.inn.cafe.JWT;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

public CorsFilter corsFilter() {
 CorsConfiguration configuration = new CorsConfiguration();
configuration.addAllowedOrigin("http://localhost:3000"); // Add your React app's origin URL
configuration.addAllowedHeader("*");
configuration.addAllowedMethod("*");

UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
source.registerCorsConfiguration("/**", configuration);
     return new CorsFilter(source);
     }

}