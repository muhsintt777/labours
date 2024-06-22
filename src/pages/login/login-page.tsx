import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { login as firebaseLogin } from "../../configs/firebase";
import { login } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";
import { REGEX } from "utils/constants";

const defaultTheme = createTheme();

export const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarDetails, setSnackBarDetails] = useState({
    open: false,
    message: "",
  });
  // const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!REGEX.EMAIL.test(email)) {
      setSnackBarDetails({ open: true, message: "Please enter a valid email" });
      return;
    } else if (password.length < 6) {
      setSnackBarDetails({
        open: true,
        message: "Password must be a minimum of 8 characters.",
      });
      return;
    }

    // setLoading(true);
    try {
      const user = await firebaseLogin(email, password);
      login(user);
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errCode = error?.code;
      console.log(errCode, "err");

      if (errCode === "auth/invalid-credential") {
        setSnackBarDetails({ open: true, message: "Invalid password" });
      } else {
        setSnackBarDetails({
          open: true,
          message: "Something went wrong, please try again later",
        });
      }
    }
    // setLoading(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <div
                  onClick={() => navigate("/auth/register")}
                  style={{ cursor: "pointer" }}
                >
                  {"Don't have an account? Sign Up"}
                </div>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Snackbar
          open={snackbarDetails.open}
          autoHideDuration={3000}
          onClose={() => setSnackBarDetails({ open: false, message: "" })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="warning">{snackbarDetails.message}</Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};
