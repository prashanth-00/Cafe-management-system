package com.inn.cafe.rest;

import com.inn.cafe.POJO.Bill;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.core.io.ByteArrayResource;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/bill")
public interface BillRest {
  @PostMapping(path = "/generateReport")
  public ResponseEntity<byte[]> generateReport(@RequestBody Map<String, Object> requestMap);

  @GetMapping(path = "/getBills")
  public ResponseEntity<List<Bill>> getBills();

  @PostMapping(path = "/getPdf")
  public ResponseEntity<byte[]> getPdf(@RequestBody Map<String, Object> requestMap);

  @PostMapping(path = "/delete/{id}")
  public ResponseEntity<String> deleteBill(@PathVariable Integer id);

}
