import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
// import { getError } from "../../utils/error.js";
import { reducer } from "../../states/reducers";
import { useLocation, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import EditStoriesModel from "./EditStoriesModel.js";
// import axiosInstance from "../../utils/axiosUtil.js";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { MessageBox } from "../../components";

import { getSingleEvent, getStreamedDetails } from "../../states/actions.js";

const ViewStories = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token, event, streamDetails } = state;
  const { id } = useParams(); // category/:id

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statuses = queryParams.get("status");
  // const navigate = useNavigate();
  // console.log("in this room")
  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  console.log(streamDetails);

  useEffect(() => {
    getSingleEvent(ctxDispatch, dispatch, token, id);
    if (statuses === "Completed") {
      getStreamedDetails(ctxDispatch, dispatch, token, id);
    }
  }, [statuses, id]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Card>
              <Card.Header>
                <Card.Title>
                  {loading ? <Skeleton /> : event.title} Details
                </Card.Title>

                <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    onClick={() => setModalShow(true)}
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={4}>
                    {loading ? (
                      <Skeleton height={200} />
                    ) : (
                      <img
                        style={{
                          borderRadius: "5px",
                        }}
                        src={event.thumbnail}
                        alt=""
                        className="img-fluid"
                        width={"200px"}
                        height={"200px"}
                      />
                    )}
                  </Col>
                  <Col md={12}>
                    <Row>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Event Name</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : event.title}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Status</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : event.status}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Host</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : event.host}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Spots</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : event.spots}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Entry Fees</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : event.entry_fee}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Event Date</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            event.event_date && event.event_date.split("T")[0]
                          )}
                        </p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Event Duration</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : event.event_duration}</p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Event Time</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : event.event_time}</p>
                      </Col>

                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Created At</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            getDateTime(event.createdAt)
                          )}
                        </p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Last Update</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            getDateTime(event.updatedAt)
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {statuses === "Completed" && (
                  <Row className="mb-3">
                    <Col>
                      <strong>Stream Details</strong>
                      <hr />
                    </Col>
                    <Col md={12}>
                      <Row>
                        <Col md={3}>
                          <p className="mb-0">
                            <strong>Total Guest</strong>
                          </p>
                          <p>
                            {loading ? <Skeleton /> : streamDetails.totalGuest}
                          </p>
                        </Col>
                        <Col md={3}>
                          <p className="mb-0">
                            <strong>Event Likes</strong>
                          </p>
                          <p>{loading ? <Skeleton /> : streamDetails.likes}</p>
                        </Col>
                        <Col md={3}>
                          <p className="mb-0">
                            <strong>Event Disliked</strong>
                          </p>
                          <p>
                            {loading ? <Skeleton /> : streamDetails.dislikes}
                          </p>
                        </Col>
                        <Col md={3}>
                          <p className="mb-0">
                            <strong>Event Comment</strong>
                          </p>
                          <p>
                            {loading ? <Skeleton /> : streamDetails.comments}
                          </p>
                        </Col>

                        <Col md={3}>
                          <p className="mb-0">
                            <strong>Pay Status</strong>
                          </p>
                          <p>
                            {loading ? <Skeleton /> : streamDetails.payStatus}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
            <EditStoriesModel
              show={modalShow}
              onHide={() => setModalShow(false)}
            />

            {!modalShow && <ToastContainer />}
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewStories;
