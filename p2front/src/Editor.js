/*
 * Project 2
 * Editor component JavaScript source code
 *
 * Author: Shreya Ashok Kumar
 * Version: 1.0
 */

// Editor view is the left-hand data view which showing the title, x label,
// y label, and all the data points in a table format
import './Editor.css';
import React, {useState} from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {Checkbox, TablePagination} from "@mui/material";

// Editor takes in as props the dataset retrieved from the database,
// and the event handlers defined in App that will handle
// any changes made to the data such as title change, new data point insertion,
// existing data point deletion, change in x label, change in y label, and
// modification of existing data point
const Editor = (props) => {
    // initializing important state variables to maintain the state
    // of the editor view table
    const [newX, setNewX] = useState(null); //New X Value
    const [newY, setNewY] = useState(null); //New Y Value
    const [page, setPage] = React.useState(0);  //Current table page
    const [rowsPerPage, setRowsPerPage] = React.useState(7);  //Rows displayed per page

    // event handler for handling when user wants to change table page
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    // event handler for handling when user wants to change
    // displayed rows per page
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    
    // initializing a textfield for each component of the dataset such as
    // title, xlabel, ylalbe, adding new data button and their textfields, and
    // one per existing data point for display. Using Object.keys to access the
    // labels and data point values, calling the appropriate event handler whenever
    // the values for any of these textfields are changed, and when the add button
    // is clicked. The values for each textfield is accessed using props.dataset
	return(
		<Box>
			<div className='centerDiv'>
				<TextField
					id='newX'
					size='small'
					variant='outlined'
					label={'New X Value'}
					onChange={(e) => setNewX(e.target.value)}
                />
				<TextField
					id='newY'
					size='small'
					variant="outlined"
					label={'New Y Value'}
					onChange={(e) => setNewY(e.target.value)}
                />
                <Button
                    variant="outlined"
                    onClick={() => props.addElementHandler(newX, Number(newY))}
                >
                	Add
                </Button>
            </div>
            <div className='centerDiv'>
                <TextField
                    id='titleText'
                    value={props.dataset && props.dataset.title !== null ? props.dataset.title : ''}
                    size='small'
                    variant='filled'
                    label={'Title'}
                    onChange={(e) => props.titleHandler(e)}
                />
            </div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                color='primary'
                                checked={props.selected.indexOf(-1) !== -1}
                                onChange={(e) => props.selectHandler(e, -1)}
                            />
                        </TableCell>
                        <TableCell key='x'>
                            <TextField
                                variant='standard'
                                size='small'
                                value={props.dataset && props.dataset.data && props.dataset.data.length > 0 ? Object.keys(props.dataset.data[0])[0] : ''}
                                label={'X Label'}
                                onChange={(e) => props.xLabelHandler(e)}
                            />
                        </TableCell>
                        <TableCell key='y'>
                            <TextField
                                variant='standard'
                                size='small'
                                value={props.dataset && props.dataset.data && props.dataset.data.length > 0 ? Object.keys(props.dataset.data[0])[1] : ''}
                                label={'Y Label'}
                                onChange={(e) => props.yLabelHandler(e)}
                            />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.dataset && props.dataset.data && props.dataset.data.length > 0 && props.dataset.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((currentValue, index) => (
                    		<TableRow key={index + page * rowsPerPage} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        		<TableCell padding='checkbox'>
                                	<Checkbox
                                        color='primary'
                                        checked={props.selected.indexOf(index) !== -1}
                                        onChange={(e) => props.selectHandler(e, index + page * rowsPerPage)}
                                    />
                                </TableCell>
                                <TableCell key='x'>
                                    <TextField
                                        variant='standard'
                                        size='small'
                                        value={Object.values(props.dataset.data[index + page * rowsPerPage])[0]}
                                        onChange={(e) => props.editElementHandler(e.target.value, index + page * rowsPerPage, true)}
                                    />
                                </TableCell>
                                <TableCell key='y'>
                                    <TextField
                                        variant='standard'
                                        size='small'
                                        value={Object.values(props.dataset.data[index + page * rowsPerPage])[1]}
                                        onChange={(e) => props.editElementHandler(Number(e.target.value), index + page * rowsPerPage, false)}
                                    />
                                </TableCell>
                                <TableCell key='delete'>
                                    <DeleteOutlinedIcon
                                        onClick={() => props.deleteElementHandler(index + page * rowsPerPage)}
                                    >
                                    </DeleteOutlinedIcon>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[7, 10, 25]}
                component='div'
                count={props.dataset && props.dataset.data.length > 0 ? props.dataset.data.length: 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
};

export default Editor;
