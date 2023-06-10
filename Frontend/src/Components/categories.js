import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Table } from 'react-bootstrap';
import axios from 'axios';

const Category = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        console.error('JWT token not found in local storage');
        return;
      }

      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      const response = await axios.get('http://localhost:8081/category/get', { headers });

      if (response.status === 200) {
        setCategories(response.data);
      } else {
        console.error('Failed to fetch categories:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName) {
      setError('Please enter a category name');
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(categoryName)) {
      setError('Category name should only contain letters and spaces');
      return;
    }

    try {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        console.error('JWT token not found in local storage');
        return;
      }

      const requestData = {
        name: categoryName,
      };

      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      const response = await axios.post('http://localhost:8081/category/add', requestData, { headers });

      if (response.status === 200) {
        // Category added successfully, perform any necessary actions
        fetchCategories();
        handleCloseAddModal();
      } else {
        console.error('Failed to add category:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleEditCategory = async () => {
    if (!editCategoryName) {
      setError('Please enter a category name');
      return;
    }

    try {
      const jwtToken = localStorage.getItem('jwtToken');
      if (!jwtToken) {
        console.error('JWT token not found in local storage');
        return;
      }

      const requestData = {
        id: editCategoryId,
        name: editCategoryName,
      };

      const headers = {
        Authorization: `Bearer ${jwtToken}`,
      };

      const response = await axios.post('http://localhost:8081/category/update', requestData, { headers });

      if (response.status === 200) {
        // Category updated successfully, perform any necessary actions
        fetchCategories();
        handleCloseEditModal();
      } else {
        console.error('Failed to update category:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setCategoryName('');
    setError('');
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditCategoryName('');
    setError('');
  };

  const handleEditButtonClick = (categoryId) => {
    const category = categories.find((category) => category.id === categoryId);
    if (category) {
      setEditCategoryId(category.id);
      setEditCategoryName(category.name);
      setShowEditModal(true);
    }
  };

  const handleFilterChange = (e) => {
    setFilterName(e.target.value);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Category</h2>

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between">
            <h4>Manage Category</h4>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              Add Category
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <h5>Filter by Name:</h5>
          <Form.Group>
            <Form.Control type="text" value={filterName} onChange={handleFilterChange} />
          </Form.Group>
        </Card.Body>
      </Card>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditButtonClick(category.id)}>
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Category Name:</Form.Label>
              <Form.Control type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            </Form.Group>
            {error && <div className="text-danger">{error}</div>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Category Name:</Form.Label>
              <Form.Control
                type="text"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
              />
            </Form.Group>
            {error && <div className="text-danger">{error}</div>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditCategory}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Category;
