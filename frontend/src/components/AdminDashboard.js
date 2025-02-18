import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", location: { lat: 0, long: 0 } });

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch all employees from backend
  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("location")) {
      setForm({ ...form, location: { ...form.location, [name.split(".")[1]]: Number(value) } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle form submission (Add or Update)
  const handleSubmit = async () => {
    try {
      if (selectedEmployee) {
        await axios.put(`http://localhost:5000/api/employees/${selectedEmployee._id}`, form);
      } else {
        await axios.post("http://localhost:5000/api/employees", form);
      }
      setShow(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee", error);
    }
  };

  // Open modal for editing
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setForm({ ...employee });
    setShow(true);
  };

  // Delete employee
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Panel - Employee Management</h2>
      <Button
        onClick={() => {
          setSelectedEmployee(null);
          setForm({ name: "", email: "", location: { lat: 0, long: 0 } });
          setShow(true);
        }}
      >
        Add Employee
      </Button>

      {/* Employee Table */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.location?.lat}</td>
              <td>{emp.location?.long}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(emp)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(emp._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Employee Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEmployee ? "Edit Employee" : "Add Employee"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={form.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={form.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Latitude</Form.Label>
              <Form.Control type="number" name="location.lat" value={form.location.lat} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Longitude</Form.Label>
              <Form.Control type="number" name="location.long" value={form.location.long} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
