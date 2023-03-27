import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useLogInMutation } from "../../services/fetchAPI.api";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Alert, Slide, SlideProps, Snackbar } from "@mui/material";
import { useState } from "react";

const theme = createTheme();

export const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction="up" />;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logIn] = useLogInMutation();
  const [error, setError] = useState<string>("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const fromPage = location.state?.from?.pathname || "/";

  console.log(error);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await logIn({
      user: data.get("user"),
      password: data.get("password"),
    })
      .unwrap()
      .then((res) => {
        if (res.error_code) {
          setError(res.error_text);
          setIsErrorOpen(true);
        } else {
          localStorage.setItem("authToken", res.data.token);
          navigate(fromPage);
        }
      });
  };

  const handleCloseError = () => {
    setIsErrorOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Snackbar
          open={isErrorOpen}
          autoHideDuration={6000}
          onClose={handleCloseError}
          TransitionComponent={SlideTransition}
        >
          <Alert
            onClose={handleCloseError}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="user"
              label="User"
              name="user"
              autoComplete="user"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
