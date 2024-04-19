import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
import { getError } from "../../utils/error.js";
import { reducer } from "../../states/reducers";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Modal, Form, Spinner } from "react-bootstrap";

import axiosInstance from "../../utils/axiosUtil.js";

import { LoadingBox } from "../../components";

export default function EditUserModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, user } = state;
  const { id } = useParams(); // category/:id
  const [load, setLoad] = useState(false);

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState("");

  // console.log(user);

  useEffect(() => {
    setUsername(user?.username ? user.username : "");
    setGender(user?.gender ? user.gender : "");
    setMobile(user?.mobile_no ? user.mobile_no : "");
  }, [user]);

  const resetForm = () => {
    setMobile("");
    setUsername("");
    setGender("");
  };

  const changeHandler = (e) => {
    const value = e.target.value;
    const isValid = /^[0-9]*$/.test(value);
    if (isValid && value.length < 11) {
      setMobile(value);
    }
  };

  useEffect(() => {}, [id, props.show]);

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      // console.log(file.type);
      if (file.type.startsWith("image/")) {
        setImage(file);
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
    if (!username && !mobile && !gender) {
      toast.warning("Please fill atleast one fieled");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("mobile_no", mobile);
    formData.append("gender", gender);
    formData.append("image", image);

    try {
      //   dispatch({ type: "UPDATE_REQUEST" });
      setLoad(true);
      const { data } = await axiosInstance.put(
        `/api/admin/users/${id}`,
        formData,
        {
          headers: {
            authorization: ` ${token}`,
          },
        }
      );
      // console.log(data);
      if (data.success) {
        setLoad(false);
        toast.success("User Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/users");
          //   dispatch({ type: "UPDATE_SUCCESS" });
        }, 1200);
      } else {
        setLoad(false);
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (err) {
      //   dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Edit User</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                value={username}
                minLength={4}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Event Thumbnail</Form.Label>
              <Form.Control onChange={(e) => fileHandler(e)} type="file" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Mobile no</Form.Label>
              <Form.Control value={mobile} onChange={changeHandler} />
            </Form.Group>
            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            {load ? <Spinner animation="border" size="sm" /> : "Submit"}
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
