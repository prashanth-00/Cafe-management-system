import React, { useEffect, useState } from "react";
import { Card, Button, Form, Table } from "react-bootstrap";
import axios from "axios";

const ManageOrder = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  let [orderItems, setOrderItems] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [billError, setBillError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get("http://localhost:8081/category/get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setCategories(response.data);
      } else {
        setBillError("Failed to fetch categories");
      }
    } catch (error) {
      setBillError("Failed to fetch categories");
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        `http://localhost:8081/product/getByCategory/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setProducts(response.data);
      } else {
        setBillError("Failed to fetch products");
      }
    } catch (error) {
      setBillError("Failed to fetch products");
    }
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    setSelectedProduct("");
    setProductPrice(0);
    setQuantity(1);
    setTotalAmount(0);
    fetchProductsByCategory(categoryId);
  };

  const handleProductChange = (event) => {
    const productId = event.target.value;
    setSelectedProduct(productId);
    const selectedProduct = products.find(
      (product) => product.id === parseInt(productId)
    );
    if (selectedProduct) {
      setProductPrice(selectedProduct.price);
      setTotalAmount(selectedProduct.price * quantity);
    }
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    setQuantity(newQuantity);
    setTotalAmount(productPrice * newQuantity);
  };

  const handleAddToOrder = () => {
    const selectedProductName = products.find(
      (product) => product.id === parseInt(selectedProduct)
    )?.name;
    const orderItem = {
      id: selectedProduct,
      name: selectedProductName,
      category: selectedCategory,
      quantity: quantity,
      price: productPrice,
      total: totalAmount,
    };
    setOrderItems((prevItems) => [...prevItems, orderItem]);
  };

  const handleDeleteOrderItem = (itemId) => {
    setOrderItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  const handleBillSubmit = async () => {
    let totalPrice = 0;
    orderItems = orderItems.map((item) => {
      item.quantity = String(item.quantity);
      totalPrice += item.total;
      return item;
    });

    setTotalAmount(totalPrice);

    const requestData = {
      contactNumber: contactNumber,
      email: email,
      name: name,
      paymentMethod: paymentMethod,
      productDetails: JSON.stringify(orderItems),
      totalAmount: totalAmount.toString(),
    };

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        "http://localhost:8081/bill/generateReport",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const newBlob = new Blob([response.data], { type: "application/pdf" });
        const objUrl = window.URL.createObjectURL(newBlob);

        let link = document.createElement("a");
        link.href = objUrl;
        link.download = "Bill";
        link.click();

        
        setTimeout(() => {
          window.URL.revokeObjectURL(objUrl);
        }, 250);
      
      } else {
        setBillError("Failed to submit the bill");
      }
    } catch (error) {
      setBillError("Failed to submit the bill");
    }
  };

  return (
    <div>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between">
            <h5>Manage Order</h5>
            <Button onClick={handleBillSubmit}>Submit & Get Bill</Button>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Form>
            <Form.Control
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Control
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control
              type="text"
              placeholder="Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
            <Form.Control
              as="select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment Method</option>
              <option value="cash">Cash</option>
              <option value="credit card">Credit Card</option>
              <option value="debit card">Debit Card</option>
            </Form.Control>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Form>
            <Form.Control
              as="select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
            <Form.Control
              as="select"
              value={selectedProduct}
              onChange={handleProductChange}
            >
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </Form.Control>
            <Form.Control
              type="text"
              placeholder="Price"
              value={productPrice}
              disabled
            />
            <Form.Control
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
            />
            <Form.Control
              type="text"
              placeholder="Total"
              value={totalAmount}
              disabled
            />
            <Button onClick={handleAddToOrder}>Add</Button>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.total}</td>
                  <td>
                    <Button onClick={() => handleDeleteOrderItem(item.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageOrder;
