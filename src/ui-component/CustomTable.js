import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

const CustomTable = ({ headers, hasAction, children, enableRowCheckbox,setSelectedRows,selectedRows,selectAll, setSelectAll, handleSelectAllClick }) => {

    const theme = useTheme();

    return (
        <TableContainer>
            <Table sx={{ minWidth: 350 }} aria-label="simple table"  size="small">
                <TableHead  sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light }}>
                    <TableRow>
                        {enableRowCheckbox && (
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selectedRows.length > 0 && selectedRows.length < children.length}
                                    checked={selectAll}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                        )}
                        {headers.map((column, index) => (
                            <TableCell key={index} align={typeof(column.align) === "undefined" ? "left" : column.align} style={{width: typeof(column.width) !== 'undefined' && column.width }}>
                                {column.name}
                            </TableCell>
                        ))}
                        {hasAction && <TableCell align="center" sx={{ pr: 3 }}>Action</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {React.Children.map(children, (row, index) => (
                        React.cloneElement(row, {
                            key: index,
                            // onClick: (event) => enableRowCheckbox && handleRowClick(event, index),
                            // checked : isSelected(row.clearingID),
                            // selected: enableRowCheckbox && children.isItemSelected,
                        })
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CustomTable;
