import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Store } from "../states/store";
import { reducer } from "../states/reducers";
import { FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTitle } from "../components";
import { toastOptions } from "../utils/error";
import { clearErrors, login } from "../states/actions";

// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import PaymentForm from "./PaymentForm";

export default function AdminLoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fireBaseToken] = "12345";

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token } = state;
  const [check, setCheck] = useState(false);

  const navigate = useNavigate();
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    await login(ctxDispatch, dispatch, {
      email: username,
      password,
      fireBaseToken,
    });
  };

  useEffect(() => {
    if (token) {
      // setTimeout(() => {
      navigate("/admin/dashboard");
      // }, 2000);
    }
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error, token, navigate]);

  useTitle("Login");

  // =============== Strip start ================

  return (
    <Container fluid className="p-0 vh-100 f-center flex-column login-page">
      <div className="login-logo">
        <Link to="/" className="text-center">
          <b>Lyve Chat</b>
        </Link>
      </div>

      <Card className="login-box">
        <Card.Body>
          <p className="text-center">Sign in to start your session</p>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="text" className="input-group mb-3">
              <Form.Control
                placeholder="Email"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <InputGroup.Text>
                <FaEnvelope />
              </InputGroup.Text>
            </Form.Group>
            <Form.Group controlId="password" className="input-group mb-3">
              <Form.Control
                placeholder="Password"
                type={check ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputGroup.Text onClick={() => setCheck((p) => !p)}>
                {!check ? (
                  <FaEye style={{ cursor: "pointer" }} />
                ) : (
                  <FaEyeSlash style={{ cursor: "pointer" }} />
                )}
              </InputGroup.Text>
            </Form.Group>
            {/* <Row>
            <Col sm={7} className="mb-sm-0 mb-3">
                <Form.Group controlId="remember">
                  <Form.Check
                    type="checkbox"
                    id="default-checkbox"
                    label="Remember Me"
                  />
                </Form.Group>
              </Col>
              <Col sm={5}>
                {loading ? (
                  <Button disabled className="float-sm-end">
                    <Spinner animation="border" size="sm" />
                  </Button>
                ) : (
                  <Button type="submit" className="float-sm-end">
                    Sign In
                  </Button>
                )}
              </Col>
            </Row> */}
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2">
                <input type="checkbox" />
                <label>Remember Me</label>
              </div>
              <div>
                {loading ? (
                  <Button disabled className="float-sm-end">
                    <Spinner animation="border" size="sm" />
                  </Button>
                ) : (
                  <Button type="submit" className="float-sm-end">
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </Form>
          <ToastContainer />

          {/* Socket Check */}
          {/* <Form>
          <Form.Group controlId="text" className="input-group mb-3">
              <Form.Control
                placeholder="Email"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <InputGroup.Text>
                <FaEnvelope />
              </InputGroup.Text>
            </Form.Group>
          </Form> */}
          <div className="mt-4 d-flex gap-2 justify-content-center">
            <Link
              className="text-decoration-underline"
              to="/admin/terms-and-condition"
            >
              Terms of Use
            </Link>
            <Link
              className="text-decoration-underline"
              to="/admin/privacy-policy"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-decoration-underline"
              to="/admin/delete-account"
            >
              Delete Account
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
    // <Container fluid>
    //   <Elements stripe={stripePromise}>
    //     <PaymentForm />
    //   </Elements>
    // </Container>
  );
}
