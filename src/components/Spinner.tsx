import { CircularProgress } from "@mui/material";

const Spinner = () => {
  return (
    <CircularProgress
      size={60}
      sx={{ position: "absolute", top: "50%", left: "50%" }}
    />
  );
};

export default Spinner;
