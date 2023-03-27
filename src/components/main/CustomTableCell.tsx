import { Input, TableCell } from "@mui/material";
import { ICompanyData } from "../../types";
import dayjs from "dayjs";

export const CustomTableCell = ({
  row,
  name,
  onChange,
}: {
  row: ICompanyData;
  name: keyof ICompanyData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    row: ICompanyData
  ) => void;
}) => {
  const dateDisplayFormat = "DD/MM/YYYY HH:mm";
  const { isEditMode } = row;
  return (
    <TableCell align="left">
      {isEditMode ? (
        <Input
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
        />
      ) : name === "companySigDate" || name === "employeeSigDate" ? (
        dayjs(row[name]).format(dateDisplayFormat)
      ) : (
        row[name]
      )}
    </TableCell>
  );
};
