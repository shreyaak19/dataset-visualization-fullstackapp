/*
 * Project 2
 * MenuBar component JavaScript source code
 *
 * Author: Shreya Ashok Kumar
 * Version: 1.0
 */
// The MenuBar provides functionality to this project by having the two menu list
// of options to perform on the different views, which are the menu and edit menus
import './MenuBar.css';
import React from "react";
import Box from '@mui/material/Box';
import {
    AppBar,Button,Toolbar,Menu,MenuItem,DialogTitle,DialogContent,
    Dialog,DialogActions, List, ListItemText, ListItemButton,
} from "@mui/material";
import TextField from "@mui/material/TextField";

// The MenuBar takes in all the event handler functions defined in App.js
// as props, so that they can be called when any of the two menu's options
// are pressed
const MenuBar = (props) => {
    // initializiing important state variables to provide functionality
    // to the menu bars, such as one for each option
    const [fileAnchor, setFileAnchor] = React.useState(null);   //Anchor for file menu
    const [newOpen, setNewOpen] = React.useState(false);    //New dialog state
    const [loadOpen, setLoadOpen] = React.useState(false);    //Load dialog state
    const [saveOpen, setSaveOpen] = React.useState(false);    //Save As dialog state
    const [fileName, setFileName] = React.useState('');    //New File Name
    const fileOpen = Boolean(fileAnchor);   //File Menu state
    
    const [editAnchor, setEditAnchor] = React.useState(null); //Anchor for edit menu
    const editOpen = Boolean(editAnchor);   //Edit Menu state

    // series of event handlers to handle each of the different options for
    // the menu's menu items
    const handleFileClick = (event) => {
        setFileAnchor(event.currentTarget);
    };
    const handleFileClose = () => {
        setFileAnchor(null);
    };

    const handleEditClick = (event) => {
        setEditAnchor(event.currentTarget);
    };
    const handleEditClose = () => {
        setEditAnchor(null);
    };

    // returns styled button for menu and edit, with menu having options to
    // open a new file, load pre-existing file, saving current file under
    // same name, and saving current file under new file name.
    // The edit menu provides cutting of selected data (reset selected array),
    // copying selected data (saving the array to clipboard), and pasting (retrieving
    // saved array from clipboard and appending them to the selected array and dataset)
    // adding them to the dataset)
    return(
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <div>
                        <Button
                            sx={{ bgcolor: 'white', color: 'blue'}}
                            id="basic-button"
                            aria-controls={fileOpen ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={fileOpen ? 'true' : undefined}
                            onClick={handleFileClick}
                        >
                            File
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={fileAnchor}
                            open={fileOpen}
                            onClose={handleFileClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={() => {setNewOpen(true)}} >New</MenuItem>
                            <Dialog open={newOpen} onClose={() => {setNewOpen(false)}} >
                                <DialogTitle>Enter new file name</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        margin="dense"
                                        id="newFileName"
                                        label="File Name"
                                        fullWidth
                                        variant="standard"
                                        onChange={(e) => setFileName(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => {setNewOpen(false); handleFileClose();}} >Cancel</Button>
                                    <Button onClick={() => {props.newFileHandler(fileName); setFileName(''); setNewOpen(false); handleFileClose();}} >Submit</Button>
                                </DialogActions>
                            </Dialog>

                            <MenuItem onClick={() => {setLoadOpen(true);}} >Load</MenuItem>
                            <Dialog open={loadOpen} onClick={() => {setLoadOpen(false)}} >
                                <DialogTitle>Select file to load</DialogTitle>
                                <List sx={{ pt: 0 }}>
                                    {props.files.map((file) => (
                                        <ListItemButton onClick={() => {props.loadHandler(file); handleFileClose();}} key={file}>
                                            <ListItemText primary={file} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Dialog>

                            <MenuItem onClick={() => {props.saveHandler(); handleFileClose();}}>Save</MenuItem>

                            <MenuItem onClick={() => {setSaveOpen(true)}}>Save As</MenuItem>
                            <Dialog open={saveOpen} onClose={() => {setSaveOpen(false)}}>
                                <DialogTitle>Enter File Name</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        label="File Name"
                                        fullWidth
                                        variant="standard"
                                        onChange={(e) => setFileName(e.target.value)}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => {setSaveOpen(false); handleFileClose();}} >Cancel</Button>
                                    <Button onClick={() => {props.saveAsHandler(fileName); setFileName(''); setSaveOpen(false); handleFileClose();}} >Submit</Button>
                                </DialogActions>
                            </Dialog>
                        </Menu>
                        <Button
                            sx={{ bgcolor: 'white', color: 'blue', marginLeft: '10px'}}
                            id="edit-button"
                            aria-controls={editOpen ? 'edit-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={editOpen ? 'true' : undefined}
                            onClick={handleEditClick}
                        >
                            Edit
                        </Button>
                        <Menu
                        id="edit-menu"
                        anchorEl={editAnchor}
                        open={editOpen}
                        onClose={handleEditClose}
                        MenuListProps={{
                            'aria-labelledby': 'edit-button',
                        }}
                        >
                            <MenuItem onClick={() => {props.cutHandler(); handleEditClose();}} >Cut</MenuItem>
                            <MenuItem onClick={() => {props.copyHandler(); handleEditClose();}} >Copy</MenuItem>
                            <MenuItem onClick={() => {props.pasteHandler(); handleEditClose();}} >Paste</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>

            </AppBar>
        </Box>
    );
};

export default MenuBar;
