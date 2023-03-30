import { Input, TableCell } from "@mui/material";
import { ICompanyData } from "../../types";
import dayjs from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateValidationError } from "@mui/x-date-pickers/internals";
import { PickerChangeHandler } from "@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue";

export const CustomTableCell = ({
  row,
  name,
  onChange,
  onChangeDate,
}: {
  row: ICompanyData;
  name: keyof ICompanyData;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    row: ICompanyData
  ) => void;
  onChangeDate?: (
    e: PickerChangeHandler<dayjs.Dayjs | null, DateValidationError> | string,
    row: ICompanyData,
    name: string
  ) => void;
}) => {
  const dateDisplayFormat = "DD/MM/YYYY HH:mm";
  const { isEditMode } = row;
  return (
    <TableCell align="left" sx={{ padding: "8px 8px 8px 16px" }}>
      {isEditMode ? (
        name.includes("Date") ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              sx={{
                "& > div > input": { padding: "12px 0px 12px 12px" },
                maxWidth: 210,
              }}
              format={dateDisplayFormat}
              value={row && dayjs(row[name] as string)}
              onChange={(e) => onChangeDate!(e!.toISOString(), row, name)}
            />
          </LocalizationProvider>
        ) : (
          <Input
            value={row[name]}
            name={name}
            onChange={(e) => onChange!(e, row)}
          />
        )
      ) : name === "companySigDate" || name === "employeeSigDate" ? (
        dayjs(row[name]).format(dateDisplayFormat)
      ) : (
        row[name]
      )}
    </TableCell>
  );
};
