/*
 * Project 2
 * BarChart component JavaScript source code
 *
 * Author: Shreya Ashok Kumar
 * Version: 1.0
 */
// BarChart view is the right-hand side view which provides a bar chart
// data visualization for the selected dataset from the database
import './BarChart.css';
import React, {useState, useEffect} from 'react';
import { Box } from '@mui/system';
import Tooltip from '@mui/material/Tooltip';
import * as d3 from 'd3';

let svg = null;

let didMount = true;
// initializes all variables needed to configure the svg elements
// in order to display the data visualization, such as viewbox, title,
// labels, values, their titles, and the bars for the barchart
const settings = {
    viewBox: {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    },
    title: {
        x: 0,
        y: 0,
        width: 100,
        height: 10,
        baseline: 5
    },
    labels: {
        x: 9,
        y: 91,
        width: 91,
        height: 5,
        baseline: 2,
        length: 0.5
    },
    labelsTitle: {
        x: 5,
        y: 96,
        width: 95,
        height: 4,
        baseline: 2,
        text: "",
    },
    valuesTitle: {
        x: 0,
        y: 6,
        width: 4,
        height: 90,
        baseline: 2,
        text: "",
    },
    values: {
        x: 4,
        y: 6,
        width: 5,
        height: 90,
        baseline: 4.5,
        min: 0,
        max: 7,
        step: 0.5
    },
    lines: {
        margin: 1.5
    },
    bars: {
        x: 9,
        y: 10,
        width: 91,
        height: 85,
        ratio: 0.7
    },
    tooltip: {
        height: 8,
        padding: 2,
        spacing: "1.2em",
        width: 24
    }
};

