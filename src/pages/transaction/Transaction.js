import React, { useContext, useEffect, useReducer, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import { getAllTransactions } from "../../states/actions";
import { reducer } from "../../states/reducers";
// import { ColorRing } from "react-loader-spinner";
import { Store } from "../../states/store";
import { CustomPagination, CustomSkeleton, MessageBox } from "../../components";
import { FaEye, FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { getError } from "../../utils/error";
import axiosInstance from "../../utils/axiosUtil";
// import { io } from "socket.io-client";

export default function Transaction() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const { transactions, token, transactionLength } = state;
  const [status, setStatus] = useState("");
  const [curPage, setCurPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [resultPerPage, setResultPerPage] = useState(5);
  const curPageHandler = (p) => setCurPage(p);
  const filteredCategoryCount = transactionLength;
  const numOfPages = Math.ceil(filteredCategoryCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  const [del, setDel] = useState(false);
  // console.log("testing", stories);
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  // console.log(transactions);

  useEffect(() => {
    getAllTransactions(
      ctxDispatch,
      dispatch,
      token,
      resultPerPage,
      curPage,
      searchInput,
      status
    );
  }, [curPage, resultPerPage, token, del, query, status]);

  const deleteTransaction = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this transaction?") ===
      true
    ) {
      try {
        setDel(true);
        await axiosInstance.delete(`/api/admin/delete-transaction/${id}`, {
          headers: { authorization: `${token}` },
        });
        setDel(false);
        toast.success("Transaction deleted Successsfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        toast.error(getError(error), {
          position: toast.POSITION.TOP_RIGHT,
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

              <div className="float-end ">
                <Form.Select
                  aria-label="Default select example"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="succeeded">Succeeded</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Chancelled</option>
                </Form.Select>
              </div>

              <div
                style={{
                  marginRight: "5px",
                }}
                className="search-box float-end "
              >
                <InputGroup>
                  <Form.Control
                    aria-label="Search Input"
                    placeholder="Search by Transaction id"
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
                // style={
                //   eventsLength > 1
                //     ? { height: "500px", overflowY: "scroll" }
                //     : { height: "200px", overflowY: "scroll" }
                // }
                style={{ height: "200px", overflowY: "scroll" }}
                responsive
                striped
                bordered
                hover
              >
                <thead>
                  <tr>
                    <th>S.no</th>
                    <th>Transaction ID</th>
                    <th>Customer ID</th>
                    <th>Amount</th>
                    <th>Payment Status</th>
                    <th>Payment Gateway</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={5} column={8} />
                  ) : (
                    transactions.length > 0 &&
                    transactions.map((trans, i) => (
                      <tr key={i} className="odd">
                        <td className="text-center">{skip + i + 1}</td>
                        <td>{trans.transaction_id}</td>
                        <td>{trans.customer_id}</td>
                        <td>{trans.payment_amount}</td>
                        <td>{trans.payment_status}</td>
                        <td>{trans.payment_gateway}</td>

                        <td>
                          <Button
                            onClick={() => {
                              navigate(`/admin/view/transaction/${trans.id}`);
                            }}
                            type="success"
                            className="btn btn-primary"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            onClick={() => {
                              deleteTransaction(trans.id);
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
}
