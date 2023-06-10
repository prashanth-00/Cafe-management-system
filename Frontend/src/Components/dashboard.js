import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const NavBtn = ({ to, text }) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="primary"
      onClick={() => {
        navigate(`${to}`);
      }}
    >
      {text}
    </Button>
  );
};

const Dashboard = () => {
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) return;
    setIsAdmin(role === "admin");
  }, [pathname]);

  useEffect(() => {
    // Fetch the total category, product, and bill counts from the backend
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      if (!jwtToken) {
        console.error("JWT token not found in local storage");
        return;
      }

      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      const response = await axios.get(
        "http://localhost:8081/dashboard/details",
        { headers }
      );

      if (response.status === 200) {
        const data = response.data;
        setTotalCategories(data.category || 0);
        setTotalProducts(data.product || 0);
        setTotalBills(data.bill || 0);
      } else {
        console.error("Failed to fetch counts:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch counts:", error);
    }
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <Row>
        <>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Total Categories</Card.Title>
                <h3>{totalCategories}</h3>
                <NavBtn to="/categories" text="View Categories" />
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Total Products</Card.Title>
                <h3>{totalProducts}</h3>
                <NavBtn to="/products" text="View Products" />
              </Card.Body>
            </Card>
          </Col>
        </>
        <Col md={4}>
          {/* <Card>
            <Card.Body>
              <Card.Title>Total Orders</Card.Title>
              <h3>{totalBills}</h3>
              <NavBtn to="/orders" text="View Orders" />
            </Card.Body>
          </Card> */}
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
