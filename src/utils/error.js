export const getError = (error) => {
  // console.log({ error });
  if (error.response) {
    // console.log("errrr");
    if (error.response.data.error.message)
      return error.response.data.error.message;
    return error.response;
  }
  return error.message;
};

export const toastOptions = {
  position: "bottom-center",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};
