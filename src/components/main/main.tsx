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
  CssBaseline,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
  const { data, isLoading, isSuccess, isFetching } = useGetCompanyQuery();
  const [
    addCompany,
    { isLoading: isLoadingCreateReq, originalArgs: addCompanyArgs },
  ] = useCreateCompanyMutation();
  const [
    deleteCompany,
    { isLoading: isLoadingDeleteReq, originalArgs: deleteCompanyArgs },
  ] = useDeleteCompanyMutation();
  const [
    setCompany,
    { isLoading: isLoadingSetReq, originalArgs: setCompanyArgs },
  ] = useSetCompanyMutation();
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
        ...data.data.map((item) => ({
          ...item,
          isEditMode: tableRows.find(({ id }) => id === item.id)?.isEditMode,
        })),
        ...tableRows.filter(({ isNewCompany }: ICompanyData) => isNewCompany),
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading, isSuccess]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    row: ICompanyData
  ) => {
    const value = e!.target.value;
    const name = e!.target.name;
    const { id } = row;
    const newRows = tableRows.map((row: ICompanyData) => {
      if (row.id === id) {
        return { ...row, [name as keyof ICompanyData]: value };
      } else return row;
    });
    setTableRows(newRows);
  };

  const onChangeDate = (e: any, row: ICompanyData, name: string) => {
    const value = e!;
    const { id } = row;
    const newRows = tableRows.map((row: ICompanyData) => {
      if (row.id === id) {
        return { ...row, [name as keyof ICompanyData]: value };
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
      <CssBaseline />
      <Navbar />
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
      {isLoading ? (
        <CircularProgress
          size={60}
          sx={{ position: "absolute", top: "50%", left: "50%" }}
        />
      ) : (
        isSuccess && (
          <div style={{ overflow: "hidden" }}>
            {isFetching && (
              <CircularProgress
                size={60}
                sx={{ position: "absolute", top: "50%", left: "50%" }}
              />
            )}
            <TableContainer component={Paper} sx={{ maxHeight: "93vh" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ "& > th": { fontWeight: 700 } }}>
                    <TableCell>Company Sig Date</TableCell>
                    <TableCell>Company Signature Name</TableCell>
                    <TableCell>Document Name</TableCell>
                    <TableCell>Document Status</TableCell>
                    <TableCell>Document Type</TableCell>
                    <TableCell>Employee Number</TableCell>
                    <TableCell>Employee Sig Date</TableCell>
                    <TableCell>Employee Signature Name</TableCell>
                    <TableCell width={120} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows?.map((row: ICompanyData) => (
                    <TableRow key={row.id || dayjs().valueOf()}>
                      <CustomTableCell
                        row={row}
                        name="companySigDate"
                        onChangeDate={onChangeDate}
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
                        onChangeDate={onChangeDate}
                      />
                      <CustomTableCell
                        row={row}
                        name="employeeSignatureName"
                        onChange={onChange}
                      />
                      <TableCell padding="none" sx={{ position: "relative" }}>
                        {row.isEditMode ? (
                          <>
                            {(isLoadingCreateReq &&
                              row.id === addCompanyArgs?.id) ||
                            (isLoadingSetReq &&
                              row.id === setCompanyArgs?.id) ? (
                              <IconButton disabled>
                                <CircularProgress size={24} color="success" />
                              </IconButton>
                            ) : (
                              <IconButton
                                aria-label="done"
                                color="success"
                                onClick={() => handleSetCompany(row)}
                              >
                                <DoneIcon />
                              </IconButton>
                            )}
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

                            {isLoadingDeleteReq &&
                            row.id === deleteCompanyArgs ? (
                              <IconButton disabled>
                                <CircularProgress size={24} color="warning" />
                              </IconButton>
                            ) : (
                              <IconButton
                                aria-label="delete"
                                color="warning"
                                onClick={() => deleteCompany(row.id!)}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            )}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow
                    sx={{
                      "& > td": {
                        padding: "4px 0px 0px 0px",
                      },
                    }}
                  >
                    <TableCell colSpan={8} />
                    <TableCell align="left">
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
            </TableContainer>
          </div>
        )
      )}
    </div>
  );
};

export default Main;
