import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
// import { getError } from "../../utils/error.js";
import { reducer } from "../../states/reducers";
import { useLocation, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
// import EditStoriesModel from "./EditStoriesModel.js";
// import axiosInstance from "../../utils/axiosUtil.js";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { MessageBox } from "../../components";
import { getSingleTransaction } from "../../states/actions.js";

const ViewTransaction = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token, transaction } = state;
  const { id } = useParams();

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    getSingleTransaction(ctxDispatch, dispatch, token, id);
  }, [id, dispatch]);

  // console.log(transaction);

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
                <Card.Title>Transaction Details</Card.Title>

                {/* <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    onClick={() => setModalShow(true)}
                  />
                </div> */}
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={12}>
                    <Row>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Transaction ID</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : transaction.transaction_id}
                        </p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Customer ID</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : transaction.customer_id}
                        </p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Amount</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : transaction.payment_amount}
                        </p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Payment Gateway</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : transaction.payment_gateway}
                        </p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Payment Status</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : transaction.payment_status}
                        </p>
                      </Col>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Created At</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            getDateTime(transaction.createdAt)
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
                            getDateTime(transaction.updatedAt)
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <hr />
                <Row>
                  <Col md={12}>
                    <Col>
                      <strong>Event Details</strong>
                      <hr />
                    </Col>
                    <Col md={4}>
                      {loading ? (
                        <Skeleton height={200} />
                      ) : (
                        <img
                          style={{
                            borderRadius: "5px",
                          }}
                          src={transaction.event.thumbnail}
                          alt=""
                          className="img-fluid"
                          width={"200px"}
                          height={"200px"}
                        />
                      )}
                    </Col>
                    <Row>
                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Event Name</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : transaction.event.title}
                        </p>
                      </Col>

                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Event Creator</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : transaction.user.username}
                        </p>
                      </Col>

                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Event Status</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : transaction.event.status}
                        </p>
                      </Col>

                      <Col md={3}>
                        <p className="mb-0">
                          <strong>Event Date</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            transaction.event &&
                            transaction.event.event_date.split("T")[0]
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {/* <EditStoriesModel
              show={modalShow}
              onHide={() => setModalShow(false)}
            /> */}

            {!modalShow && <ToastContainer />}
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewTransaction;
