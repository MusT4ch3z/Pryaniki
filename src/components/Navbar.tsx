import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";

export const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <AppBar position="static" color="default" sx={{ flexGrow: 1 }}>
      <Toolbar className="navbar">
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Pryaniki
        </Typography>
        <Button
          color="primary"
          variant="contained"
          onClick={() => handleLogout()}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};
