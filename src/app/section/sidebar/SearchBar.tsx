import { Box, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
    search: string;
    onSearchChange: (value: string) => void;
}

const SearchBar = ({ search, onSearchChange }: SearchBarProps) => {
    return (
        <Box width="100%" mx="auto">
            <TextField
                variant="outlined"
                placeholder="Search users..."
                fullWidth
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        border: "2px solid #1F212F",
                        color: "#FFFFFF",
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#A07ACD",
                            borderWidth: "2px",
                        },
                        fontSize: { xs: "14px", sm: "16px" },
                    },
                    input: { color: "#FFFFFF" },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon
                                sx={{
                                    color: "#FFFFFF",
                                    fontSize: { xs: 20, sm: 24 },
                                }}
                            />
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default SearchBar; 