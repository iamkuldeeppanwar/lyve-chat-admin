import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../states/store";
import { getError } from "../../utils/error.js";
import { reducer } from "../../states/reducers";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Modal, Form, Spinner } from "react-bootstrap";

import axiosInstance from "../../utils/axiosUtil.js";

import { LoadingBox } from "../../components";
// import { getAllGenres } from "../../states/actions.js";

export default function EditStoriesModel(props) {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token, event } = state;
  const { id } = useParams(); // category/:id
  const [load, setLoad] = useState(false);

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const { data } = await axiosInstance("/api/genre/getAllGenre", {
  //         headers: { authorization: ` ${token}` },
  //       });
  //       if (data.success) {
  //         ctxDispatch({
  //           type: "GENRES_DATA_FETCH_SUCCESSFULLY",
  //           payload: { event: data.data, length: data.length },
  //         });
  //       }
  //     } catch (err) {
  //       toast.error(getError(err), {
  //         position: toast.POSITION.BOTTOM_CENTER,
  //       });
  //     }
  //   };
  //   fetchData();
  // }, [token]);

  const [title, setTitle] = useState("");
  const [host, setHost] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [spots, setSpots] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  // const [theme, setTheme] = useState("");
  // const [description, setDescription] = useState("");

  const time = new Date(eventTime);

  useEffect(() => {
    setTitle(event?.title ? event.title : "");
    setHost(event?.host ? event.host : "");
    setEventDate(event?.event_date ? event.event_date : "");
    setEventTime(event?.event_time ? event.event_time : "");
    setEventDuration(event?.event_duration ? event.event_duration : "");
    setEntryFee(event?.entry_fee ? event.entry_fee : "");
    setSpots(event?.spots ? event.spots : "");
    setStatus(event?.status ? event.status : "");
    setImage(event.thumbnail ? event.thumbnail : "");
    // setTheme(story?.theme ? story.theme : "");
    // setDescription(story?.description ? story.description : "");
  }, [event]);

  const resetForm = () => {
    setTitle("");
    setHost("");
    setEventDate("");
    setEventTime(null);
    setEventDuration(null);
    setEntryFee("");
    setSpots("");
    setStatus("");
    // setTheme("");
    // setDescription("");
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
    if (
      !title &&
      !status &&
      !host &&
      !eventDate &&
      !eventDuration &&
      !eventTime &&
      !spots &&
      !entryFee &&
      !image
    ) {
      toast.warning("Please fill atleast one fieled");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("status", status);
    formData.append("host", host);
    formData.append("event_date", eventDate);
    formData.append("event_duration", eventDuration);
    formData.append("event_time", eventTime);
    formData.append("spots", spots);
    formData.append("thumbnail", image);

    try {
      //   dispatch({ type: "UPDATE_REQUEST" });
      setLoad(true);
      const { data } = await axiosInstance.put(
        `/api/admin/update/${id}`,
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
        toast.success("Event Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/events");
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
        <Modal.Title id="contained-modal-title-vcenter">Edit Event</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Event Host</Form.Label>
              <Form.Control
                value={host}
                onChange={(e) => setHost(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Event Date</Form.Label>
              <Form.Control
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Event Duration</Form.Label>
              <Form.Control
                type="time"
                value={eventDuration}
                onChange={(e) => setEventDuration(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Event Thumbnail</Form.Label>
              <Form.Control onChange={(e) => fileHandler(e)} type="file" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Event Time</Form.Label>
              <Form.Control
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Entry Fees</Form.Label>
              <Form.Control
                type="number"
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Spots</Form.Label>
              <Form.Control
                type="number"
                value={spots}
                onChange={(e) => setSpots(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option value={"Live"}>Live</option>
                <option value={"Upcoming"}>Upcoming</option>
                <option value={"Completed"}>Completed</option>
              </Form.Select>
            </Form.Group>
            {/* <Form.Group className="mb-3">
              <Form.Label>Theme</Form.Label>
              <Form.Select
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value);
                }}
                aria-label="Default select example"
              >
                {genres.map((data, index) => {
                  return <option key={index} value={data.genre}>{data.genre}</option>;
                })}
              </Form.Select>
            </Form.Group> */}
            {/* <Form.Group className="mb-3" controlId="name">
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group> */}
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
