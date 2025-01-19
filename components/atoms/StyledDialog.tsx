import { Dialog, DialogProps } from "@mui/material";
import { ReactNode } from "react";

interface StyledDialogProps extends DialogProps {
  children: ReactNode;
  width?: string;
}

const StyledDialog = ({
  children,
  width = "500px",
  ...props
}: StyledDialogProps) => (
  <Dialog
    {...props}
    PaperProps={{
      sx: {
        bgcolor: "#2C2C2C",
        color: "white",
        minWidth: { xs: "90%", sm: width },
        maxWidth: "90vw",
        borderRadius: "12px",
        backgroundImage:
          "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))",
      },
    }}
  >
    {children}
  </Dialog>
);

export default StyledDialog;
