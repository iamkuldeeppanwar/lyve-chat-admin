import React, { useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
// import { getError } from "../../utils/error";
import { reducer } from "../../states/reducers";
// import { ToastContainer, toast } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import { LoadingBox } from "../../components";
import { MessageBox } from "../../components";
import UpdateProfileModel from "./UpdateProfile";
// import axiosInstance from "../../utils/axiosUtil";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

const ViewProfile = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error }] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       dispatch({ type: "FETCH_REQUEST" });

  //       const { data } = await axiosInstance.get(`/api/user/user-profile`, {
  //         headers: { Authorization: token },
  //       });
  //       // console.log(data);

  //       dispatch({ type: "FETCH_SUCCESS", payload: data });
  //     } catch (err) {
  //       dispatch({
  //         type: "FETCH_FAIL",
  //         payload: getError(err),
  //       });
  //       toast.error(getError(err), {
  //         position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //     }
  //   };
  //   fetchData();
  // }, [token]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };

  // console.log(userInfo);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Card>
              <Card.Header>
                <Card.Title>
                  {loading ? <Skeleton /> : `Admin Profile`}
                </Card.Title>
                <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    onClick={() => setModalShow(true)}
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    {loading ? (
                      <Skeleton height={200} />
                    ) : (
                      <img
                        style={{
                          borderRadius: "5px",
                        }}
                        src={userInfo.avatar}
                        alt=""
                        className="img-fluid"
                        width={"200px"}
                        height={"200px"}
                      />
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>User Name</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : userInfo.username}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Email</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : userInfo.email}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Mobile</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : userInfo.mobile_no}</p>
                  </Col>
                  {/* <Col md={4}>
                  <p className="mb-0">
                    <strong>Fax</strong>
                  </p>
                  <p>{user.fax}</p>
                  </Col> */}
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Role</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : userInfo.role}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Gender</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : userInfo.gender}</p>
                  </Col>
                  {userInfo.dob !== null && (
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Date of Birth</strong>
                      </p>
                      <p>
                        {loading ? <Skeleton /> : userInfo.dob.split("T")[0]}
                      </p>
                    </Col>
                  )}

                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Country</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : userInfo.country}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(userInfo.createdAt)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(userInfo.updatedAt)}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <UpdateProfileModel
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
            {/* <ToastContainer /> */}
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewProfile;
