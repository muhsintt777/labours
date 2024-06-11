import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import { FormEvent, useState } from "react";
import { EMAIL, FULL_NAME } from "../../utils/regex";
import { createAccount } from "../../configs/firebase";
import { useAppDispatch } from "../../store/store";
import { login } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";

const USER_TYPE = {
  CUSTOMER: 1,
  CONTRACTOR: 2,
};
const defaultTheme = createTheme();

export const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userType, setUserType] = useState(USER_TYPE.CUSTOMER);
  const [email, setEmail] = useState("");
  const [password, setPassord] = useState("");
  const [name, setName] = useState("");
  const [snackbarDetails, setSnackBarDetails] = useState({
    open: false,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  function handleTypeChange(e: SelectChangeEvent<number>) {
    setUserType(Number(e.target.value));
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    if (!FULL_NAME.test(name)) {
      setSnackBarDetails({ open: true, message: "Please enter a valid name" });
      return;
    } else if (!EMAIL.test(email)) {
      setSnackBarDetails({ open: true, message: "Please enter a valid email" });
      return;
    } else if (password.length < 6) {
      setSnackBarDetails({
        open: true,
        message: "Password must be a minimum of 6 characters.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await createAccount(email, password, userType, name);
      dispatch(login(res));
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errCode = error.code;
      if (errCode === "auth/email-already-in-use") {
        setSnackBarDetails({
          open: true,
          message: "Email already exist",
        });
      } else {
        setSnackBarDetails({
          open: true,
          message: "Something went wrong!, please try again later.",
        });
      }
    }
    setLoading(false);
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={userType}
                label="type"
                onChange={handleTypeChange}
              >
                <MenuItem value={1}>Customer</MenuItem>
                <MenuItem value={2}>Contractor</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Name"
              type="name"
              id="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              // autoComplete="current-name"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              onChange={(e) => setPassord(e.target.value)}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                <div
                  onClick={() => navigate("/auth/login")}
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
