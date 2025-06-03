"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { getAllUsers, getUser, getUserChats, updateUserStatus } from "./store/slices/userSlice";
import Navbar from "./components/navbar/Navbar";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "./section/sidebar/Sidebar";
import { socket } from "@/socket";
import ChatWindow from "./section/chatWindow/ChatWindow";
import ChatWelcome from "./section/chatWelcome/ChatWelcome";
import ProtectedRoute from "./components/ProtectedRoute";

const DRAWER_WIDTH = 450;

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.user);
    const { activeChat } = useSelector((state: RootState) => state.chat);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        dispatch(getAllUsers());
        dispatch(getUser());
        if (user?.id) {
            dispatch(getUserChats(user.id));
        }
    }, [user?.id, dispatch]);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
        
        if (user?.id) {
            socket.emit("userConnect", user.id);
        }

        socket.on("userStatus", ({ userId, online }) => {
            dispatch(updateUserStatus(userId, online));
        });

        return () => {
            socket.off("userStatus");
        };
    }, [user?.id, dispatch]);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <ProtectedRoute>
            <Navbar toggleDrawer={toggleDrawer} />
            <Box sx={{ display: "flex", height: "100vh" }}>
                {isMobile ? (
                    <Drawer
                        anchor="left"
                        open={drawerOpen}
                        onClose={toggleDrawer}
                        sx={{
                            "& .MuiDrawer-paper": {
                                width: { xs: 300, sm: 400 },
                                backgroundColor: "#111322",
                                color: "#FFFFFF",
                                boxSizing: "border-box",
                            },
                        }}
                    >
                        <Sidebar toggleDrawer={toggleDrawer} isMobile={isMobile} />
                    </Drawer>
                ) : (
                    <Box
                        component="nav"
                        sx={{
                            width: DRAWER_WIDTH,
                            flexShrink: 0,
                            position: "fixed",
                            top: 0,
                            left: 0,
                            height: "100vh",
                            zIndex: 1100,
                        }}
                    >
                        <Sidebar isMobile={isMobile} />
                    </Box>
                )}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
                        ml: { xs: 0, md: `${DRAWER_WIDTH}px` },
                        pt: { xs: "56px", sm: "64px", md: "72px" },
                        transition: theme.transitions.create(["margin", "width"], {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                    }}
                >
                    {activeChat ? <ChatWindow /> : <ChatWelcome />}
                </Box>
            </Box>
        </ProtectedRoute>
    );
}