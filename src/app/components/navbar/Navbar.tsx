"use client";

import React, { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import GroupIcon from "@mui/icons-material/Group";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { clearAllUserErrorsAndMessages, logout } from "@/app/store/slices/userSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface NavbarProps {
    toggleDrawer?: () => void;
}

const Navbar = ({ toggleDrawer }: NavbarProps) => {
    const { user, message } = useSelector((state: RootState) => state.user);
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        console.log("Initiating logout");
        dispatch(logout());
        handleClose();
    };

    useEffect(() => {
        if (message) {
            console.log("Logout message received:", message);
            toast.success(message);
            router.push("/login");
        }
        dispatch(clearAllUserErrorsAndMessages());
    }, [message, dispatch, router]);

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#111322",
                p: { xs: "10px 15px", sm: "15px 20px" },
                borderBottom: "2px solid #1F212F",
            }}
        >
            <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, alignItems: "center" }}>
                {isMobile && toggleDrawer && (
                    <IconButton color="inherit" onClick={toggleDrawer} sx={{ mr: 1 }}>
                        <MenuIcon sx={{ fontSize: { xs: 24, sm: 28 } }} />
                    </IconButton>
                )}
                <ChatBubbleOutlineIcon
                    sx={{ fontSize: { xs: "24px", sm: "28px", md: "30px" }, color: "#A07ACD" }}
                />
                <Typography
                    variant="h1"
                    sx={{ fontSize: { xs: "20px", sm: "25px", md: "30px" }, color: "#FFFFFF" }}
                >
                    ChatApp
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    gap: { xs: "10px", sm: "20px", md: "30px" },
                    alignItems: "center",
                }}
            >
                <IconButton color="inherit" sx={{ color: "#FFFFFF" }}>
                    <GroupIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </IconButton>
                <Avatar
                    alt="Profile Photo"
                    onClick={handleAvatarClick}
                    sx={{
                        cursor: "pointer",
                        bgcolor: "#FFFFFF",
                        color: "#000000",
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        "&:hover": {
                            transform: "scale(1.05)",
                            transition: "all 0.2s ease-in-out",
                        },
                    }}
                >
                    {user?.username[0].toUpperCase()}
                </Avatar>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    PaperProps={{
                        sx: {
                            backgroundColor: "#22223b",
                            color: "#FFFFFF",
                            borderRadius: "8px",
                            mt: 1,
                        },
                    }}
                >

                    <Box sx={{ px: 2, py: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {user?.username}
                        </Typography>
                        <Typography variant="body2">
                            {user?.email}
                        </Typography>
                    </Box>
                    <MenuItem
                        onClick={handleLogout}
                        sx={{
                            fontSize: { xs: "14px", sm: "16px" },
                            "&:hover": {
                                backgroundColor: "#2A2C3A",
                            },
                        }}
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
};

export default Navbar;