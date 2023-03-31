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
import Spinner from "../Spinner";
import { styles } from "../../styles";

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

  const columns = [
    "companySigDate",
    "companySignatureName",
    "documentName",
    "documentStatus",
    "documentType",
    "employeeNumber",
    "employeeSigDate",
    "employeeSignatureName",
  ];

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

  const onChangeDate = (e: string, row: ICompanyData, name: string) => {
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
        <Spinner />
      ) : (
        isSuccess && (
          <div style={{ overflow: "hidden" }}>
            {isFetching && <Spinner />}
            <TableContainer component={Paper} sx={{ maxHeight: "93vh" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={styles.tableRowHeader}>
                    {columns.map((col) => (
                      <TableCell>
                        {col
                          .replace(/([A-Z])/g, " $1")
                          .charAt(0)
                          .toUpperCase() +
                          col.replace(/([A-Z])/g, " $1").slice(1)}
                      </TableCell>
                    ))}
                    <TableCell width={120} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows?.map((row: ICompanyData) => (
                    <TableRow key={row.id || dayjs().valueOf()}>
                      {columns.map((col) => (
                        <CustomTableCell
                          row={row}
                          name={col as keyof ICompanyData}
                          onChange={onChange}
                          onChangeDate={onChangeDate}
                        />
                      ))}
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
                  <TableRow sx={styles.lastTableRow}>
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
