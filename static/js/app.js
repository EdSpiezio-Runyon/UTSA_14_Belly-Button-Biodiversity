const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Deliver test subject ID number
function init(){
    let select = d3.select("#selDataset");
    d3.json(url).then((data) => {
        jsData = data;
            let subjectID = data.names;
            subjectID.forEach((ID) => {
                select
                .append('option')
                .text(ID)
                .property('value', ID);
            });
    });
    buildMetadata(940);
    buildCharts(940);
};

function optionChanged(newID) {
    buildMetadata(newID);
    buildCharts(newID);
};

// Deliver demographic info
function buildMetadata(ID) {
    let panel = d3.select("#sample-metadata");
    d3.json(url).then(function(data) {

        // Define the metadata
        let metadata = data.metadata;

        // Filter by the ID
        let filteredMetadata = metadata.filter(metaObj => metaObj.id == ID);
        let result = filteredMetadata[0];

        // Create the panel
        panel.html("");
        panel.append("h6").text("ID: " + result.id);
        panel.append("h6").text("ETHNICITY: " + result.ethnicity);
        panel.append("h6").text("GENDER: " + result.gender);
        panel.append("h6").text("AGE: " + result.age);
        panel.append("h6").text("LOCATION: " + result.location);
        panel.append("h6").text("BBTYPE: " + result.bbtype);
        panel.append("h6").text("WFREQ: " + result.wfreq);

        // Create the gauge chart
        // Define variable for washing frequency
        var washFrequency = filteredMetadata.wfreq;

        // Create trace
        var gauge_data = [{
               domain: { x: [0, 1], y: [0,1] },
                value: washFrequency,
                title: { text: "Washing Frequency (No. of Times per Week)" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    bar: {color: 'white'},
                    axis: { range: [null, 9] },
                    steps: [
                        { range: [0, 2], color: 'rgb(250,189,110)' },
                        { range: [2, 4], color: 'rgb(210,152,93)' },
                        { range: [4, 6], color: 'rgb(169,116,76)' },
                        { range: [6, 8], color: 'rgb(129,79,59)' },
                        { range: [8, 10], color: 'rgb(88,42,42)' },
                    ],
                }
            }
        ];

        // Define layout for plot
        var gauge_layout = {
            width: 500,
            height: 400,
            margin: { t: 0, b: 0 } };

        // Diplay the plot
        Plotly.newPlot('gauge', gauge_data, gauge_layout);
    });
};

// Create charts
function buildCharts(ID) {
    d3.json(url).then((data) => {

        // Define the samples
        let sample = data.samples

        // Filter samples by ID
        let filteredSample = sample.filter(bacteria => bacteria.id == ID)[0];
            
        // Create bar chart
        // Create variables
        let sample_values = filteredSample.sample_values
        let otu_ids = filteredSample.otu_ids
        let otu_labels = filteredSample.otu_labels

        // Create trace
        var bar_chart_data = [{

            // Defining the x-values as the sample_values
            x: sample_values.slice(0, 10).reverse(),

            // Defining the y-values as the sample_ids
            y: otu_ids.slice(0, 10).map(otu_ids => `OTU ${otu_ids}`).reverse(),

            // Defining text values as sample_labels
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
        }]

        // Define layout for plot
        var bar_chart_layout = {
            title: "Top 10 Microbial Species Found in Belly Buttons",
            xaxis: { title: "Bacteria Sample Values" },
            yaxis: { title: "Sample IDs" }
        };

        // Display the plot
        Plotly.newPlot('bar', bar_chart_data, bar_chart_layout)

        // Create bubble chart
        // Create trace
        var bubble_chart_data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                // Defining marker colors by sample_ids
                color: otu_ids,
                size: sample_values,
                colorscale: 'Electric'
            }
        }];

        // Define layout for plot
        var bubble_chart_layout = {
            title: "Belly Button Samples",
            xaxis: { title: "Sample IDs" },
            yaxis: { title: "Sample Values" }
        };

        // Display the plot
        Plotly.newPlot('bubble', bubble_chart_data, bubble_chart_layout)
    });
};

init();