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
        let isEmpty = true
        columns.forEach((col: string) => {
            console.log(row[col])
            if (row[col] !== "") {
                isEmpty = false
            }
        })
        return isEmpty
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

        let newRowData = [...rowData]
        let newRow = { ...newRowData[idx].row, [name]: value }
        newRowData[idx] = { ...newRowData[idx], row: newRow }
        setRowData(newRowData)
    };

    const onRevert = (idx: number) => {
        let newRowData = [...rowData]
        newRowData[idx] = { ...newRowData[idx], row: newRowData[idx].previous, previous: null, isEditMode: !newRowData[idx].isEditMode }
        setRowData(newRowData)
    };

    const onConfirmChange = (idx: number) => {
        if (rowIsEmpty(rowData[idx].row)) {
            deleteRow(idx)
        } else {
            let newRowData = [...rowData]
            newRowData[idx] = { ...newRowData[idx], previous: null, isEditMode: !newRowData[idx].isEditMode }
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