// BarChart function, takes in props the selectElement function from App.js,
// which is called using the event handler when the mouse is clicked on any
// of the bars, and it also takes in the selected state array as well as
// the dataset to display
const BarChart = (props) => {
    let myReference = React.createRef();
    let dataset = props.dataset;
    const [toolTip, setToolTip] = useState(null);
  const handleSelected = (item, index) => {
    props.selectHandler(item, index);
  };

    // obtaining max value in dataset and axes labels
    if (dataset) {
    	settings.values.max = Math.max(...dataset.data.map(x => Object.values(x)[1]));
        settings.labelsTitle.text = Object.keys(dataset.data[0])[0];
            settings.valuesTitle.text = Object.keys(dataset.data[0])[1];
    }

    // init function is called to initialize and draw all svg elements
    // during rendering; it initializes the container for the svg and the
    // viewbox dimensions for the entire data visualization
    const init = () => {
        
        let container = d3.select(myReference.current);
        container
            .selectAll("*")
            .remove();
        svg = container
            .append("svg")
            .attr("viewBox", settings.viewBox.x + " " + settings.viewBox.y + " " + settings.viewBox.width + " " + settings.viewBox.height)
            .attr("preserveAspectRatio", "none")
            .style("width", "100%")
            .style("height", "100%")
            .style("border", "none");
        
        
    }

    // paint function is called inside of useEffect so that any changes triggers
    // redraw of all svg elements with the updated dataset and selected array
    // propogated here
    const paint = () => {
    	if (!dataset) {
    		return;
    	}
        // tooltip configuratipn
        const createTooltip = (s) => {
            let t = s
                .append("g")
                .attr("id", "tooltip")
            t
                .append("rect")
                .attr("width", settings.tooltip.width)
                .attr("height", settings.tooltip.height)
            
            let text = t
                .append("text")

            text
                .append("tspan")
                .attr("id", "attribute1")
                .attr("x", settings.tooltip.padding)
                .attr("dy", "1.2em")

                text
                .append("tspan")
                .attr("id", "attribute2")
                .attr("x", settings.tooltip.padding)
                .attr("dy", settings.tooltip.spacing)

            return t;
        }
        // tooltip initialization
        const tooltip = createTooltip(svg);

        // setting attributes for the tooltip using dataset
        const setTooltip = (t, i) => {
            console.log("i", i);
            let o = i;
            console.log("o", o);
            console.log("t", t);
            const t1 = Object.keys(o)[0] + ": " + Object.values(o)[0];
            const t2 = Object.keys(o)[1] + ": " + Object.values(o)[1];
            let w1 = t.select("#attribute1").text(Object.keys(o)[0] + ": " + Object.values(o)[0]);
            let w2 = t.select("#attribute2").text(Object.keys(o)[1] + ": " + Object.values(o)[1]);
            settings.tooltip.width = 100;
            t   
                .select("rect")
                .attr("width", settings.tooltip.width)
                .attr("height", settings.tooltip.height)
        }

        // calculating position of tooltip, takes in the tooltip and index
        // of the barchart bars
        const transformTooltip = (t, xy) => {
            let tx = xy[0] - settings.tooltip.width - 1;
            if (tx < 0) {
                tx = 0;
            }
            let ty = xy[1] - settings.tooltip.height - 1;
            if (ty < 0) {
                ty= 0;
            }
            t.attr("transform", "translate(" + tx + "," + ty + ")");
        }

        // drawing of more svg elements onto the webpage
        svg
            .selectAll("*")
            .remove();
        svg
            .append("g")
            .attr("id", "lines")
            .selectAll("line")
            .data(d3.range((settings.values.max - settings.values.min) / settings.values.step))
            .enter()
            .append("line")
            .attr("x1", settings.values.x + settings.values.width)
            .attr("x2", settings.values.x + settings.values.width + settings.bars.width - settings.lines.margin )
            .attr("y1", (item, index) => {
                return settings.labels.y - index * settings.bars.height / ((settings.values.max - settings.values.min) / settings.values.step);
            })
            .attr("y2", (item, index) => {
                return settings.labels.y - index * settings.bars.height / ((settings.values.max - settings.values.min) / settings.values.step);
            });
        
        // drawing the bars
        svg
            .append("g")
            .attr("id", "bars")
            .selectAll("rect")
            .data(dataset.data)
            .enter()
            .append("rect")
            .attr("x", (item , index) => {
                return settings.bars.x + (1 - settings.bars.ratio + index) * settings.bars.width / (dataset.data.length + 1 - settings.bars.ratio);
            })
            .attr("y", (item , index) => {
                return settings.labels.y - Object.values(item)[1] * settings.bars.height / (settings.values.max - settings.values.min);
            })
            .attr("width", settings.bars.ratio * settings.bars.width / (dataset.data.length + 1 - settings.bars.ratio))
            .attr("height", (item , index) => {
                return Object.values(item)[1] * settings.bars.height / (settings.values.max - settings.values.min);
            })
            .on("click", (e, item, index) => {
                console.log("clicked", index);
                console.log("item", item);
                const itemIndex = props.dataset.data.indexOf(item);
                console.log("item v2", itemIndex);
                handleSelected(item, itemIndex);
              })
              .attr("fill", (item, index) => {
                    
                return props.selectedBars.includes(index) ? "red" : "dodgerblue";
              })
            .append("title")
            .text(function(item, index) {
                return 'Year: ' + Object.values(item)[0] + ', Population: ' + Object.values(item)[1];
            });
        
              svg
              .append("g")
              .attr("id", "otherTitles")
              .append("text")
              .attr("x", (settings.labelsTitle.x + settings.labelsTitle.width + settings.labelsTitle.text.length) / 2)
              .attr("y", settings.labelsTitle.y + settings.labelsTitle.height - settings.labelsTitle.baseline)
              .text(settings.labelsTitle.text);
          
          svg
              .append("g")
              .attr("id", "otherTitles")
              .selectAll("text")
              .data(settings.valuesTitle.text.split(""))
              .enter()
              .append("text")
              .attr("x", (item, index) => {
                  return (settings.valuesTitle.x + settings.valuesTitle.width) / 2
              })
              .attr("y", (item, index) => {
                  return (settings.valuesTitle.y - settings.valuesTitle.text.length + settings.valuesTitle.height - settings.labelsTitle.baseline) / 2 + (index * 2.5)
              })
              .text((item) => {
                  return item
              });

        svg
            .append("g")
            .attr("id", "title")
            .append("text")
            .attr("x", (settings.title.x + settings.title.width) / 2)
            .attr("y", settings.title.y + settings.title.height - settings.title.baseline)
            .text(dataset.title);

        svg
            .append("g")
            .attr("id", "labels")
            .selectAll("text")
            .data(dataset.data)
            .enter()
            .append("text")
            .attr("x", (item , index) => {
                return settings.labels.x + (1 - settings.bars.ratio + index + settings.bars.ratio / 2) * settings.bars.width / (dataset.data.length + 1 - settings.bars.ratio);
            })
            .attr("y", settings.labels.y + settings.labels.height - settings.labels.baseline)
            .text((item, index) => {
                return Object.values(item)[0];
            });

        svg
            .append("g")
            .attr("id", "values")
            .selectAll("text")
            .data(d3.range((settings.values.max - settings.values.min) / settings.values.step))
            .enter()
            .append("text")
            .attr("x", settings.values.x + settings.values.width / 2)
            .attr("y", (item, index) => {
                return settings.values.y + settings.values.height - settings.values.baseline - index * settings.bars.height / ((settings.values.max - settings.values.min) / settings.values.step);
            })
            .text((item, index) => {
                return (item / 2.0).toFixed(1);
            });

    }

    // useEffect is used to first mount the svg element, and then the svg gets
    // repainted whenever the window gets resized
    useEffect(() => {
        if (didMount) {
            didMount = false;
            init();
            window.addEventListener('resize', () => {
                paint();
            })
        }
        paint();
    }, [props.selectedBars]);

    // returning a box which contains the svg element as well as specifying the
    // tooltip
    return(
            <Box ref={myReference} sx={props.sx} >
                <div style={{ display: 'none' }}>
                {toolTip && (
                    <Tooltip title={`Year: ${toolTip.year}, Population: ${toolTip.population}`}>
                        <div />
                    </Tooltip>
                )}
            </div>
            </Box>
    );

}

export default BarChart;
