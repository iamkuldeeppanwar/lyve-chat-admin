import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  Col,
  Container,
  Row,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";
import { toast, ToastContainer } from "react-toastify";
import { Store } from "../../states/store";
import { useNavigate } from "react-router-dom";
import { getError } from "../../utils/error";
// import { Cropper } from "../../components";

export default function AddGenre() {
  const { state } = useContext(Store);
  const { token } = state;
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [load, setLoad] = useState(false);

  const resetForm = (e) => {
    setName("");
    setImage("");
    // setGenre("");
    // setStarter("");
    // setStarterArray([]);
    // setColour("");
    // setDescription("");
  };

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage(file);
        console.log(image);
      } else {
        toast.warning("Please select a valid image file.");
        e.target.value = null;
        return;
      }
    }

    if (e.target.files.length > 1) {
      toast.warning("Please select only one file.");
      e.target.value = null;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.warning("Please Add image", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("thumbnail", image);

    try {
      setLoad(true);
      const { data } = await axiosInstance.post("/api/admin/genre", formData, {
        headers: {
          authorization: `${token}`,
        },
      });
      if (data.success) {
        setLoad(false);
        toast.success("Genre Added Succesfully.  Redirecting...", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setTimeout(() => {
          navigate("/admin/genres");
        }, 1200);
      }
      resetForm();
    } catch (err) {
      setLoad(false);
      toast.error(getError(err), {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid>
        <Row
          className="mt-2 mb-3"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
        >
          <Col>
            <span style={{ fontSize: "xx-large" }}>Genre</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header as={"h6"}>Add</Card.Header>
              <Form onSubmit={submitHandler}>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Genre</Form.Label>
                    <Form.Control
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      onChange={(e) => fileHandler(e)}
                      type="file"
                    />
                    {/* <Cropper setImage={setImage} w={194} h={112} /> */}
                  </Form.Group>
                </Card.Body>
                <Card.Footer>
                  <Button variant="primary" type="submit">
                    {load ? <Spinner animation="border" size="sm" /> : "Submit"}
                  </Button>
                </Card.Footer>
                <ToastContainer />
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
}
