import {
  FormControl,
  InputLabel,
  Select,
  SelectProps,
  FormControlProps,
} from "@mui/material";
import { ReactNode } from "react";

interface StyledSelectProps extends Omit<SelectProps, "label"> {
  label: string;
  children: ReactNode;
  formControlProps?: FormControlProps;
}

const StyledSelect = ({
  label,
  children,
  formControlProps,
  ...props
}: StyledSelectProps) => (
  <FormControl
    fullWidth
    {...formControlProps}
    sx={{
      "& .MuiOutlinedInput-root": {
        color: "white",
        backgroundColor: "rgba(255,255,255,0.05)",
        "& fieldset": {
          borderColor: "rgba(255,255,255,0.1)",
        },
        "&:hover fieldset": {
          borderColor: "rgba(255,255,255,0.2)",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#0052CC",
        },
      },
      "& .MuiInputLabel-root": {
        color: "rgba(255,255,255,0.7)",
      },
      "& .MuiMenuItem-root": {
        color: "black",
      },
      ...formControlProps?.sx,
    }}
  >
    <InputLabel>{label}</InputLabel>
    <Select label={label} {...props}>
      {children}
    </Select>
  </FormControl>
);

export default StyledSelect;
