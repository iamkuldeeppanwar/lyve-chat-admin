import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";
import { ToastContainer, toast } from "react-toastify";
import { getError } from "../../utils/error";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // console.log(email, password);
  const deleteAccount = async (e) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to Delete your Account?")) {
      return;
    }
    try {
      const { data } = await axiosInstance.post("/api/admin/delete", {
        email,
        password,
      });
      // console.log(data);
      if (data.success) {
        window.alert("Your Account Deleted Successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(getError(error), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <Container className="mt-4">
      <h2>Delete Account</h2>
      <p>Please enter your email and password to confirm account deletion:</p>
      <Form onSubmit={deleteAccount}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            autoComplete="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
        </Form.Group>

        <Button className="mt-4" variant="danger" type="submit">
          Delete Account
        </Button>
      </Form>
      <ToastContainer />
    </Container>
  );
}
