package com.inn.cafe.service;

import com.inn.cafe.POJO.Bill;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface BillService {
  ResponseEntity<byte[]> generateReport(Map<String, Object> requestMap);

  ResponseEntity<List<Bill>> getBills();

  ResponseEntity<byte[]> getPdf(Map<String, Object> requestMap);

  ResponseEntity<String> delete(Integer id);
}
