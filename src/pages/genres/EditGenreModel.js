import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
import { getError } from "../../utils/error.js";
import { reducer } from "../../states/reducers";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Modal, Form, Spinner } from "react-bootstrap";

import axiosInstance from "../../utils/axiosUtil.js";

import { LoadingBox } from "../../components";

export default function EditGenresModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, genre } = state;
  const { id } = useParams(); // category/:id
  const [load, setLoad] = useState(false);

  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  // const [colour, setColour] = useState("");
  // const [starters, setStarters] = useState([]);
  // const [backgroundColour, setBackgroundColour] = useState("");

  useEffect(() => {
    if (genre.name && genre.name) {
      setName(genre?.name ? genre.name : "");
      setImage(genre.thumbnail ? genre.thumbnail : "");
      // setStarters([...genre.starter]);
      // setColour(genre?.colour ? genre.colour : "");
      // setBackgroundColour(
      //   genre?.backgroundColour ? genre.backgroundColour : ""
      // );
    }
  }, [genre]);

  const resetForm = () => {
    setName("");
    setImage("");
    // setStarters([]);
    // setColour("");
    // setBackgroundColour("");
  };

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
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

  useEffect(() => {}, [id, props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!genre) {
      toast.warning("Please fill atleast one fieled");
      return;
    }
    try {
      // console.log(starters);
      //   dispatch({ type: "UPDATE_REQUEST" });
      setLoad(true);
      const formData = new FormData();
      formData.append("name", name);
      // formData.append("starter", JSON.stringify(starters));
      // formData.append("starter", JSON.stringify(starterArray));
      // formData.append("colour", colour);
      // formData.append("backgroundColour", backgroundColour);
      formData.append("thumbnail", image);
      const { data } = await axiosInstance.put(
        `/api/admin/genre/${id}`,
        formData,
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );
      // console.log(data);
      if (data.success) {
        toast.success("Genre Updated Succesfully.", {
          position: toast.POSITION.TOP_RIGHT,
        });
        resetForm();
        setLoad(false);
        setTimeout(() => {
          navigate("/admin/genres");
          //   dispatch({ type: "UPDATE_SUCCESS" });
        }, 1200);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (err) {
      setLoad(false);
      //   dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err), {
        position: toast.POSITION.TOP_RIGHT,
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
        <Modal.Title id="contained-modal-title-vcenter">Edit Genre</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Genre Description</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="name">
              <Form.Label>Colour</Form.Label>
              <Form.Control
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                type="color"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Background Colour</Form.Label>
              <Form.Control
                value={backgroundColour}
                onChange={(e) => setBackgroundColour(e.target.value)}
                // required
                type="color"
              />
            </Form.Group> */}
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Image</Form.Label>
              <Form.Control onChange={(e) => fileHandler(e)} type="file" />
              {/* <Cropper setImage={setImage} w={194} h={112} /> */}
            </Form.Group>

            {/* {starters.map((starter, index) => {
              return (
                <>
                  <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Starter {index + 1}</Form.Label>
                    <Form.Control
                      value={starter.starter}
                      maxLength={50}
                      onChange={(e) => {
                        const updatedArray = starters.map((data, i) => {
                          let obj = { ...data };
                          if (i == index) {
                            obj.starter = e.target.value;
                          }
                          return obj;
                        });
                        setStarters(updatedArray);
                      }}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={starter.description}
                      onChange={(e) => {
                        const updatedArray = starters.map((data, i) => {
                          let obj = { ...data };
                          if (i == index) {
                            obj.description = e.target.value;
                          }
                          return obj;
                        });
                        setStarters(updatedArray);
                      }}
                      required
                      maxLength={250}
                    />
                  </Form.Group>
                </>
              );
            })} */}

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
