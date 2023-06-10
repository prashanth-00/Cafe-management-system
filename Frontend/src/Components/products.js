import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Table } from 'react-bootstrap';
import axios from 'axios';

const Product = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('http://localhost:8081/category/get', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setCategories(response.data);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (error) {
      setError('Failed to fetch categories');
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('http://localhost:8081/product/get', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setProducts(response.data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      setError('Failed to fetch products');
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setProductName('');
    setProductPrice('');
    setProductDescription('');
    setSelectedCategoryId('');
    setError('');
  };

  const handleOpenUpdateModal = (product) => {
    setProductName(product.name);
    setProductPrice(product.price);
    setProductDescription(product.description);
    setSelectedCategoryId(product.categoryId);
    setSelectedProductId(product.id);
    setShowUpdateModal(true);
    setError('');
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setProductName('');
    setProductPrice('');
    setProductDescription('');
    setSelectedCategoryId('');
    setSelectedProductId('');
    setError('');
  };

  const handleAddProduct = async () => {
    if (!productName || !productPrice || !productDescription || !selectedCategoryId) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(productName)) {
      setError('Product name should only contain letters and spaces');
      return;
    }

    if (parseFloat(productPrice) < 0) {
      setError('Price cannot be a negative value');
      return;
    }

    const requestData = {
      categoryId: selectedCategoryId,
      name: productName,
      description: productDescription,
      price: productPrice
    };

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post('http://localhost:8081/product/add', requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Product added successfully, perform any necessary actions
        fetchProducts();
        handleCloseAddModal();
      } else {
        setError('Failed to add product');
      }
    } catch (error) {
      setError('Failed to add product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!productName || !productPrice || !productDescription || !selectedCategoryId) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(productName)) {
      setError('Product name should only contain letters and spaces');
      return;
    }

    if (parseFloat(productPrice) < 0) {
      setError('Price cannot be a negative value');
      return;
    }

    const requestData = {
      categoryId: selectedCategoryId,
      name: productName,
      description: productDescription,
      price: productPrice,
      id: selectedProductId
    };

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post('http://localhost:8081/product/update', requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Product updated successfully, perform any necessary actions
        fetchProducts();
        handleCloseUpdateModal();
      } else {
        setError('Failed to update product');
      }
    } catch (error) {
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(`http://localhost:8081/product/delete/${productId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Product deleted successfully, perform any necessary actions
        fetchProducts();
      } else {
        setError('Failed to delete product');
      }
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  const handleProductStatusToggle = async (productId, status) => {
    const requestData = {
      id: productId,
      status: status ? 'true' : 'false'
    };

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post('http://localhost:8081/product/updateStatus', requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // Product status updated successfully, perform any necessary actions
        fetchProducts();
      } else {
        setError('Failed to update product status');
      }
    } catch (error) {
      setError('Failed to update product status');
    }
  };


  return (
    <div className="container">
      <h2>Product</h2>
      <Card>
        <Card.Body>
          <Card.Title>Manage Product</Card.Title>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add Product
          </Button>
        </Card.Body>
      </Card>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.categoryName}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>
                <Button variant="primary" onClick={() => handleOpenUpdateModal(product)}>
                  Update
                </Button>
                <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </Button>
                <Form.Check
                  type="switch"
                  id={`product-status-switch-${product.id}`}
                  checked={product.status === 'true'}
                  onChange={(e) => handleProductStatusToggle(product.id, e.target.checked)}
                  label="Status"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="productName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
          {error && <div className="text-danger">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Add Product
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="updateProductName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="updateProductPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="updateProductDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="updateProductCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
          {error && <div className="text-danger">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateProduct}>
            Update Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Product;