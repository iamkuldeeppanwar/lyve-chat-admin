import React, { useContext, useReducer, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";

import { reducer } from "../../states/reducers";
// import { ColorRing } from "react-loader-spinner";
// import { Store } from "../../states/store";
import { CustomPagination, CustomSkeleton, MessageBox } from "../../components";
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getError } from "../../utils/error";
import axiosInstance from "../../utils/axiosUtil";

const Transaction = () => {
  const { state } = useContext();
  // const navigate = useNavigate();
  const { eventsLength } = state;
  // const [status, setStatus] = useState("");
  const [curPage, setCurPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [setQuery] = useState("");
  const [resultPerPage, setResultPerPage] = useState(5);
  const curPageHandler = (p) => setCurPage(p);
  const filteredCategoryCount = eventsLength;
  const numOfPages = Math.ceil(filteredCategoryCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  const [setDel] = useState(false);
  // console.log("testing", stories);
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  // console.log(eventsLength);

  const transaction = [
    {
      eventName: "Art Event",
      paymentAmount: "3000",
      paymentStatus: "paid",
      paymentType: "Card",
      userName: "Alex",
    },
    {
      eventName: "Chrismat Event",
      paymentAmount: "500",
      paymentStatus: "unpaid",
      paymentType: "Card",
      userName: "Alex",
    },
    {
      eventName: "Music Event",
      paymentAmount: "200",
      paymentStatus: "unpaid",
      paymentType: "Card",
      userName: "Alex",
    },
    {
      eventName: " Event",
      paymentAmount: "5000",
      paymentStatus: "paid",
      paymentType: "Card",
      userName: "Alex",
    },
    {
      eventName: "Art Event",
      paymentAmount: "3000",
      paymentStatus: "paid",
      paymentType: "Card",
      userName: "Alex",
    },
  ];

  // useEffect(() => {
  //   getAllEvents(
  //     ctxDispatch,
  //     dispatch,
  //     token,
  //     resultPerPage,
  //     curPage,
  //     searchInput,
  //     status
  //   );
  // }, [curPage, resultPerPage, token, del, query, status]);

  const deleteStory = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this story room?") ===
      true
    ) {
      try {
        setDel(true);
        await axiosInstance.delete(`/api/admin/deleteStory/${id}`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setDel(false);
        toast.success("Story Deleted Successsfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } catch (error) {
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Card>
            <Card.Header>
              <div style={{ fontWeight: "500" }} className="btn mt-1">
                Transactions
              </div>

              {/* <div className="float-end ">
            <Form.Select
              aria-label="Default select example"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </div> */}

              <div
                style={{
                  marginRight: "5px",
                }}
                className="search-box float-end "
              >
                <InputGroup>
                  <Form.Control
                    aria-label="Search Input"
                    placeholder="Search by Event Name"
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setQuery(searchInput);
                      setCurPage(1);
                    }}
                  >
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </Card.Header>
            <Card.Body>
              <Table
                style={{ height: "500px", overflowY: "scroll" }}
                responsive
                striped
                bordered
                hover
              >
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Event Name</th>
                    <th>Payment Status</th>
                    <th>Payment Amount</th>
                    <th>Payment Type</th>
                    <th>User</th>
                    {/* <th>Host</th>
                <th>Status</th> */}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={5} column={8} />
                  ) : (
                    transaction.length > 0 &&
                    transaction.map((event, i) => (
                      <tr key={i} className="odd">
                        <td className="text-center">{skip + i + 1}</td>
                        <td>{event.eventName}</td>
                        {/* <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <img
                        style={{
                          width: "200px",
                          height: "100px",
                          borderRadius: "5px",
                        }}
                        src={event.thumbnail}
                        alt="..."
                      />
                    </td> */}
                        <td>{event.paymentStatus}</td>
                        <td>{event.paymentAmount}</td>
                        <td>{event.paymentType}</td>
                        {/* <td>{event.host}</td> */}
                        <td>{event.userName}</td>
                        <td>
                          {/* <Button
                            onClick={() => {
                              navigate(
                                `/admin/view/story/${event.id}?status=${event.status}`
                              );
                            }}
                            type="success"
                            className="btn btn-primary"
                          >
                            <FaEye />
                          </Button> */}
                          <Button
                            onClick={() => {
                              deleteStory(event.id);
                            }}
                            type="danger"
                            className="btn btn-danger ms-2"
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer>
              <div className="float-start d-flex align-items-center mt-3">
                <p className="p-bold m-0 me-3">Row No.</p>
                <Form.Group controlId="resultPerPage">
                  <Form.Select
                    value={resultPerPage}
                    onChange={(e) => {
                      setResultPerPage(e.target.value);
                      setCurPage(1);
                    }}
                    aria-label="Default select example"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </Form.Select>
                </Form.Group>
              </div>
              {resultPerPage < filteredCategoryCount && (
                <CustomPagination
                  pages={numOfPages}
                  pageHandler={curPageHandler}
                  curPage={curPage}
                />
              )}
            </Card.Footer>
          </Card>
        )}
        <ToastContainer />
      </Container>
    </motion.div>
  );
};

export default Transaction;
