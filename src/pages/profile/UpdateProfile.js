import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
import { getError } from "../../utils/error";
import { reducer } from "../../states/reducers";
import axiosInstance from "../../utils/axiosUtil";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, Spinner } from "react-bootstrap";
// import { useNavigate, useParams } from "react-router-dom";

export default function UpdateProfileModel(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token, userInfo } = state;
  // const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [image, setImage] = useState("");
  const [dob, setDob] = useState("");
  const [mobile_no, setMobileNo] = useState("");

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  // console.log(userInfo.gender);

  useEffect(() => {
    if (userInfo.username) {
      setUsername(userInfo.username);
      setCountry(userInfo.country);
      setGender(userInfo.gender);
      setDob(userInfo.dob !== null ? userInfo.dob : "");
      setMobileNo(userInfo.mobile_no);
    }
  }, [userInfo]);

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage(file);
        // console.log(image);
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       dispatch({ type: "FETCH_REQUEST" });

  //       const { data } = await axiosInstance.get("/api/user/user-profile", {
  //         headers: { authorization: `Bearer ${token}` },
  //       });

  //       const user = data.user;

  //       setFirstname(user.firstname);
  //       setLastname(user.lastname);
  //       // setFax(user.fax);
  //       setMobileNo(user.mobile_no);

  //       dispatch({ type: "FETCH_SUCCESS" });
  //     } catch (err) {
  //       dispatch({
  //         type: "FETCH_FAIL",
  //         payload: getError(err),
  //       });
  //       toast.error(getError(error), {
  //         position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //     }
  //   };
  //   if(token)
  //   fetchData();
  // }, [token, props.show]);

  const resetForm = () => {
    setUsername("");
    setMobileNo("");
    setCountry("");
    setGender("");
    setDob("");
    // setFax("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log("ok");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("country", country);
    formData.append("gender", gender);
    formData.append("dob", dob);
    formData.append("mobile_no", mobile_no);
    formData.append("image", image);

    try {
      if (!username && !country && !mobile_no && !gender && !dob && !image) {
        toast.warning("Please fill atleast one field");
        return;
      }
      setLoadingUpdate(true);

      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.put(
        `/api/admin/updateAdmin`,
        formData,
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );
      // console.log(data);

      if (data.success) {
        toast.success("Admin Profile Updated Successfully.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setLoadingUpdate(false);
        ctxDispatch({ type: "PROFILE_UPDATE", payload: data.user });
        localStorage.setItem("userInfo", JSON.stringify(data.user));

        resetForm();
        setTimeout(() => {
          props.onHide();
        }, 1200);
      } else {
        console.log(data.error);
        setLoadingUpdate(false);
        dispatch({ type: "UPDATE_FAIL" });
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    } catch (err) {
      setLoadingUpdate(false);
      dispatch({ type: "UPDATE_FAIL" });
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
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Profile
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container
          // className="small-container p-3"
          // style={{ backgroundColor: "#f4f6f9" }}
          >
            {/* <img
            src={preview}
            alt={"profile_img"}
            style={{ width: "200px", height: "200px" }}
          /> */}
            <Form.Group className="mb-3" controlId="firstname">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                value={username}
                minLength={4}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="mobile_no">
              <Form.Label>Mobile</Form.Label>
              <Form.Control
                value={mobile_no}
                onChange={(e) => setMobileNo(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Avatar</Form.Label>
              <Form.Control onChange={(e) => fileHandler(e)} type="file" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="mobile_no">
              <Form.Label>Country</Form.Label>
              <Form.Control
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="mobile_no">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="mobile_no">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
            </Form.Group>
            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            {loadingUpdate ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
