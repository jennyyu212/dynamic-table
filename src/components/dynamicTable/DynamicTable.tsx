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

// const useStyles = makeStyles((theme: Theme) => ({
//       root: {
//             width: "100%",
//             marginTop: theme.spacing(3),
//             overflowX: "auto"
//       },
//       table: {
//             minWidth: 650
//       },
//       selectTableCell: {
//             width: 60
//       },
//       tableCell: {
//             width: 130,
//             height: 40
//       },
//       input: {
//             width: 130,
//             height: 40
//       }
// }));

interface RowData {
    row: any;
    previous: any;
    id: number;
    isEditMode: boolean;
}

const CustomTableCell = ({ row, colName, onChange }: { row: RowData, colName: string, onChange: any }) => {
    return (
        <TableCell align="left">
            {row.isEditMode ? (
                <Input
                    value={row.row[colName]}
                    name={colName}
                    onChange={e => onChange(e, row.id)}
                />
            ) : (
                row.row[colName]
            )}
        </TableCell>
    );
}



function DynamicTable(props: any) {
    const [rowData, setRowData] = useState<RowData[]>([]);
    const [columns, setColumns] = useState<any>([]);

    useEffect(() => {
        let tempData: RowData[] = [];
        for (let i = 0; i < props.data.length; i++) {
            const rowObj = { row: props.data[i], previous: null, id: i, isEditMode: false }
            tempData.push(rowObj)
        }
        setRowData(tempData)
    }, [])

    useEffect(() => {
        let cols = [];
        for (let i = 0; i < props.data.length; i++) {
            for (let col in props.data[i]) {
                // if the column is not already included
                // exclude id
                if ((cols.indexOf(col) === -1) && (col != "_id")) {
                    cols.push(col);
                }
            }
        }
        setColumns(cols)
    }, [props.data])

    // useEffect(() => {
    //     console.log(rowData)
    // }, [rowData])

    const onStartEditMode = (idx: any) => {
        setRowData(() => {
            return rowData.map((currentRowData: any) => {
                if (currentRowData.id === idx) {
                    return { ...currentRowData, isEditMode: !currentRowData.isEditMode, previous: currentRowData.row };
                }
                return currentRowData;
            });
        });
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const value = event.target.value;
        const name = event.target.name;
        const newRowData = rowData.map(currentRowData => {
            if (currentRowData.id === idx) {
                let newRow = { ...currentRowData.row, [name]: value }
                return { ...currentRowData, row: newRow };
            }
            return currentRowData;
        });
        setRowData(newRowData);

    };

    const onRevert = (idx: number) => {
        const newRowData = rowData.map(currentRowData => {
            if (currentRowData.id === idx) {
                console.log(currentRowData)
                return { ...currentRowData, row: currentRowData.previous, previous: null, isEditMode: !currentRowData.isEditMode };
            }
            return currentRowData;
        });
        setRowData(newRowData)
    };

    const onConfirmChange = (idx: number) => {
        const newRowData = rowData.map(currentRowData => {
            if (currentRowData.id === idx) {
                console.log(currentRowData)
                return { ...currentRowData, previous: null, isEditMode: !currentRowData.isEditMode };
            }
            return currentRowData;
        });
        setRowData(newRowData)
    }

    return (
        <Paper>
            <Table aria-label="caption table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left" />
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
                            {columns.map((col: string) => <CustomTableCell {...{ row: row, colName: col, onChange }} />)}
                        </TableRow>
                    })}

                </TableBody>
            </Table>
        </Paper>
    );
}

export default DynamicTable;

