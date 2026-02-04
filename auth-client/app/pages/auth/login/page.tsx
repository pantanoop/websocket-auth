"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { loginUser } from "../../../redux/auth/authenticateSlice";

import "./login.css";

const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof LoginSchema>;

function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // const { error } = useAppSelector((state) => state.authenticator);

  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const { currentUser, error } = useAppSelector((state) => state.authenticator);

  useEffect(() => {
    if (error === "409") {
      setShowOtp(true);
    }
    if (currentUser && !error) {
      setSnackbarMessage("Logged in successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentUser, router]);
  console.log(currentUser);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      await dispatch(loginUser(data));
    } catch (error: any) {
      const message = error?.message || "Login failed";

      setError("email", { type: "manual", message });

      setSnackbarMessage(message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  function handleOtp() {
    return "hello";
  }

  return (
    <div className="so-login-page">
      <div className="so-login-container">
        <div className="so-logo-area">
          <img
            className="so-logo"
            src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Stack_Overflow_icon.svg"
            alt="logo"
          />
        </div>

        <Card className="so-login-card">
          <Box
            component="form"
            onSubmit={handleSubmit(handleLogin)}
            className="so-login-form"
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  variant="outlined"
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((s) => !s)}>
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="so-login-submit"
            >
              Log in
            </Button>
          </Box>
        </Card>
        {showOtp && (
          <Card className="so-login-card">
            <Box
              component="form"
              onSubmit={handleSubmit(handleOtp)}
              className="so-login-form"
            >
              <TextField
                label="otp"
                variant="outlined"
                placeholder="Enter OTP"
                fullWidth
                value={otpValue}
                onChange={(e: any) => setOtpValue(e.target.value)}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="so-login-submit"
                onSubmit={handleSubmit(handleOtp)}
              >
                Verify OTP
              </Button>
            </Box>
          </Card>
        )}

        <div className="so-login-footer">
          <Typography>
            Don’t have an account? <a href="/pages/auth/signup">Sign up</a>
          </Typography>
        </div>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Login;
