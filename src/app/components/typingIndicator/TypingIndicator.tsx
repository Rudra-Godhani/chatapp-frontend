import { Box, Typography } from "@mui/material";

const TypingIndicator = () => {
    return (
        <Box
            sx={{
                alignSelf: "flex-start",
                display: "flex",
                alignItems: "flex-end",
                gap: 0.5,
            }}
        >
            <Typography variant="body2" sx={{ fontSize: { xs: "12px", sm: "14px" } }}>typing</Typography>
            <Box
                sx={{
                    width: 2,
                    height: 2,
                    bgcolor: "#fff",
                    borderRadius: "50%",
                    animation: "bounce 1.4s infinite",
                    animationDelay: "0s",
                    "@keyframes bounce": {
                        "0%, 80%, 100%": { transform: "translateY(0)" },
                        "40%": { transform: "translateY(-5px)" },
                    },
                }}
            />
            <Box
                sx={{
                    width: 2,
                    height: 2,
                    bgcolor: "#fff",
                    borderRadius: "50%",
                    animation: "bounce 1.4s infinite",
                    animationDelay: "0.2s",
                    "@keyframes bounce": {
                        "0%, 80%, 100%": { transform: "translateY(0)" },
                        "40%": { transform: "translateY(-5px)" },
                    },
                }}
            />
            <Box
                sx={{
                    width: 2,
                    height: 2,
                    bgcolor: "#fff",
                    borderRadius: "50%",
                    animation: "bounce 1.4s infinite",
                    animationDelay: "0.4s",
                    "@keyframes bounce": {
                        "0%, 80%, 100%": { transform: "translateY(0)" },
                        "40%": { transform: "translateY(-5px)" },
                    },
                }}
            />
        </Box>
    )
}
export default TypingIndicator;
