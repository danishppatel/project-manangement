import { Box, Typography } from "@mui/material";
import IconButton from "../atoms/IconButton";
import AddIcon from "@mui/icons-material/Add";

interface SectionHeaderProps {
  title: string;
  onAddClick: () => void;
}

const SectionHeader = ({ title, onAddClick }: SectionHeaderProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
      p: 1,
    }}
  >
    <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
      {title}
    </Typography>
    <IconButton size="small" startIcon={<AddIcon />} onClick={onAddClick}>
      Add
    </IconButton>
  </Box>
);

export default SectionHeader;
