import { Navbar } from "../Navbar";
import {
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useGetCompanyQuery,
  useSetCompanyMutation,
} from "../../services/fetchAPI.api";
import {
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import DoneIcon from "@mui/icons-material/Done";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { CustomTableCell } from "./CustomTableCell";
import { ICompanyData } from "../../types";
import dayjs from "dayjs";
import { SlideTransition } from "../authentication/LoginPage";

const Main = () => {
  const { data, isLoading, isSuccess } = useGetCompanyQuery();
  const [addCompany] = useCreateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();
  const [setCompany] = useSetCompanyMutation();
  const [tableRows, setTableRows] = useState<ICompanyData[]>([]);
  const [error, setError] = useState<string>("");
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const errorHandler = (e: {
    data: {
      errors: { [s: string]: unknown } | ArrayLike<unknown>;
      title: string;
    };
  }) => {
    console.log("Error Response", e);
    const errors = Object.values(e.data.errors);
    setError(`${e.data.title.replace(".", "")}: ${errors}`.replace(",", " "));
    setIsErrorOpen(true);
  };

  const handleCloseError = () => {
    setIsErrorOpen(false);
  };

  useEffect(() => {
    isSuccess &&
      !isLoading &&
      setTableRows([
        ...data.data,
        ...tableRows.filter(({ isNewCompany }: ICompanyData) => isNewCompany),
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, isSuccess]);

  const onChange = (
    e: { target: { value: string; name: string } },
    row: ICompanyData
  ) => {
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = tableRows.map((row: ICompanyData) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      } else return row;
    });
    setTableRows(newRows);
  };

  const onToggleEditMode = (id: string | number) => {
    setTableRows(() => {
      return tableRows.map((row: ICompanyData) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        } else {
          return row;
        }
      });
    });
  };

  const handleSetCompany = (row: ICompanyData) => {
    if (!row.isNewCompany) {
      setCompany(row)
        .unwrap()
        .then((res: any) => {
          console.log(res);
          delete row.isEditMode;
        })
        .catch(
          (e: {
            data: {
              errors: { [s: string]: unknown } | ArrayLike<unknown>;
              title: string;
            };
          }) => errorHandler(e)
        );
    } else {
      delete row.id;
      addCompany(row)
        .unwrap()
        .then((res: any) => {
          console.log(res);
          delete row.isNewCompany;
        })
        .catch((e) => errorHandler(e));
    }
  };

  const onRevert = (row: ICompanyData) => {
    if (row.isNewCompany) {
      setTableRows(tableRows.filter((i: ICompanyData) => i.id !== row.id));
    } else {
      const newRows = tableRows.map((i: ICompanyData) => {
        if (i.id === row.id) {
          return data?.data.find((i: ICompanyData) => i.id === row.id)!;
        }
        return i;
      });
      setTableRows(newRows);
    }
  };

  const addNewCompany = () => {
    setTableRows([
      ...tableRows,
      {
        id: dayjs().valueOf().toString(),
        documentStatus: "",
        employeeNumber: "",
        documentType: "",
        documentName: "",
        companySignatureName: "",
        employeeSignatureName: "",
        employeeSigDate: dayjs().toISOString(),
        companySigDate: dayjs().toISOString(),
        isEditMode: true,
        isNewCompany: true,
      },
    ]);
  };

  return (
    <div>
      <Navbar />
      {isLoading ? (
        <CircularProgress
          size="lg"
          sx={{ position: "absolute", top: "50%", left: "50%" }}
        />
      ) : (
        isSuccess && (
          <>
            <Snackbar
              open={isErrorOpen}
              autoHideDuration={6000}
              onClose={handleCloseError}
              TransitionComponent={SlideTransition}
            >
              <Alert
                onClose={handleCloseError}
                severity="error"
                sx={{ width: "100%" }}
              >
                {error}
              </Alert>
            </Snackbar>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>companySigDate</TableCell>
                  <TableCell>companySignatureName</TableCell>
                  <TableCell>documentName</TableCell>
                  <TableCell>documentStatus</TableCell>
                  <TableCell>documentType</TableCell>
                  <TableCell>employeeNumber</TableCell>
                  <TableCell>employeeSigDate</TableCell>
                  <TableCell>employeeSignatureName</TableCell>
                  <TableCell width={80} />
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows?.map((row: ICompanyData) => (
                  <TableRow key={row.id || dayjs().valueOf()}>
                    <CustomTableCell
                      row={row}
                      name="companySigDate"
                      onChange={onChange}
                    />
                    <CustomTableCell
                      row={row}
                      name="companySignatureName"
                      onChange={onChange}
                    />
                    <CustomTableCell
                      row={row}
                      name="documentName"
                      onChange={onChange}
                    />
                    <CustomTableCell
                      row={row}
                      name="documentStatus"
                      onChange={onChange}
                    />
                    <CustomTableCell
                      row={row}
                      name="documentType"
                      onChange={onChange}
                    />
                    <CustomTableCell
                      row={row}
                      name="employeeNumber"
                      onChange={onChange}
                    />
                    <CustomTableCell
                      row={row}
                      name="employeeSigDate"
                      onChange={onChange}
                    />
                    <CustomTableCell
                      row={row}
                      name="employeeSignatureName"
                      onChange={onChange}
                    />
                    <TableCell>
                      {row.isEditMode ? (
                        <>
                          <IconButton
                            aria-label="done"
                            color="success"
                            onClick={() => handleSetCompany(row)}
                          >
                            <DoneIcon />
                          </IconButton>
                          <IconButton
                            aria-label="revert"
                            onClick={() => onRevert(row)}
                          >
                            <DoNotDisturbIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            aria-label="edit"
                            onClick={() => onToggleEditMode(row.id!)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            color="warning"
                            onClick={() => deleteCompany(row.id!)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={8} />
                  <TableCell>
                    <IconButton
                      aria-label="add"
                      onClick={() => addNewCompany()}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )
      )}
    </div>
  );
};

export default Main;
