import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Theme } from "@mui/material/styles";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/EditOutlined";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RevertIcon from "@mui/icons-material/NotInterestedOutlined";

interface RowData {
    row: any;
    previous: any;
    isEditMode: boolean;
}



function DynamicTable(props: any) {
    const [rowData, setRowData] = useState<RowData[]>([]);
    const [columns, setColumns] = useState<any>([]);

    useEffect(() => {
        let tempData: RowData[] = [];
        for (let i = 0; i < props.data.length; i++) {
            const rowObj = { row: props.data[i], previous: null, isEditMode: false }
            tempData.push(rowObj)
        }
        setRowData(tempData)
    }, [])

    useEffect(() => {
        let cols = [];
        for (let i = 0; i < props.data.length; i++) {
            for (let col in props.data[i]) {
                // if the column is not already included, exclude id
                if ((cols.indexOf(col) === -1) && (col != "_id")) {
                    cols.push(col);
                }
            }
        }
        setColumns(cols)
    }, [props.data])

    const rowIsEmpty = (row: any) => {
        columns.forEach((col: string) => {
            if (row[col] !== "") {
                return false
            }
        })
        return true
    }

    const deleteRow = (idx: number) => {
        setRowData(rowData.filter((r: any, index: number) => index !== idx))
    }

    const onStartEditMode = (idx: number) => {
        setRowData(() => {
            return rowData.map((currentRowData: RowData, i: number) => {
                if (i === idx) {
                    return { ...currentRowData, isEditMode: !currentRowData.isEditMode, previous: currentRowData.row };
                }
                return currentRowData;
            });
        });
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const value = event.target.value;
        const name = event.target.name;
        const newRowData = rowData.map((currentRowData: RowData, i: number) => {
            if (i === idx) {
                let newRow = { ...currentRowData.row, [name]: value }
                return { ...currentRowData, row: newRow };
            }
            return currentRowData;
        });
        setRowData(newRowData);

    };

    const onRevert = (idx: number) => {
        const newRowData = rowData.map((currentRowData: RowData, i: number) => {
            if (i === idx) {
                console.log(currentRowData)
                return { ...currentRowData, row: currentRowData.previous, previous: null, isEditMode: !currentRowData.isEditMode };
            }
            return currentRowData;
        });
        setRowData(newRowData)
    };

    const onConfirmChange = (idx: number) => {
        let toDeleteRow = false;
        const newRowData = rowData.map((currentRowData: RowData, i: number) => {
            if (i === idx) {
                if (rowIsEmpty(currentRowData.row)) {
                    toDeleteRow = true
                }
                return { ...currentRowData, previous: null, isEditMode: !currentRowData.isEditMode };
            }
            return currentRowData;
        });
        if (toDeleteRow) {
            deleteRow(idx)
        } else {
            setRowData(newRowData)
        }
    }

    return (
        <Paper sx={{ width: "60%", overflowX: "auto" }}>
            <Table aria-label="caption table" sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell align="left" sx={{ width: 60 }} />
                        {columns.map((col: string, idx: number) => <TableCell align="left">{col}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rowData.map((row: any, idx: number) => {
                        return <TableRow key={idx}>
                            <TableCell>
                                {row.isEditMode ? (
                                    <>
                                        <IconButton aria-label="done" onClick={() => onConfirmChange(idx)}>
                                            <DoneAllIcon />
                                        </IconButton>
                                        <IconButton aria-label="revert" onClick={() => onRevert(idx)}>
                                            <RevertIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <IconButton aria-label="delete" onClick={() => onStartEditMode(idx)}>
                                        <EditIcon />
                                    </IconButton>
                                )}
                            </TableCell>
                            {columns.map((col: string) => <CustomTableCell {...{ row: row, colName: col, onChange, rowNumber: idx }} />)}
                        </TableRow>
                    })}

                </TableBody>
            </Table>
        </Paper>
    );
}

const CustomTableCell = ({ row, colName, onChange, rowNumber }: { row: RowData, colName: string, onChange: any, rowNumber: number }) => {
    return (
        <TableCell align="left" sx={{ width: 60 }}>
            {row.isEditMode ? (
                <Input
                    value={row.row[colName]}
                    name={colName}
                    onChange={e => onChange(e, rowNumber)}
                    sx={{ width: 130, height: 40 }}
                />
            ) : (
                row.row[colName]
            )}
        </TableCell>
    );
}

export default DynamicTable;

