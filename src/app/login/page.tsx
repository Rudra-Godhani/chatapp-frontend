"use client";

import { Box, Card, Typography, TextField, Button, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { clearAllUserErrorsAndMessages, login } from "../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FormData {
    email: string;
    password: string;
}

export default function Login() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, error, message, isAuthenticated } = useSelector((state: RootState) => state.user);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        dispatch(login(data));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        if (isAuthenticated) {
            if (message) {
                toast.success(message);
            }
            router.push('/');
        }
        dispatch(clearAllUserErrorsAndMessages());
    }, [error, message, dispatch, router, isAuthenticated]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(90deg, #1e1e4e 10%, #ad5389 140%)",
            }}
        >
            <Card
                sx={{
                    padding: "2rem",
                    borderRadius: "12px",
                    backgroundColor: "#191B34",
                    color: "#ffffff",
                    width: "450px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={"700"}
                    align="center"
                    gutterBottom
                >
                    Welcome Back
                </Typography>
                <Typography
                    variant="body2"
                    align="center"
                    gutterBottom
                    sx={{ color: "#b0b0b0" }}
                >
                    Enter your credentials to access your account
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        {...register("email", { required: "Email is required" })}
                        sx={{
                            mb: "1rem",
                            "& .MuiInputBase-root": {
                                backgroundColor: "#2a2a40",
                                color: "#ffffff",
                            },
                            "& .MuiInputLabel-root": { color: "#b0b0b0" },
                            "& .MuiInputBase-input": { color: "#ffffff" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#4a4a6a" },
                                "&:hover fieldset": { borderColor: "#6b6b8b" },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#8b6bff",
                                },
                            },
                        }}
                    />
                    {errors.email && (
                        <span className="text-red-500 text-sm mb-3 block">
                            {errors.email.message}
                        </span>
                    )}
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        {...register("password", { required: "Password is required" })}
                        sx={{
                            mb: "1rem",
                            "& .MuiInputBase-root": {
                                backgroundColor: "#2a2a40",
                                color: "#ffffff",
                            },
                            "& .MuiInputLabel-root": { color: "#b0b0b0" },
                            "& .MuiInputBase-input": { color: "#ffffff" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "#4a4a6a" },
                                "&:hover fieldset": { borderColor: "#6b6b8b" },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#8b6bff",
                                },
                            },
                        }}
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm mb-3 block">
                            {errors.password.message}
                        </span>
                    )}
                    <Button
                        fullWidth
                        sx={{
                            backgroundColor: "#9271BD",
                            color: "#ffffff",
                            padding: "0.75rem",
                            mb: "1rem",
                            textTransform: "capitalize",
                            "&:hover": { backgroundColor: "#9271CD" },
                        }}
                        onClick={handleSubmit(onSubmit)}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: "#FFFFFF",
                                }}
                            />
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: "#b0b0b0" }}
                    >
                        Don’t have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-[#8b6bff] decoration-none"
                        >
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}
