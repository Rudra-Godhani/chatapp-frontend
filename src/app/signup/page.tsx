"use client";

import { Box, Card, Typography, TextField, Button, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { clearAllUserErrorsAndMessages, register as registerUser } from "../store/slices/userSlice";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface FormData {
    username: string;
    email: string;
    password: string;
}

export default function Signup() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, isAuthenticated, error, message } = useSelector(
        (state: RootState) => state.user
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        dispatch(registerUser(data));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        if (message) {
            toast.success(message);
            router.push("/login");
        }
        if(isAuthenticated){
            router.push("/");
        }
        dispatch(clearAllUserErrorsAndMessages());
    }, [dispatch, error, loading, isAuthenticated, message, router]);

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
                    Create an Account
                </Typography>
                <Typography
                    variant="body2"
                    align="center"
                    gutterBottom
                    sx={{ color: "#b0b0b0" }}
                >
                    Fill in your details to create a new account
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Username"
                        {...register("username", { required: "Username is required" })}
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
                    {errors.username && (
                        <span className="text-red-500 text-sm mb-3 block">
                            {errors.username.message}
                        </span>
                    )}
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
                    >
                        {loading ? (
                            <CircularProgress
                                size={24}
                                sx={{
                                    color: "#FFFFFF",
                                }}
                            />
                        ) : (
                            "Create Account"
                        )}
                    </Button>
                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: "#b0b0b0" }}
                    >
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-[#8b6bff] decoration-none"
                        >
                            Sign in
                        </Link>
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}
