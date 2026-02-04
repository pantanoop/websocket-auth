"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../../redux/auth/authenticateSlice";

import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  TextField,
  Button,
  Typography,
  Card,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import "./register.css";

const RegistrationSchema = z
  .object({
    email: z.string().email("Must be a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/^\S*$/, "Password cannot contain spaces"),
    confirmpassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    path: ["confirmpassword"],
    message: "Passwords do not match",
  });

type RegistrationSchemaType = z.infer<typeof RegistrationSchema>;

function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { currentUser, error } = useAppSelector((state) => state.authenticator);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (currentUser && !error) {
      setSnackbarMessage("Registration successful!");
      setOpenSnackbar(true);

      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentUser, router]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegistrationSchemaType>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmpassword: "",
    },
  });

  const handleRegister = async (data: RegistrationSchemaType) => {
    try {
      const userData = {
        email: data.email,
        password: data.password,
      };

      await dispatch(registerUser(userData));
    } catch (err: any) {
      const message = err?.message || "Registration failed";

      setError("email", {
        type: "manual",
        message,
      });

      setSnackbarMessage(message);
      setOpenSnackbar(true);
    }
  };

  return (
    <div className="so-register-page">
      <div className="so-register-container">
        <div className="so-logo-area">
          <img
            className="so-logo"
            src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Stack_Overflow_icon.svg"
            alt="logo"
          />
        </div>

        <Card className="so-register-card">
          <form
            onSubmit={handleSubmit(handleRegister)}
            className="so-register-form"
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
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
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  fullWidth
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

            <Controller
              name="confirmpassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  error={!!errors.confirmpassword}
                  helperText={errors.confirmpassword?.message}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword((s) => !s)}
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              className="so-register-submit"
            >
              Sign up
            </Button>

            <Divider className="so-divider">OR</Divider>

            <Typography className="so-footer-text">
              Already have an account? <a href="/pages/auth/login">Log in</a>
            </Typography>
          </form>
        </Card>
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </div>
  );
}

export default Register;
