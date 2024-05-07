/*
 * Project 2
 * App component JavaScript source code
 *
 * Author: Shreya Ashok Kumar
 * Version: 1.0
 */
// App is the parent which calls all the other javascript files
// to display the menubar with menu and edit options, and the different
// data visualization views
import './App.css';
import React, {useState, useEffect} from 'react';
import Item from './Item.js';
import MenuBar from './MenuBar.js';
import BarChart from './BarChart.js';
import ScatterPlot from './ScatterPlot.js';
import Editor from './Editor.js';
import {Box, Container} from "@mui/system";
import axios from 'axios';

const App = (props) => {

    // initializing important state variables so that the page can get updated
    // whenver changes occur to the states
    const [selected, setSelected] = useState([]); //Selected elements
    const [isInitialized, setIsInitialized] = useState(false); // initializing page
    const [files, setFiles] = useState([]); // list of files in the database
    const [data, setData] = useState([]); // list of all datasets in database
    const [currentData, setCurrentData] = useState([]); //list of all data points and attributes
    // located for this dataset in the database

    // useEffect page is initialized by first retrieving all datasets located in the database
    // and using that to initialize state variables files and data
    // the world population dataset is loaded by default when page gets rendered
    useEffect(() => {
        if (!isInitialized) {
            setIsInitialized(true);
            document.title = 'Project 2: shreyaak19';
        	localStorage.clear();
            axios.get('http://localhost:3000/db/find').then(res => {
            const newFiles = [];
            const newData = [];
            // inserting each dataset into state variables obtained by response
            res.data.forEach(item => {
                newFiles.push(item.fileName);
                newData.push(item);
            });
            setFiles(newFiles);
            setData(newData, () => {
                loadDataset(newData[2].fileName);
            });
            console.log("selected", selected);
        });
    }
    });
    // loading page to display world popultion data in views and editor table
    useEffect(() => {
        if (isInitialized && files.length > 0) {
            loadDataset(data[2].fileName);
        }
    }, [isInitialized, files]);

    //Loading dataset function, finds the dataset with the passed in filename,
    // and sets the current data to be that dataset along with making selected
    // array reset to be empty
    const loadDataset = (fileName) => {
        const item = data.find(item => item.fileName === fileName);
            if (item) {
                setSelected([]);
                // setCurrentFile(fileName);
                setCurrentData(item);
            }
    }

    //Open New File, handler that is called by MenuBar when the user wants to
    // load a new dataset. A new document is created in the database using post
    // request with a generated id, and views are set accordingly
    const newDataset = (fileName) => {
        const newCurrentData = {...currentData};
        newCurrentData._id = undefined;
        newCurrentData.fileContent.title = null;
        newCurrentData.fileContent.data = [];
        newCurrentData.fileName = fileName;
        setCurrentData(newCurrentData);
        axios.post('http://localhost:3000/db/create', newCurrentData)
            .then(res => {
                console.log(res.data);
            })
        setSelected([]);
    }

    //Save Current File, event handler that is called by BarChart when a
    // user want to save the current dataset to the database under the same file
    // name. This is done by using the update message and submitting a post request
    // with the currentData state.
    const saveDataset = () => {
        axios.post('http://localhost:3000/db/update/' + currentData._id, currentData)
            .then(res => {
                console.log(res.data);
            });
    }

    //Save File with new name, event handler that is called by BarChart when a
    // user wants to save the current databset to the database under a new file
    // name, this is doen by using the update message and submitting
    // a post request. The currentData with fileName changed is sent as well to
    // be put into the database
    const saveAsDataset = (fileName) => {
        const newCurrentData = {...currentData, fileName: fileName};
        setCurrentData(newCurrentData);
        axios.post('http://localhost:3000/db/update/' + newCurrentData._id, newCurrentData)
            .then(res => {
                console.log(res.data);
            });
    }

    // event handler that is called by MenuBar when the user picks on Edit->Cut
    // option. This simply resets all selected data points to none
    const cutDataset = () => {
        setSelected([])
    }

    // event handler that is called by MenuBar when the user picks on Edit->Copy
    // saves the current selected array state to clipboard for future access
    const copyDataset = () => {
        if (selected != []) {
        navigator.clipboard.writeText(selected);
        console.log('Selected data copied to clipboard:', selected);
        }
    }

    // event handler that is called by MenuBar when the user picks on Edit->Paste
    // adds the selected array that was previously saved to the clipboard by copy
    // to the selected array and adds those data points to currentData.
    const pasteDataset = async () => {
        if (selected != null) {
        const retrieve = await navigator.clipboard.readText();
        const getRetrieve = retrieve.split(',').map((item) => parseInt(item));
        let newSelected = [...selected];
        let newData = {...currentData.fileContent};
        getRetrieve.forEach((item) => {
            newData.data.push(newData.data[item]);
            newSelected.push(newData.data.length - 1);

        });
        const newCurrentData = {...currentData, fileContent: newData}
        setCurrentData(newCurrentData);
        setSelected(newSelected);
        }
    }

    //Change Chart Title, event handler that is called by Editor when the table
    // sees a change in title textfield, sets the new title field of currentData
    const changeTitle = (e) => {
        const newData = {...currentData.fileContent};
        newData.title = e.target.value;
        const newCurrentData = {...currentData, fileContent: newData};
        setCurrentData(newCurrentData);
    }

    //Change X label, event handler that is called by Editor when the table
    // sees a change in x label textfield, sets the new x label field of currentData
    const changeXLabel = (e) => {
        const newData = {...currentData.fileContent};
        newData.data = currentData.fileContent.data.map(
            (x, i) =>
            {return {[e.target.value] : Object.values(currentData.fileContent.data[i])[0], [Object.keys(currentData.fileContent.data[0])[1]] : Object.values(currentData.fileContent.data[i])[1]}}
        );
        const newCurrentData = {...currentData, fileContent: newData};
        setCurrentData(newCurrentData);
    }

    //Change Y Label, event handler that is called by Editor when the table
    // sees a change in y label textfield, sets the new y label field of currentData
    const changeYLabel = (e) => {
        const newData = {...currentData.fileContent};
        newData.data = currentData.fileContent.data.map(
            (x, i)=>
            {return {[Object.keys(currentData.fileContent.data[0])[0]] : Object.values(currentData.fileContent.data[i])[0], [e.target.value] : Object.values(currentData.fileContent.data[i])[1]}}
        );
        const newCurrentData = {...currentData, fileContent: newData};
        setCurrentData(newCurrentData)
    }

    //Add a new row, event handler that is called by Editor when the add button
    // is pressed, adds a new data point to currentData
    const addElement = (newX, newY) => {
        let c1 = Object.keys(currentData.fileContent.data[0])[0];
        let c2 = Object.keys(currentData.fileContent.data[0])[1];
        const newRow = {[c1]:newX, [c2]:newY};
        const newData = {...currentData.fileContent};
        newData.data.push(newRow);
        const newCurrentData = {...currentData, fileContent: newData};
        setCurrentData(newCurrentData);
    };

    //Delete a row, event handler that is called by Editor when the delete button
    // for any row is pressed, deletes the selected data point from currentData
    const deleteElement = (index) => {
        if (currentData.fileContent.data.length > 1) {
            const newData = {...currentData.fileContent};
            newData.data = currentData.fileContent.data.filter((x, i) => {return i !== index});
            const newCurrentData = { ...currentData, fileContent: newData };
            setCurrentData(newCurrentData);
        }
    };

    //Edit a row, updates currentData with the changed data point (event handler
    //called by Editor)
    const editElement = (newVal, index, xVal) => {
        console.log('Edit Elem: ', index, newVal, xVal);
        let c1 = Object.keys(currentData.fileContent.data[0])[0];
        let c2 = Object.keys(currentData.fileContent.data[0])[1];
        const newData = {...currentData.fileContent};
        xVal ? newData.data[index][c1] = newVal : newData.data[index][c2] = newVal;
        const newCurrentData = {...currentData, fileContent: newData};
        setCurrentData(newCurrentData);
    };

    //Select with checkboxes, event handler called by any of the views when any
    // data points are selected, the selected data point is added to the selected
    // state array. This triggers the data visualization views to change the color
    // of the svg element to be red (linking)
    const selectElement = (e, index) => {
        console.log("clicked");
        let newSelected = [...selected];
        if (newSelected.includes(index) == false) {
        newSelected.push(index);
        }
        else {
            const deleteSelected = newSelected.filter((i) => i !== index);
            newSelected = deleteSelected;
        }
  setSelected(newSelected);
  console.log("selected", selected);
    };

    // creating all aspects of this project such as MenuBar, Item, BarChart, ScatterPlot, and Editor
    // the corresponding datasrt is passed to every element except for Item and MenuBar
    // and the appropriate event handlers are passed down via props as well. Selected
    // array is passed down to establish brushing (changing selected data in oen view
    // updates it in all other views)
    return (
        <Container className="App" >
            <MenuBar
                loadHandler={loadDataset}
                newFileHandler={newDataset}
                saveHandler={saveDataset}
                saveAsHandler={saveAsDataset}
                cutHandler={cutDataset}
                copyHandler={copyDataset}
                pasteHandler={pasteDataset}
                files={files}
            >
            </MenuBar>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }} >
                <Item>
                    <Editor
                        dataset={currentData.fileContent}
                        sx={{bgcolor: 'white', width: '100%', height: '100%'}}
                        addElementHandler={addElement}
                        deleteElementHandler={deleteElement}
                        editElementHandler={editElement}
                        selected={selected}
                        selectHandler={selectElement}
                        titleHandler={changeTitle}
                        xLabelHandler={changeXLabel}
                        yLabelHandler={changeYLabel}
                    />
                </Item>
                <Item>
                <BarChart 
                dataset={currentData.fileContent}
                selectedBars={selected}
                selectHandler={selectElement}
                sx={{
                    bgcolor: 'white', width: '100%', height: '100%'
                }}>
                </BarChart>
                </Item>
                <Item sx={{gridColumn: '2', gridRow: '2'}}>
                <ScatterPlot
                dataset={currentData.fileContent}
                selectedBars={selected}
                selectHandler={selectElement}
                sx={{
                    bgcolor: 'white', width: '100%', height: '100%'
                }}>
                </ScatterPlot>
                </Item>
            </Box>
        </Container>
    );

}

export default App;
