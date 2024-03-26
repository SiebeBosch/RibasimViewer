function populateWaterbalanceTable(ModelID) {
  if (ModelID) {
    let table = document.getElementById("stats_table");
    table.innerHTML = ""; // Clear all existing content
    var header = table.createTHead();
    var row = header.insertRow(0);
    var cell = row.insertCell(0);
    cell.innerHTML = "<b>Balance item</b>";

    // Set up the header row with scenario names for inflow and outflow
    var nScenarios = Waterbalance.scenarios.length;
    for (let i = 0; i < nScenarios; i++) {
      let scenario = Waterbalance.scenarios[i];
      let cellIn = row.insertCell(1 + i * 2);
      cellIn.innerHTML = "<b>" + scenario.scenario + " In (m3)</b>";
      let cellOut = row.insertCell(2 + i * 2);
      cellOut.innerHTML = "<b>" + scenario.scenario + " Out (m3)</b>";
    }

    // Assuming AreaID is the same as ModelID and that ModelID's balance data is always present
    let area = Waterbalance.scenarios[0].balance.find(a => a.AreaID === ModelID);
    if (!area) {
      alert("Area not found");
      return;
    }

    // Initialize arrays to keep track of totals for each scenario
    let totalIn = new Array(nScenarios).fill(0);
    let totalOut = new Array(nScenarios).fill(0);

    // For each link in the area, insert rows and calculate totals
    area.links.forEach(link => {
      let row = table.insertRow();
      let cell = row.insertCell(0);
      cell.innerHTML = link.ID;

      for (let i = 0; i < nScenarios; i++) {
        let scenario = Waterbalance.scenarios[i];
        let linkData = scenario.balance.find(a => a.AreaID === ModelID).links.find(l => l.ID === link.ID);

        // Calculate sums for inflow and outflow
        let sumIn = linkData.in.reduce((a, b) => a + b, 0);
        let sumOut = linkData.out.reduce((a, b) => a + b, 0);

        // Add to total sums for the scenario
        totalIn[i] += sumIn;
        totalOut[i] += sumOut;

        let cellIn = row.insertCell(1 + i * 2);
        cellIn.innerHTML = sumIn.toFixed(0); // toFixed(0) for 0 decimal places
        let cellOut = row.insertCell(2 + i * 2);
        cellOut.innerHTML = sumOut.toFixed(0);
      }
    });


    // Insert a row for balance errors
    let errorRow = table.insertRow();
    let errorCell = errorRow.insertCell(0);
    errorCell.innerHTML = "<b>Balance Error</b>";

    // And insert a row for the total
    let totalRow = table.insertRow();
    let totalCell = totalRow.insertCell(0);
    totalCell.innerHTML = "<b>Total</b>";

    for (let i = 0; i < nScenarios; i++) {
      // Calculate balance error for the scenario
      let balanceError = totalIn[i] + totalOut[i]; //since totalout is negative we must add up both sides of the balance in order to get the Error
      let errorIn;
      let errorOut;

      if (balanceError < 0) {
        errorIn = -balanceError;
        errorOut = 0;
      } else {
        errorIn = 0;
        errorOut = -balanceError;
      }

      //calculate and write the balance error to the table
      let cellIn = errorRow.insertCell(1 + i * 2);
      cellIn.innerHTML = balanceError < 0 ? `<b>${errorIn.toFixed(0)}</b>` : 0;
      let cellOut = errorRow.insertCell(2 + i * 2);
      cellOut.innerHTML = balanceError > 0 ? `<b>${errorOut.toFixed(0)}</b>` : 0;

      //write the totals to the table so the user can see both sides match
      let totalInCell = totalRow.insertCell(1 + i * 2);
      totalInCell.innerHTML = `<b>${(totalIn[i] + errorIn).toFixed(0)}</b>`
      let totalOutCell = totalRow.insertCell(2 + i * 2);
      totalOutCell.innerHTML = `<b>${(totalOut[i] + errorOut).toFixed(0)}</b>`

    }


    document.getElementById('stats_table').style.display = "block";

  } else {
    alert("ModelID is missing");
  }
}



function populateTable1D(ModelID, objectType, parameterIdx) {

  console.log("populating statistics table");

  if (ModelID) {

    //get the object containing observed data for this object
    let myMeas = measurements.locations.find(x => x.ModelID === ModelID);

    //initialize our table for the results statistics
    let table = document.getElementById("stats_table");
    table.innerHTML = "";                                           //clear all existing content
    var header = table.createTHead()
    var row = header.insertRow(0);
    var cell = row.insertCell(0);
    cell.innerHTML = "";

    let ObsMax;
    let SimMax;
    let ObsDates;
    let ObsValues;
    let nScenarios;

    //set the chart's title and populate its statistics section
    let backwater = parameterIdx == 1 ? "headloss" : "discharge";

    switch (objectType) {
      case 'observationpoint':
        nScenarios = Observationpointresults.scenarios.length;
        cell = row.insertCell(1);
        cell.innerHTML = "H.max.sim.";
        cell = row.insertCell(2);
        cell.innerHTML = "H.max.obs.";
        cell = row.insertCell(3);
        cell.innerHTML = "H.max.diff.";
        if (myMeas) {
          ObsMax = Math.max(...myMeas.h.values);
          ObsDates = myMeas.h.dates;
          ObsValues = myMeas.h.values;
        }
        break;
      case 'calculationpoint':
        nScenarios = CalcpntResults.scenarios.length;
        cell = row.insertCell(1);
        cell.innerHTML = "H.max.sim.";
        cell = row.insertCell(2);
        cell.innerHTML = "H.max.obs.";
        cell = row.insertCell(3);
        cell.innerHTML = "H.max.diff.";
        if (myMeas) {
          ObsMax = Math.max(...myMeas.h.values);
          ObsDates = myMeas.h.dates;
          ObsValues = myMeas.h.values;
        }
        break;
      case 'structure':
        nScenarios = StructureResults.scenarios.length;
        cell = row.insertCell(1);
        cell.innerHTML = "Q.max.sim.";
        cell = row.insertCell(2);
        cell.innerHTML = "Q.max.obs.";
        cell = row.insertCell(3);
        cell.innerHTML = "Q.max.diff.";
        if (myMeas) {
          ObsMax = Math.max(...myMeas.Q.values);
          ObsDates = myMeas.Q.dates;
          ObsValues = myMeas.Q.values;
        }
        break;
      case 'wqpoint':
        nScenarios = WQResults.scenarios.length;
        cell = row.insertCell(1);
        cell.innerHTML = "Conc.max.sim.";
        cell = row.insertCell(2);
        cell.innerHTML = "Conc.max.obs.";
        cell = row.insertCell(3);
        cell.innerHTML = "Conc.max.diff.";
        if (myMeas) {
          ObsMax = Math.max(...myMeas.C.values);
          ObsDates = myMeas.C.dates;
          ObsValues = myMeas.C.values;
        }
        break;
      case 'Basin':
        nScenarios = IWRMNodeResults.scenarios.length;
        console.log("nScenarios is now ", nScenarios);
        cell = row.insertCell(1);
        cell.innerHTML = "H.max.sim.";
        cell = row.insertCell(2);
        cell.innerHTML = "H.max.obs.";
        cell = row.insertCell(3);
        cell.innerHTML = "H.max.diff.";
        if (myMeas) {
          ObsMax = Math.max(...myMeas.h.values);
          ObsDates = myMeas.h.dates;
          ObsValues = myMeas.h.values;
        }
        break;
      case 'ManningResistance':
        nScenarios = IWRMNodeResults.scenarios.length;
        console.log("nScenarios is now ", nScenarios);
        cell = row.insertCell(1);
        cell.innerHTML = parameterIdx == 1 ? "&#916H.max.sim." : "Q.max.sim.";
        cell = row.insertCell(2);
        cell.innerHTML = parameterIdx == 1 ? "&#916H.max.obs." : "Q.max.obs.";
        cell = row.insertCell(3);
        cell.innerHTML = parameterIdx == 1 ? "&#916H.max.diff." : "Q.max.diff.";
        if (myMeas) {
          ObsMax = Math.max(...myMeas.h.values);
          ObsDates = myMeas.h.dates;
          ObsValues = myMeas.h.values;
        }
        break;
      case 'TabulatedRatingCurve':
        nScenarios = IWRMNodeResults.scenarios.length;
        console.log("nScenarios is now ", nScenarios);
        cell = row.insertCell(1);
        cell.innerHTML = parameterIdx == 1 ? "&#916H.max.sim." : "Q.max.sim.";
        cell = row.insertCell(2);
        cell.innerHTML = parameterIdx == 1 ? "&#916H.max.obs." : "Q.max.obs.";
        cell = row.insertCell(3);
        cell.innerHTML = parameterIdx == 1 ? "&#916H.max.diff." : "Q.max.diff.";
        if (myMeas) {
          ObsMax = Math.max(...myMeas.h.values);
          ObsDates = myMeas.h.dates;
          ObsValues = myMeas.h.values;
        }
        break;
      case 'FlowBoundary':
        // TODO Create function to populate FlowBoundary table
        break;
      case 'Terminal':
        // TODO Create function to populate Terminal table
        break;
      default:
      // code block
    }

    //decide which results to iterate through
    switch (objectType) {
      case 'observationpoint':
        for (let scenarioIdx = 0; scenarioIdx < Observationpointresults.scenarios.length; scenarioIdx++) {

          let myFeature;
          let simSeries;  //the simulated timeseries
          let scenario;   //the simulated scenario

          scenario = Observationpointresults.scenarios[scenarioIdx];
          myFeature = scenario.features.find(x => x.id === ModelID);
          if (myFeature) {
            SimMax = Math.max(...myFeature.waterlevel);
            simSeries = myFeature.waterlevel;
          }

          if (myFeature) {
            row = table.insertRow(1);
            cell = row.insertCell(0);
            cell.innerHTML = scenario.scenario;
            cell = row.insertCell(1);
            cell.innerHTML = RoundNumber(SimMax, 2);
            cell = row.insertCell(2);
            cell.innerHTML = RoundNumber(ObsMax, 2);
            cell = row.insertCell(3);
            if (myMeas) {
              cell.innerHTML = RoundNumber(SimMax - ObsMax, 2);
            }
          }
        }
        break;

      case 'calculationpoint':

        for (let scenarioIdx = 0; scenarioIdx < CalcpntResults.scenarios.length; scenarioIdx++) {

          let myFeature;
          let simSeries;  //the simulated timeseries
          let scenario;   //the simulated scenario

          scenario = CalcpntResults.scenarios[scenarioIdx];
          myFeature = scenario.features.find(x => x.id === ModelID);
          if (myFeature) {
            SimMax = Math.max(...myFeature.waterlevel);
            simSeries = myFeature.waterlevel;
          }

          if (myFeature) {
            row = table.insertRow(1);
            cell = row.insertCell(0);
            cell.innerHTML = scenario.scenario;
            cell = row.insertCell(1);
            cell.innerHTML = RoundNumber(SimMax, 2);
            cell = row.insertCell(2);
            cell.innerHTML = RoundNumber(ObsMax, 2);
            cell = row.insertCell(3);
            if (myMeas) {
              cell.innerHTML = RoundNumber(SimMax - ObsMax, 2);
            }
          }
        }
        break;

      case 'structure':

        for (let scenarioIdx = 0; scenarioIdx < StructureResults.scenarios.length; scenarioIdx++) {

          let myFeature;
          let simSeries;  //the simulated timeseries
          let scenario;   //the simulated scenario

          scenario = StructureResults.scenarios[scenarioIdx];
          myFeature = scenario.features.find(x => x.id === ModelID);
          if (myFeature) {
            SimMax = Math.max(...myFeature.discharge);
            simSeries = myFeature.discharge;
          }

          if (myFeature) {
            row = table.insertRow(1);
            cell = row.insertCell(0);
            cell.innerHTML = scenario.scenario;
            cell = row.insertCell(1);
            cell.innerHTML = RoundNumber(SimMax, 2);
            cell = row.insertCell(2);
            cell.innerHTML = RoundNumber(ObsMax, 2);
            cell = row.insertCell(3);
            if (myMeas) {
              cell.innerHTML = RoundNumber(SimMax - ObsMax, 2);
            }
          }
        }
        break;

      case 'wqpoint':
        for (let scenarioIdx = 0; scenarioIdx < WQResults.scenarios.length; scenarioIdx++) {

          let myFeature;
          let simSeries;  //the simulated timeseries
          let scenario;   //the simulated scenario

          scenario = WQResults.scenarios[scenarioIdx];
          myFeature = scenario.substances[parameterIdx].features.find(x => x.i === ModelID);

          if (myFeature) {
            SimMax = Math.max(...myFeature.values);
            simSeries = myFeature.values;
          }

          if (myFeature) {

            row = table.insertRow(1);
            cell = row.insertCell(0);
            cell.innerHTML = scenario.scenario;
            cell = row.insertCell(1);
            cell.innerHTML = RoundNumber(SimMax, 2);
            cell = row.insertCell(2);
            cell.innerHTML = RoundNumber(ObsMax, 2);
            cell = row.insertCell(3);
            if (myMeas) {
              cell.innerHTML = RoundNumber(SimMax - ObsMax, 2);
            }
          }
        }
      case 'Basin':

        for (let scenarioIdx = 0; scenarioIdx < IWRMNodeResults.scenarios.length; scenarioIdx++) {

          let myFeature;
          let simSeries;  //the simulated timeseries
          let scenario;   //the simulated scenario

          scenario = IWRMNodeResults.scenarios[scenarioIdx];
          myFeature = scenario.features.find(x => x.id == ModelID);
          if (myFeature) {
            SimMax = Math.max(...myFeature.level);
            simSeries = myFeature.level;
          }

          if (myFeature) {
            row = table.insertRow(1);
            cell = row.insertCell(0);
            cell.innerHTML = scenario.scenario;
            cell = row.insertCell(1);
            cell.innerHTML = RoundNumber(SimMax, 2);
            cell = row.insertCell(2);
            cell.innerHTML = RoundNumber(ObsMax, 2);
            cell = row.insertCell(3);
            if (myMeas) {
              cell.innerHTML = RoundNumber(SimMax - ObsMax, 2);
            }
          }
        }
        break;
      case 'ManningResistance':
        for (let scenarioIdx = 0; scenarioIdx < IWRMNodeResults.scenarios.length; scenarioIdx++) {

          let myFeature;
          let simSeries;  //the simulated timeseries
          let scenario;   //the simulated scenario

          scenario = IWRMNodeResults.scenarios[scenarioIdx];
          myFeature = scenario.features.find(x => x.id == ModelID);
          if (myFeature) {
            if (backwater == "headloss") {
              SimMax = Math.max(...myFeature.headloss);
              simSeries = myFeature.headloss;
            } else {
              SimMax = Math.max(...myFeature.discharge);
              simSeries = myFeature.discharge;
            }
          }

          if (myFeature) {
            row = table.insertRow(1);
            cell = row.insertCell(0);
            cell.innerHTML = scenario.scenario;
            cell = row.insertCell(1);
            cell.innerHTML = RoundNumber(SimMax, 2);
            cell = row.insertCell(2);
            cell.innerHTML = RoundNumber(ObsMax, 2);
            cell = row.insertCell(3);
            if (myMeas) {
              cell.innerHTML = RoundNumber(SimMax - ObsMax, 2);
            }
          }
        }
        break;
      case 'TabulatedRatingCurve':
        for (let scenarioIdx = 0; scenarioIdx < IWRMNodeResults.scenarios.length; scenarioIdx++) {

          let myFeature;
          let simSeries;  //the simulated timeseries
          let scenario;   //the simulated scenario

          scenario = IWRMNodeResults.scenarios[scenarioIdx];
          myFeature = scenario.features.find(x => x.id == ModelID);
          if (myFeature) {
            if (backwater == "headloss") {
              SimMax = Math.max(...myFeature.headloss);
              simSeries = myFeature.headloss;
            } else {
              SimMax = Math.max(...myFeature.discharge);
              simSeries = myFeature.discharge;
            }
          }

          if (myFeature) {
            row = table.insertRow(1);
            cell = row.insertCell(0);
            cell.innerHTML = scenario.scenario;
            cell = row.insertCell(1);
            cell.innerHTML = RoundNumber(SimMax, 2);
            cell = row.insertCell(2);
            cell.innerHTML = RoundNumber(ObsMax, 2);
            cell = row.insertCell(3);
            if (myMeas) {
              cell.innerHTML = RoundNumber(SimMax - ObsMax, 2);
            }
          }
        }
        break;
      case 'FlowBoundary':
        // TODO Create function to populate FlowBoundary table
        break;
      case 'Terminal':
        // TODO Create function to populate Terminal table
        break;
      default:
    }

    document.getElementById('stats_table').style.display = "block";
  }
}

function drawChart1D(ModelID, objectType, parameterIdx) {
  //this function draws the chart for 1D objects
  if (ModelID) {

    console.log("Drawing chart for ", ModelID, ": type ", objectType, " and parameter ", parameterIdx);

    switch (objectType) {
      case 'observationpoint':
        drawObservationpointChart(ModelID, parameterIdx, getTimestepIndex());
        break;
      case 'calculationpoint':
        drawChart1DObject(ModelID, objectType, parameterIdx)
        break;
      case 'structure':
        drawStructureChart(ModelID, "discharge", getTimestepIndex());
        // drawChart1DObject(ModelID, objectType, parameterIdx)
        break;
      case 'wqpoint':
        drawChart1DObject(ModelID, objectType, parameterIdx)
        break;
      case 'Basin':
        console.log("Drawing chart for basin");
        drawBasinChart(ModelID, parameterIdx, getTimestepIndex());
        break;
      case 'ManningResistance':
        console.log("Drawing chart for ManningResistance");
        drawBackwaterChart(ModelID, parameterIdx, getTimestepIndex());
        break;
      case 'TabulatedRatingCurve':
        console.log("Drawing chart for TabulatedRatingCurve");
        drawBackwaterChart(ModelID, parameterIdx, getTimestepIndex());
        break;
      case 'FlowBoundary':
        // TODO Create function to draw FlowBoundary chart
        break;
      case 'Terminal':
        // TODO Create function to draw Terminal chart
        break;
      default:
        break;
    }
  }
}

function updateChartTitle(ChartTitle) {
  var chartTitleDiv = document.getElementById('chart_title');
  chartTitleDiv.innerText = ChartTitle; // This will set the text inside the div to the value of AreaID

  document.getElementById('chart_subtitle').style.display = "none";
}

function drawWaterBalanceChart(AreaID) {
  console.log("Drawing waterbalance for scenario ", scenarioIdx, " and area ", AreaID);

  if (AreaID) {
    const scenario = Waterbalance.scenarios[scenarioIdx];
    if (!scenario) {
      alert("Scenario not found");
      return;
    }

    const area = scenario.balance.find(a => a.AreaID === AreaID);
    if (!area) {
      alert("Area not found");
      return;
    }

    const datain = new google.visualization.DataTable();
    const dataout = new google.visualization.DataTable();
    datain.addColumn('number', 'Time');
    dataout.addColumn('number', 'Time');

    // Function to check if a link has non-zero inflow or outflow data
    const hasNonZeroInflow = (link) => link.in.some(value => value !== 0);
    const hasNonZeroOutflow = (link) => link.out.some(value => value !== 0);

    // Add columns conditionally for inflow
    area.links.forEach(link => {
      datain.addColumn('number', link.ID);
    });

    // Add columns conditionally for outflow
    area.links.forEach(link => {
      dataout.addColumn('number', link.ID);
    });


    const timesteps = scenario.timesteps;
    for (let i = 0; i < timesteps.length; i++) {
      const rowin = [timesteps[i]];
      const rowout = [timesteps[i]];

      // Consistent series addition for inflow
      area.links.forEach(link => {
        const inflowValue = link.in[i];
        console.log("inflow is ", inflowValue);
        rowin.push(inflowValue);
      });

      // Consistent series addition for outflow
      area.links.forEach(link => {
        const outflowValue = link.out[i];
        console.log("outflow is ", outflowValue);
        rowout.push(outflowValue);
      });

      datain.addRow(rowin);
      dataout.addRow(rowout);
    }

    // Define chart options
    updateChartTitle('Water balance for area ' + AreaID);

    // Define chart options for the chartin (inflow chart)
    const optionsIn = {
      chartArea: { width: '80%', height: '80%', top: '10%', bottom: '20' }, // Adjust top and bottom as needed
      isStacked: true,
      hAxis: {
        //title: 'Time (s)', 
        //textPosition: 'none'
      },
      vAxis: { title: 'In (m3)' },
      legend: { position: 'none' }, // No legend for inflow chart
      series: {}
    };

    // Define chart options for the chartout (outflow chart)
    const optionsOut = {
      isStacked: true,
      chartArea: { width: '80%', height: '80%', top: '20', bottom: '10%' }, // Adjust top and bottom as needed
      hAxis: {
        title: 'Time (s)',
        textPosition: 'out'
      },
      vAxis: {
        title: 'Out (m3)',
        direction: 1, // This will flip the vertical axis
        textPosition: 'out' // Adjust text position if needed
      },
      legend: { position: 'bottom' }, // Legend for outflow chart
      series: {}
    };

    let seriesCount = 0;
    area.links.forEach((link, index) => {
      seriesCount++;
      optionsIn.series[seriesCount] = {
        color: getColor(index),
        labelInLegend: link.ID,
        areaOpacity: 0.5 // Set as needed
      };
      optionsOut.series[seriesCount] = {
        color: getColor(index),
        labelInLegend: link.ID,
        areaOpacity: 0.5 // Set as needed
      };
    });

    console.log("series found: ", seriesCount);


    // Convert the DataTable to a JSON string
    var jsonDataIn = datain.toJSON();
    var jsonDataOut = dataout.toJSON();

    // Log the JSON string to the console
    console.log(jsonDataIn);
    console.log(jsonDataOut);

    const chartin = new google.visualization.AreaChart(document.getElementById('chartin_div'));
    chartin.draw(datain, optionsIn);
    const chartout = new google.visualization.AreaChart(document.getElementById('chartout_div'));
    chartout.draw(dataout, optionsOut);

    //finally populate the statistics table
    populateWaterbalanceTable(AreaID, "waterbalance");
    document.getElementById('stats_table').style.display = "block";
  } else {
    alert("AreaID is missing");
  }


}

// Helper function to get distinct colors for each link
function getColor(index, isInflow) {
  const colors = ['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c']; // Add more colors as needed
  return colors[index % colors.length];
}


// Function to get alternate color for outflow
function getAlternateColor(index) {
  const altColors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f', '#cab2d6']; // Different set of colors
  return altColors[index % altColors.length];
}

function drawChart1DObject(ModelID, objectType, parameterIdx) {
  if (ModelID) {

    //prepare a Google datatable for our chart
    let data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Gemeten');

    //get the object containing observed data for this object
    let myMeas = measurements.locations.find(x => x.ModelID === ModelID);
    let chartTitle = document.getElementById("chart_title");
    document.getElementById('chart_subtitle').style.display = "none";
    let titleLeader;
    let vAxisTitle;
    let ObsMax;
    let SimMax;
    let ObsDates;
    let ObsValues;
    let nScenarios;

    //create a dictionary to store all dates and values from our scenarios and measurements
    //later we can sort this dictionary by key (date) and migrate all values to our datatable
    let dates = {};

    //set the chart's title and populate its statistics section
    switch (objectType) {
      case 'observationpoint':
        titleLeader = "Verloop waterhoogte ";
        vAxisTitle = "Waterhoogte (m + NAP)"
        nScenarios = Observationpointresults.scenarios.length;
        for (let scenarioIdx = 0; scenarioIdx < Observationpointresults.scenarios.length; scenarioIdx++) {
          data.addColumn('number', Observationpointresults.scenarios[scenarioIdx].scenario);
        }
        if (myMeas) {
          ObsMax = Math.max(...myMeas.h.values);
          ObsDates = myMeas.h.dates;
          ObsValues = myMeas.h.values;
        }
        break;
      case 'calculationpoint':
        titleLeader = "Verloop waterhoogte ";
        vAxisTitle = "Waterhoogte (m + NAP)"
        nScenarios = CalcpntResults.scenarios.length;
        for (let scenarioIdx = 0; scenarioIdx < CalcpntResults.scenarios.length; scenarioIdx++) {
          data.addColumn('number', CalcpntResults.scenarios[scenarioIdx].scenario);
        }
        if (myMeas) {
          ObsMax = Math.max(...myMeas.h.values);
          ObsDates = myMeas.h.dates;
          ObsValues = myMeas.h.values;
        }
        break;
      case 'structure':
        titleLeader = "Verloop debiet ";
        vAxisTitle = "Debiet (m3/s)"
        nScenarios = StructureResults.scenarios.length;
        for (let scenarioIdx = 0; scenarioIdx < StructureResults.scenarios.length; scenarioIdx++) {
          data.addColumn('number', StructureResults.scenarios[scenarioIdx].scenario);
        }
        if (myMeas) {
          ObsMax = Math.max(...myMeas.Q.values);
          ObsDates = myMeas.Q.dates;
          ObsValues = myMeas.Q.values;
        }
        break;
      case 'wqpoint':
        titleLeader = "concentratie " + WQResults.scenarios[0].substances[parameterIdx].substance + " ";
        vAxisTitle = "Concentratie (mg/l)"
        nScenarios = WQResults.scenarios.length;
        for (let scenarioIdx = 0; scenarioIdx < WQResults.scenarios.length; scenarioIdx++) {
          data.addColumn('number', WQResults.scenarios[scenarioIdx].scenario);
        }
        if (myMeas) {
          ObsMax = Math.max(...myMeas.C.values);
          ObsDates = myMeas.C.dates;
          ObsValues = myMeas.C.values;
        }
        break;
      case 'Basin':
        titleLeader = "Waterlevel ";
        vAxisTitle = "Waterlevel (m AD)"
        nScenarios = IWRMNodeResults.scenarios.length;
        for (let scenarioIdx = 0; scenarioIdx < IWRMNodeResults.scenarios.length; scenarioIdx++) {
          data.addColumn('number', IWRMNodeResults.scenarios[scenarioIdx].scenario);
        }
        if (myMeas) {
          ObsMax = Math.max(...myMeas.Q.values);
          ObsDates = myMeas.Q.dates;
          ObsValues = myMeas.Q.values;
        }
        break;
      default:
      // code block
    }

    //extend the title for our chart with the observation series' Alias
    if (myMeas) {
      chartTitle.innerText = titleLeader + myMeas.ID + "/" + myMeas.Alias + " (" + myMeas.ModelID + ")";
    } else {
      chartTitle.innerText = titleLeader + "modelobject " + ModelID;
    }


    //decide which results to iterate through
    switch (objectType) {
      case 'observationpoint':
        for (let scenarioIdx = 0; scenarioIdx < Observationpointresults.scenarios.length; scenarioIdx++) {

          let startDate;
          let myFeature;
          let simSeries;  //the simulated timeseries
          let scenario;   //the simulated scenario
          let ts;

          scenario = Observationpointresults.scenarios[scenarioIdx];
          myFeature = scenario.features.find(x => x.id === ModelID);
          ts = scenario.timesteps_second;
          startDate = new Date(Settings.SimulationT0);
          if (myFeature) {
            SimMax = Math.max(...myFeature.waterlevel);
            simSeries = myFeature.waterlevel;
          }

          let year = startDate.getFullYear();
          let month = startDate.getMonth();
          let day = startDate.getDate();
          let hour = startDate.getHours();
          let minute = startDate.getMinutes();
          let second = startDate.getSeconds();

          if (myFeature) {

            //walk through all timesteps, calculate the date and add its date + value to our dictionary            
            for (let i = 0; i < Settings.timesteps_second.length; i++) {
              let curDate = new Date(year, month, day, hour, minute, second + Settings.timesteps_second[i]);

              //check if this date is already existing as a key in our dictionary. If not, add it
              let curDateStr = curDate.toISOString().substring(0, 19)                      //convert our date to the ISO 8601 format, only keep YYYY-MM-DDTHH:mm:ss
              if (!(curDateStr in dates)) {
                dates[curDateStr] = {};
              }

              //now check if this timestep also occurs in our results arrays
              //if so, set its value. If not, estimate the result
              let index = ts.indexOf(Settings.timesteps_second[i]);
              if (index >= 0) {
                dates[curDateStr][scenarioIdx + 1] = simSeries[index];   //set the value for this scenario and timestep in our dictionary
              } else {
                // dates[curDateStr][scenarioIdx + 1] = NaN;   //set the value for this scenario and timestep in our dictionary
                //no exact match found so walk backwards through our array with timesteps until we find the last timestep before the requested index value
                for (let j = ts.length - 1; j >= 0; j--) {
                  if (ts[j] <= Settings.timesteps_second[i]) {
                    dates[curDateStr][scenarioIdx + 1] = simSeries[j];   //set the value for this scenario and timestep in our dictionary
                    break;
                  }
                }
              }

            }
          }
        }
        break;

      case 'calculationpoint':

        for (let scenarioIdx = 0; scenarioIdx < CalcpntResults.scenarios.length; scenarioIdx++) {

          let startDate;
          let myFeature;
          let simSeries;  //the simulated timeseries
          let scenario;   //the simulated scenario
          let ts;

          scenario = CalcpntResults.scenarios[scenarioIdx];
          myFeature = scenario.features.find(x => x.id === ModelID);
          ts = scenario.timesteps_second;
          startDate = new Date(scenario.t0);
          if (myFeature) {
            SimMax = Math.max(...myFeature.waterlevel);
            simSeries = myFeature.waterlevel;
          }

          let year = startDate.getFullYear();
          let month = startDate.getMonth();
          let day = startDate.getDate();
          let hour = startDate.getHours();
          let minute = startDate.getMinutes();
          let second = startDate.getSeconds();

          if (myFeature) {
            //walk through all timesteps, calculate the date and add its date + value to our dictionary
            for (let i = 0; i < ts.length; i++) {
              let curDate = new Date(year, month, day, hour, minute, second + ts[i]);
              let curDateStr = curDate.toISOString().substring(0, 19)                      //convert our date to the ISO 8601 format, only keep YYYY-MM-DDTHH:mm:ss
              //check if this date is already existing as a key in our dictionary. If not, add it
              if (!(curDateStr in dates)) {
                dates[curDateStr] = {};
              }
              dates[curDateStr][scenarioIdx + 1] = simSeries[i];   //set the value for this scenario and timestep in our dictionary
            }
          }
        }
        break;

      case 'structure':

        for (let scenarioIdx = 0; scenarioIdx < StructureResults.scenarios.length; scenarioIdx++) {

          let startDate;
          let myFeature;
          let simSeries;  //the simulated timeseries
          let scenario;   //the simulated scenario
          let ts;

          scenario = StructureResults.scenarios[scenarioIdx];
          myFeature = scenario.features.find(x => x.id === ModelID);
          ts = scenario.timesteps_second;
          startDate = new Date(scenario.t0);
          if (myFeature) {
            SimMax = Math.max(...myFeature.discharge);
            simSeries = myFeature.discharge;
          }

          let year = startDate.getFullYear();
          let month = startDate.getMonth();
          let day = startDate.getDate();
          let hour = startDate.getHours();
          let minute = startDate.getMinutes();
          let second = startDate.getSeconds();

          if (myFeature) {
            //walk through all timesteps, calculate the date and add its date + value to our dictionary
            for (let i = 0; i < ts.length; i++) {
              let curDate = new Date(year, month, day, hour, minute, second + ts[i]);
              let curDateStr = curDate.toISOString().substring(0, 19)                      //convert our date to the ISO 8601 format, only keep YYYY-MM-DDTHH:mm:ss
              //check if this date is already existing as a key in our dictionary. If not, add it
              if (!(curDateStr in dates)) {
                dates[curDateStr] = {};
              }
              dates[curDateStr][scenarioIdx + 1] = simSeries[i];   //set the value for this scenario and timestep in our dictionary
            }
          }
        }
        break;
      case 'wqpoint':
        for (let scenarioIdx = 0; scenarioIdx < WQResults.scenarios.length; scenarioIdx++) {

          let startDate;
          let myFeature;
          let simSeries;  //the simulated timeseries
          let scenario;   //the simulated scenario
          let ts;

          scenario = WQResults.scenarios[scenarioIdx];
          myFeature = scenario.substances[parameterIdx].features.find(x => x.i === ModelID);
          ts = scenario.timesteps_second;
          startDate = new Date(scenario.SimulationT0);

          if (myFeature) {
            SimMax = Math.max(...myFeature.values);
            simSeries = myFeature.values;
          }

          let year = startDate.getFullYear();
          let month = startDate.getMonth();
          let day = startDate.getDate();
          let hour = startDate.getHours();
          let minute = startDate.getMinutes();
          let second = startDate.getSeconds();

          if (myFeature) {
            //walk through all timesteps, calculate the date and add its date + value to our dictionary
            for (let i = 0; i < ts.length; i++) {
              let curDate = new Date(year, month, day, hour, minute, second + ts[i]);
              let curDateStr = curDate.toISOString().substring(0, 19)                      //convert our date to the ISO 8601 format, only keep YYYY-MM-DDTHH:mm:ss

              //check if this date is already existing as a key in our dictionary. If not, add it
              if (!(curDateStr in dates)) {
                dates[curDateStr] = {};
              }
              dates[curDateStr][scenarioIdx + 1] = simSeries[i];   //set the value for this scenario and timestep in our dictionary
            }
          }
        }
        break;

      case 'Basin':
        for (let scenarioIdx = 0; scenarioIdx < IWRMNodeResults.scenarios.length; scenarioIdx++) {

          let startDate;
          let myFeature;
          let simSeries;  //the simulated timeseries
          let scenario;   //the simulated scenario
          let ts;

          scenario = IWRMNodeResults.scenarios[scenarioIdx];
          myFeature = scenario.features.find(x => x.id == ModelID);

          ts = scenario.timesteps_second;

          startDate = new Date(Settings.SimulationT0);
          if (myFeature) {
            SimMax = Math.max(...myFeature.storage);
            simSeries = myFeature.storage;
          }

          let year = startDate.getFullYear();
          let month = startDate.getMonth();
          let day = startDate.getDate();
          let hour = startDate.getHours();
          let minute = startDate.getMinutes();
          let second = startDate.getSeconds();

          if (myFeature) {
            //walk through all timesteps, calculate the date and add its date + value to our dictionary            
            for (let i = 0; i < Settings.timesteps_second.length; i++) {
              let curDate = new Date(year, month, day, hour, minute, second + Settings.timesteps_second[i]);

              //check if this date is already existing as a key in our dictionary. If not, add it
              let curDateStr = curDate.toISOString().substring(0, 19)                      //convert our date to the ISO 8601 format, only keep YYYY-MM-DDTHH:mm:ss
              if (!(curDateStr in dates)) {
                dates[curDateStr] = {};
              }

              //now check if this timestep also occurs in our results arrays
              //if so, set its value. If not, estimate the result
              let index = ts.indexOf(Settings.timesteps_second[i]);
              if (index >= 0) {
                dates[curDateStr][scenarioIdx + 1] = simSeries[index];   //set the value for this scenario and timestep in our dictionary
              } else {
                // dates[curDateStr][scenarioIdx + 1] = NaN;   //set the value for this scenario and timestep in our dictionary
                //no exact match found so walk backwards through our array with timesteps until we find the last timestep before the requested index value
                for (let j = ts.length - 1; j >= 0; j--) {
                  if (ts[j] <= Settings.timesteps_second[i]) {
                    dates[curDateStr][scenarioIdx + 1] = simSeries[j];   //set the value for this scenario and timestep in our dictionary
                    break;
                  }
                }
              }

            }
          }
        }
        break;



      default:
    }

    //add our measurements, if data exists
    if (myMeas) {
      for (let i = 0; i < ObsDates.length; i++) {
        let curDate = new Date(ObsDates[i]);
        let curDateStr = curDate.toISOString().substring(0, 19)                      //convert our date to the ISO 8601 format, only keep YYYY-MM-DDTHH:mm:ss
        if (!(curDateStr in dates)) {
          dates[curDateStr] = {};
        }
        dates[curDateStr][0] = ObsValues[i];           //set the observed value in our dictionary
      }
    }

    data.addRows(Object.keys(dates).length);

    let i = 0;
    Object.keys(dates).forEach(key => {
      data.setValue(i, 0, new Date(key));     //datum
      data.setValue(i, 1, dates[key][0]);     //meetwaarde
      for (let j = 0; j < nScenarios; j++) {
        data.setValue(i, j + 2, dates[key][j + 1]);     //scenario
      }
      i++;
    });

    // Set chart options
    var options = {
      // 'title': ID,
      fontName: 'Helvetica',
      legend: {
        position: 'right',
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        }
      },
      chartArea: {
        right: 200,   // set this to adjust the legend width
        left: 60,     // set this eventually, to adjust the left margin
      },
      'width': 600,
      'height': 350,
      vAxis: {
        title: vAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        },
        viewWindow: {
          max: SimMax
        }
      },
      hAxis: {
        title: 'Datum',
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
        // viewWindow: {
        //   min: 0
        // }
      },
      seriesType: 'line',
      series: { 0: { type: 'scatter', pointSize: 1 } },
      // series: {1: {type: 'line'}},
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(data, options);



  }
}

function StyleObservationpointsButtons(active_observationpoint_id, active_observationpoint_parameter) {
  let observationpointsdiv = document.getElementById("observationpointscontainer");
  if (!active_observationpoint_id) {
    observationpointsdiv.style.display = 'none';
  } else {
    observationpointsdiv.style.display = 'block';
  }

  let hbutton = document.getElementById("hbutton");
  let qbutton = document.getElementById("qbutton");
  let cbutton = document.getElementById("cbutton");

  // //initialize all buttons to no border
  hbutton.style.borderWidth = '0px';
  hbutton.style.boxShadow = '0px 0px #000000 ';
  qbutton.style.borderWidth = '0px';
  qbutton.style.boxShadow = '0px 0px #000000 ';
  cbutton.style.borderWidth = '0px';
  cbutton.style.boxShadow = '0px 0px #000000 ';

  if (active_observationpoint_parameter == 'observationpoint_waterlevel') {
    hbutton.style.borderWidth = '2px';
    hbutton.style.boxShadow = '2px 3px 2px #999999';
  } else if (active_observationpoint_parameter == 'observationpoint_discharge') {
    qbutton.style.borderWidth = '2px';
    qbutton.style.boxShadow = '2px 3px 2px #999999';
  } else if (active_observationpoint_parameter == 'observationpoint_cumulative_discharge') {
    cbutton.style.borderWidth = '2px';
    cbutton.style.boxShadow = '2px 3px 2px #999999';
  }
}

function UpdateChartElements() {
  StyleBasinButtons(active_basin_id, active_basin_parameter);
  StyleBackwaterButtons(active_basin_id, active_basin_parameter);
  //StyleDambreakButtons(active_dambreak_id, active_dambreak_parameter);

  StyleTable();

}

function StyleTable() {
  //show or hide the table with statistics, based on whether the checkbox for areas is checked
  let tablediv = document.getElementById("stats_div");
  if (active_chart_source === 3) {
    tablediv.style.display = 'none';
  } else {
    tablediv.style.display = 'block';
  }
}

function StyleBackwaterButtons(active_basin_id, active_basin_parameter) {
  //console.log("active basin id is ", active_basin_id);
  let basinsdiv = document.getElementById("basincontainer");
  let backwaterdiv = document.getElementById("backwatercontainer");

  basinsdiv.style.display = 'none';
  document.getElementById("stats_div").style.display = 'block';

  if (active_chart_source === 1) {
    backwaterdiv.style.display = 'block';
  } else {
    backwaterdiv.style.display = 'none';
  }

  let dischargebutton = document.getElementById("dischargebutton");
  let headlossbutton = document.getElementById("headlossbutton");

  // //initialize all buttons to no border
  dischargebutton.style.borderWidth = '0px';
  dischargebutton.style.boxShadow = '0px 0px #000000 ';
  headlossbutton.style.borderWidth = '0px';
  headlossbutton.style.boxShadow = '0px 0px #000000 ';

  if (active_basin_parameter == 'discharge') {
    dischargebutton.style.borderWidth = '2px';
    dischargebutton.style.boxShadow = '2px 3px 2px #999999';
  } else if (active_basin_parameter == 'headloss') {
    headlossbutton.style.borderWidth = '2px';
    headlossbutton.style.boxShadow = '2px 3px 2px #999999';
  }
}

function StyleBasinButtons(active_basin_id, active_basin_parameter) {
  //console.log("active basin id is ", active_basin_id);
  let basinsdiv = document.getElementById("basincontainer");
  let backwaterdiv = document.getElementById("backwatercontainer");


  backwaterdiv.style.display = 'none';
  document.getElementById("stats_div").style.display = 'block';

  if (active_chart_source === 1) {
    basinsdiv.style.display = 'block';
  } else {
    basinsdiv.style.display = 'none';
  }

  let levelbutton = document.getElementById("levelbutton");
  let storagebutton = document.getElementById("storagebutton");

  // //initialize all buttons to no border
  levelbutton.style.borderWidth = '0px';
  levelbutton.style.boxShadow = '0px 0px #000000 ';
  storagebutton.style.borderWidth = '0px';
  storagebutton.style.boxShadow = '0px 0px #000000 ';

  if (active_basin_parameter == 'level') {
    levelbutton.style.borderWidth = '2px';
    levelbutton.style.boxShadow = '2px 3px 2px #999999';
  } else if (active_basin_parameter == 'storage') {
    storagebutton.style.borderWidth = '2px';
    storagebutton.style.boxShadow = '2px 3px 2px #999999';
  }
}

function StyleDambreakButtons(active_dambreak_id, active_dambreak_parameter) {
  let dambreakdiv = document.getElementById("dambreakcontainer");
  if (!active_dambreak_id) {
    dambreakdiv.style.display = 'none';
  } else {
    dambreakdiv.style.display = 'block';
  }

  let clbutton = document.getElementById("clbutton");
  let cwbutton = document.getElementById("cwbutton");
  let qbutton = document.getElementById("qbutton");
  let headbutton = document.getElementById("headbutton");
  let cumbutton = document.getElementById("cumbutton");
  // let growthbutton = document.getElementById("growthbutton");

  // //initialize all buttons to no border
  clbutton.style.borderWidth = '0px';
  clbutton.style.boxShadow = '0px 0px #000000 ';
  cwbutton.style.borderWidth = '0px';
  cwbutton.style.boxShadow = '0px 0px #000000 ';
  qbutton.style.borderWidth = '0px';
  qbutton.style.boxShadow = '0px 0px #000000 ';
  headbutton.style.borderWidth = '0px';
  headbutton.style.boxShadow = '0px 0px #000000 ';
  cumbutton.style.borderWidth = '0px';
  cumbutton.style.boxShadow = '0px 0px #000000 ';
  // growthbutton.style.borderWidth = '0px';
  // growthbutton.style.boxShadow = '0px 0px #000000 ';

  if (active_dambreak_parameter == 'dambreak_levels') {
    clbutton.style.borderWidth = '2px';
    clbutton.style.boxShadow = '2px 3px 2px #999999';
  } else if (active_dambreak_parameter == 'dambreak_crest_width') {
    cwbutton.style.borderWidth = '2px';
    cwbutton.style.boxShadow = '2px 3px 2px #999999';
  } else if (active_dambreak_parameter == 'dambreak_discharge') {
    qbutton.style.borderWidth = '2px';
    qbutton.style.boxShadow = '2px 3px 2px #999999';
  } else if (active_dambreak_parameter == 'dambreak_cumulative_discharge') {
    cumbutton.style.borderWidth = '2px';
    cumbutton.style.boxShadow = '2px 3px 2px #999999';
  } else if (active_dambreak_parameter == 'dambreak_head') {
    headbutton.style.borderWidth = '2px';
    headbutton.style.boxShadow = '2px 3px 2px #999999';
    // } else if (active_dambreak_parameter == 'dambreak_growth') {
    //   growthbutton.style.borderWidth = '2px';
    //   growthbutton.style.boxShadow = '2px 3px 2px #999999';
  } else if (active_dambreak_parameter == 'dambreak_growth') {
    cumbutton.style.borderWidth = '2px';
    cumbutton.style.boxShadow = '2px 3px 2px #999999';
  }
}

function getDambreakIndexByID(scenarioIndex, dambreakID) {
  // Get the scenario data using the scenario index
  const scenarioData = MeshResults.scenarios[scenarioIndex];

  // Check if scenario data exists
  if (!scenarioData) {
    throw new Error("Invalid scenario index.");
  }

  // Loop through the dambreaks in the scenario
  for (let i = 0; i < scenarioData.dambreaks.length; i++) {
    // If the dambreak ID matches, return the index
    if (scenarioData.dambreaks[i].id === dambreakID) {
      return i;
    }
  }

  // If no dambreak with the given ID was found in the scenario, return -1
  return -1;
}

function drawDambreakChart(ID, active_dambreak_parameter, tsidx) {

  console.log("drawing chart for dambreak ", ID);

  if (ID) {

    //prepare a Google datatable for our chart, create a column for the date and set the chart title and the axis title
    // let data = new google.visualization.DataTable();
    let arr = [];
    let header = [];
    let values = [];
    let xAxisTitle = "Datum";

    // data.addColumn('date', 'Date');
    header.push("Date");
    header.push({ role: 'annotation', type: 'string' });

    let chartTitle = document.getElementById("chart_title");
    document.getElementById('chart_subtitle').style.display = "none";
    chartTitle.innerText = "Breslocatie " + ID;
    let vAxisTitle = "titel";
    let dates = {};

    if (active_dambreak_parameter == 'dambreak_levels') {
      vAxisTitle = "Hoogtes (m + NAP)";
    } else if (active_dambreak_parameter == 'dambreak_crest_width') {
      vAxisTitle = "Breedte bres (m)";
    } else if (active_dambreak_parameter == 'dambreak_discharge') {
      vAxisTitle = "Debiet bres (m3/s)";
    } else if (active_dambreak_parameter == 'dambreak_cumulative_discharge') {
      vAxisTitle = "Cumulatief volume (m3)";
    } else if (active_dambreak_parameter == 'dambreak_head') {
      vAxisTitle = "Verval bres (m)";
    } else if (active_dambreak_parameter == 'dambreak_growth') {
      vAxisTitle = "Groeisnelheid bres (m/s)";
    }

    //prepare our table for the results statistics
    let table = document.getElementById("stats_table");
    table.innerHTML = "";                                           //clear all existing content

    //count the number of scenario's wwe have. This will be the number of columns in our datatable
    nScenarios = MeshResults.scenarios.length;
    let nSeries = 0;

    //each scenario gets its own column for the data to be stored in
    let seriesIdx = -1
    let dambreakIdx = -1
    for (let myScenarioIdx = 0; myScenarioIdx < MeshResults.scenarios.length; myScenarioIdx++) {

      dambreakIdx = getDambreakIndexByID(myScenarioIdx, ID);
      if (dambreakIdx >= 0) {
        if (active_dambreak_parameter == 'dambreak_levels') {
          //only plot the currently active scenario because otherwise we have too many lines!
          if (myScenarioIdx == scenarioIdx) {
            seriesIdx = addDateTimeSeries(MeshResults.scenarios[myScenarioIdx].scenario, "kruinhoogte", header, dates, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].timesteps_second, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].dambreak_crest_level, seriesIdx);
            nSeries++;
            seriesIdx = addDateTimeSeries(MeshResults.scenarios[myScenarioIdx].scenario, "h bov.str", header, dates, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].timesteps_second, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].dambreak_s1up, seriesIdx);
            nSeries++;
            seriesIdx = addDateTimeSeries(MeshResults.scenarios[myScenarioIdx].scenario, "h ben.str", header, dates, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].timesteps_second, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].dambreak_s1dn, seriesIdx);
            nSeries++;
          }
        } else if (active_dambreak_parameter == 'dambreak_crest_width') {
          seriesIdx = addDateTimeSeries(MeshResults.scenarios[myScenarioIdx].scenario, "kruinbreedte", header, dates, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].timesteps_second, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].dambreak_crest_width, seriesIdx);
          nSeries++;
          // console.log("SeriesIdx is ", seriesIdx);
        } else if (active_dambreak_parameter == 'dambreak_discharge') {
          let max = Math.max(...MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].dambreak_discharge);
          let min = Math.min(...MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].dambreak_discharge);
          let multiplier = 1;
          if (Math.abs(min) > max) {
            multiplier = -1;
          }
          seriesIdx = addDateTimeSeries(MeshResults.scenarios[myScenarioIdx].scenario, "debiet", header, dates, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].timesteps_second, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].dambreak_discharge, seriesIdx, multiplier);
          nSeries++;
        } else if (active_dambreak_parameter == 'dambreak_cumulative_discharge') {
          seriesIdx = addDateTimeSeries(MeshResults.scenarios[myScenarioIdx].scenario, "volume", header, dates, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].timesteps_second, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].dambreak_cumulative_discharge, seriesIdx);
          nSeries++;
        } else if (active_dambreak_parameter == 'dambreak_head') {
          seriesIdx = addDateTimeSeries(MeshResults.scenarios[myScenarioIdx].scenario, "verval", header, dates, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].timesteps_second, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].dambreak_head, seriesIdx);
          nSeries++;
        } else if (active_dambreak_parameter == 'dambreak_growth') {
          seriesIdx = addDateTimeSeries(MeshResults.scenarios[myScenarioIdx].scenario, "groei", header, dates, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].timesteps_second, MeshResults.scenarios[myScenarioIdx].dambreaks[dambreakIdx].dambreak_growth, seriesIdx);
          nSeries++;
        }
      }

    }

    //add our header to the results array
    arr.push(header);

    //and add all our data to the results array!
    if (xaxisrelative) {

      //set the starttime of our event so we can calculate the difference in hours
      xAxisTitle = "Tijd na aanvang simulatie (uren)"
      EventT0 = new Date(MeshResults.scenarios[0].SimulationT0);
      if (MeshResults.scenarios[0].DambreakT0Seconds) {
        xAxisTitle = "Tijd na aanvang bres (uren)"
        EventT0.setSeconds(EventT0.getSeconds() + MeshResults.scenarios[0].DambreakT0Seconds);
      }

      let i = 0;
      Object.keys(dates).forEach(key => {

        let myDate = new Date(key);
        let Hours = getDifferenceBetweenTwoDatesInHours(EventT0, myDate);

        //only plot from two hours before our event
        if (Hours >= 0) {
          values = [];
          values.push(Hours);

          if (i == tsidx) {
            values.push("nu");
          } else {
            values.push(null);
          }

          //if (dambreaktsidx >= 0 && i == dambreaktsidx) {
          //  values.push("bres")
          //} else {
          //  values.push(null);
          //}


          for (let j = 0; j < nSeries; j++) {
            values.push(dates[key][j + 1]);
          }
          arr.push(values);
        }
        i++;
      });

    } else {
      let i = 0;
      Object.keys(dates).forEach(key => {

        values = [];
        values.push(new Date(key));

        if (i == tsidx) {
          values.push("nu");
        } else {
          values.push(null);
        }

        //if (dambreaktsidx >= 0 && i == dambreaktsidx) {
        //  values.push("bres")
        //} else {
        //  values.push(null);
        //}


        for (let j = 0; j < nSeries; j++) {
          values.push(dates[key][j + 1]);
        }
        i++;
        arr.push(values);
      });
    }





    // Set chart options
    var options = {
      // 'title': ID,
      annotations: {
        stem: {
          color: '#097138'
        },
        style: 'line'
      },
      legend: {
        position: 'right',
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        }
      },
      chartArea: {
        right: 200,   // set this to adjust the legend width
        left: 60,     // set this eventually, to adjust the left margin
      },
      'width': 600,
      'height': 350,
      vAxis: {
        title: vAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
      },
      hAxis: {
        title: xAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
        // viewWindow: {
        //   min: 0
        // }
      },
      seriesType: 'line',
      // series: { 0: { type: 'scatter', pointSize: 1 } },
      // series: {1: {type: 'line'}},
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(google.visualization.arrayToDataTable(arr), options);

    document.getElementById('stats_table').style.display = "block";

  }
}


function drawObservationpointChart(ID, parameterIdx, tsidx) {

  if (ID) {

    //prepare a Google datatable for our chart, create a column for the date and set the chart title and the axis title
    // let data = new google.visualization.DataTable();
    let arr = [];
    let header = [];
    let values = [];

    let EventT0 = new Date(Settings.SimulationT0);
    let dambreaktsidx = -1;

    // data.addColumn('date', 'Date');
    header.push("Date");
    header.push({ role: 'annotation', type: 'string' });  //annotation for current timestep
    header.push({ role: 'annotation', type: 'string' });  //annotation for time breach

    let chartTitle = document.getElementById("chart_title");
    document.getElementById('chart_subtitle').style.display = "none";
    chartTitle.innerText = ID;
    let vAxisTitle = "titel";
    let dates = {};

    if (parameterIdx == 0) {
      vAxisTitle = "Waterhoogte (m + NAP)";
    } else if (parameterIdx == 1) {
      vAxisTitle = "Debiet (m3/s)";
    } else if (parameterIdx == 2) {
      vAxisTitle = "Cum. Volume (m3)";
    }

    //count the number of scenario's wwe have. This will be the number of columns in our datatable
    nScenarios = Observationpointresults.scenarios.length;
    let nSeries = 0;

    //each scenario gets its own column for the data to be stored in
    let seriesIdx = -1
    for (let myScenarioIdx = 0; myScenarioIdx < Observationpointresults.scenarios.length; myScenarioIdx++) {

      //find the feature we're dealing with!
      console.log("Finding feature ", ID);
      let myFeature = Observationpointresults.scenarios[myScenarioIdx].features.find(x => x.id === ID);

      if (parameterIdx == 0) {
        //only plot the currently active scenario because otherwise we have too many lines!
        seriesIdx = addDateTimeSeries(Observationpointresults.scenarios[myScenarioIdx].scenario, "waterhoogte", header, dates, Observationpointresults.scenarios[myScenarioIdx].timesteps_second, myFeature.waterlevel, seriesIdx);
        nSeries++;
      } else if (parameterIdx == 1) {
        seriesIdx = addDateTimeSeries(Observationpointresults.scenarios[myScenarioIdx].scenario, "debiet", header, dates, Observationpointresults.scenarios[myScenarioIdx].timesteps_second, myFeature.discharge, seriesIdx);
        nSeries++;
      } else if (parameterIdx == 2) {
        seriesIdx = addDateTimeSeries(Observationpointresults.scenarios[myScenarioIdx].scenario, "volume", header, dates, Observationpointresults.scenarios[myScenarioIdx].timesteps_second, myFeature.discharge, seriesIdx, 1, true);
        nSeries++;
      }
    }

    //finally add our observed data
    let myObserved = measurements.locations.find(x => x.ModelID === ID);
    if (myObserved) {

      if (parameterIdx == 0 && myObserved.h) {
        seriesIdx = addObservedSeries(header, dates, myObserved.h.dates, myObserved.h.values, seriesIdx);
        nSeries++;
      } else if (parameterIdx == 1 && myObserved.Q) {
        seriesIdx = addObservedSeries(header, dates, myObserved.Q.dates, myObserved.Q.values, seriesIdx);
        nSeries++;
      } else if (parameterIdx == 2 && myObserved.Q) {
        seriesIdx = addObservedSeries(header, dates, myObserved.Q.dates, myObserved.Q.values, seriesIdx, true);
        nSeries++;
      } else {
        console.log("No observed data found for ", ID);
      }
    } else {
      console.log("No observed data found for ", ID);
    }

    //add our header to the results array
    arr.push(header);

    //and add all our data to the results array!
    let xAxisTitle = "Datum";
    if (xaxisrelative) {

      //set the starttime of our event so we can calculate the difference in hours
      xAxisTitle = "Tijd na aanvang simulatie (uren)"
      if (MeshResults.scenarios[0].DambreakT0Seconds) {
        xAxisTitle = "Tijd na aanvang bres (uren)"
        EventT0.setSeconds(EventT0.getSeconds() + MeshResults.scenarios[0].DambreakT0Seconds);
        dambreaktsidx = GetDambreakTimestepIndex(dates, EventT0);
      }

      let i = 0;
      Object.keys(dates).forEach(key => {

        let myDate = new Date(key);
        let Hours = getDifferenceBetweenTwoDatesInHours(EventT0, myDate);

        //only plot from two hours before our event
        if (Hours >= 0) {
          values = [];
          values.push(Hours);

          if (i == tsidx) {
            values.push("nu");
          } else {
            values.push(null);
          }

          if (dambreaktsidx >= 0 && i == dambreaktsidx) {
            values.push("bres")
          } else {
            values.push(null);
          }

          for (let j = 0; j < nSeries; j++) {
            values.push(dates[key][j + 1]);
          }
          arr.push(values);
        }
        i++;
      });

    } else {
      let i = 0;

      //set our dambreak timestep index, if present
      if (MeshResults.scenarios.length > 0 && MeshResults.scenarios[0].DambreakT0Seconds) {
        EventT0.setSeconds(EventT0.getSeconds() + MeshResults.scenarios[0].DambreakT0Seconds);  //set EventT0 equal to the start of our simulation
        dambreaktsidx = GetDambreakTimestepIndex(dates, EventT0);
      }

      Object.keys(dates).forEach(key => {

        values = [];
        values.push(new Date(key));

        if (i == tsidx) {
          values.push("nu");
        } else {
          values.push(null);
        }

        // console.log("pushing bres");
        if (dambreaktsidx >= 0 && i == dambreaktsidx) {
          values.push("bres")
        } else {
          values.push(null);
        }

        for (let j = 0; j < nSeries; j++) {
          values.push(dates[key][j + 1]);
        }
        i++;
        arr.push(values);
      });
    }

    // Set chart options
    var options = {
      // 'title': ID,
      annotations: {
        stem: {
          color: '#097138'
        },
        style: 'line'
      },
      legend: {
        position: 'right',
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        }
      },
      chartArea: {
        right: 200,   // set this to adjust the legend width
        left: 60,     // set this eventually, to adjust the left margin
      },
      'width': 600,
      'height': 350,
      vAxis: {
        title: vAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
      },
      hAxis: {
        title: xAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
        // viewWindow: {
        //   min: 0
        // }
      },
      seriesType: 'line',
      // series: { 0: { type: 'scatter', pointSize: 1 } },
      // series: {1: {type: 'line'}},
    };

    console.log("plotting now");

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(google.visualization.arrayToDataTable(arr), options);

  }
}

function drawBackwaterChart(ID, parameterIdx, tsidx) {

  console.log("drawing chart", ID, " parameterIdx ", parameterIdx, " tsidx ", tsidx);

  if (ID) {

    //prepare a Google datatable for our chart, create a column for the date and set the chart title and the axis title
    // let data = new google.visualization.DataTable();
    let arr = [];
    let header = [];
    let values = [];

    let EventT0 = new Date(Settings.SimulationT0);
    let dambreaktsidx = -1;

    // data.addColumn('date', 'Date');
    header.push("Date");
    header.push({ role: 'annotation', type: 'string' });  //annotation for current timestep
    header.push({ role: 'annotation', type: 'string' });  //annotation for time breach

    let chartTitle = document.getElementById("chart_title");
    document.getElementById('chart_subtitle').style.display = "none";
    chartTitle.innerText = ID;
    let vAxisTitle = "titel";
    let dates = {};

    if (parameterIdx == 0) {
      vAxisTitle = "Level (m + AD)";
    } else if (parameterIdx == 1) {
      vAxisTitle = "Storage (m3)";
    }

    // 0 = discharge
    // 1 = headloss

    //count the number of scenario's wwe have. This will be the number of columns in our datatable
    nScenarios = IWRMNodeResults.scenarios.length;
    let nSeries = 0;

    //each scenario gets its own column for the data to be stored in
    let seriesIdx = -1
    for (let myScenarioIdx = 0; myScenarioIdx < IWRMNodeResults.scenarios.length; myScenarioIdx++) {

      //find the feature we're dealing with!
      console.log("Finding feature ", ID);
      let myFeature = IWRMNodeResults.scenarios[myScenarioIdx].features.find(x => x.id == ID);

      // console.log(myFeature.discharge);
      // console.log("Feature is ", myFeature);

      if (parameterIdx == 0) {
        //only plot the currently active scenario because otherwise we have too many lines!
        seriesIdx = addDateTimeSeries(IWRMNodeResults.scenarios[myScenarioIdx].scenario, "discharge", header, dates, IWRMNodeResults.scenarios[myScenarioIdx].timesteps_second, myFeature.discharge, seriesIdx);
        nSeries++;
      } else if (parameterIdx == 1) {
        seriesIdx = addDateTimeSeries(IWRMNodeResults.scenarios[myScenarioIdx].scenario, "headloss", header, dates, IWRMNodeResults.scenarios[myScenarioIdx].timesteps_second, myFeature.headloss, seriesIdx);
        nSeries++;
      }
    }

    //finally add our observed data
    let myObserved = measurements.locations.find(x => x.ModelID === ID);
    if (myObserved) {

      if (parameterIdx == 0 && myObserved.h) {
        seriesIdx = addObservedSeries(header, dates, myObserved.h.dates, myObserved.h.values, seriesIdx);
        nSeries++;
      } else if (parameterIdx == 1 && myObserved.Q) {
        seriesIdx = addObservedSeries(header, dates, myObserved.Q.dates, myObserved.Q.values, seriesIdx);
        nSeries++;
      } else if (parameterIdx == 2 && myObserved.Q) {
        seriesIdx = addObservedSeries(header, dates, myObserved.Q.dates, myObserved.Q.values, seriesIdx, true);
        nSeries++;
      } else {
        console.log("No observed data found for ", ID);
      }
    } else {
      console.log("No observed data found for ", ID);
    }

    //add our header to the results array
    arr.push(header);

    //and add all our data to the results array!
    let xAxisTitle = "Datum";
    if (xaxisrelative) {

      //set the starttime of our event so we can calculate the difference in hours
      xAxisTitle = "Tijd na aanvang simulatie (uren)"
      if (MeshResults.scenarios[0].DambreakT0Seconds) {
        xAxisTitle = "Tijd na aanvang bres (uren)"
        EventT0.setSeconds(EventT0.getSeconds() + MeshResults.scenarios[0].DambreakT0Seconds);
        dambreaktsidx = GetDambreakTimestepIndex(dates, EventT0);
      }

      let i = 0;
      Object.keys(dates).forEach(key => {
        let myDate = new Date(key);
        let Hours = getDifferenceBetweenTwoDatesInHours(EventT0, myDate);

        //only plot from two hours before our event
        if (Hours >= 0) {
          values = [];
          values.push(Hours);

          if (i == tsidx) {
            values.push("nu");
          } else {
            values.push(null);
          }

          if (dambreaktsidx >= 0 && i == dambreaktsidx) {
            values.push("bres")
          } else {
            values.push(null);
          }

          for (let j = 0; j < nSeries; j++) {
            values.push(dates[key][j + 1]);
          }
          arr.push(values);
        }
        i++;
      });

    } else {
      let i = 0;

      //set our dambreak timestep index, if present
      if (MeshResults.scenarios.length > 0 && MeshResults.scenarios[0].DambreakT0Seconds) {
        EventT0.setSeconds(EventT0.getSeconds() + MeshResults.scenarios[0].DambreakT0Seconds);  //set EventT0 equal to the start of our simulation
        dambreaktsidx = GetDambreakTimestepIndex(dates, EventT0);
      }

      Object.keys(dates).forEach(key => {
        values = [];
        values.push(new Date(key));

        if (i == tsidx) {
          values.push("nu");
        } else {
          values.push(null);
        }

        if (dambreaktsidx >= 0 && i == dambreaktsidx) {
          values.push("bres")
        } else {
          values.push(null);
        }

        for (let j = 0; j < nSeries; j++) {
          values.push(dates[key][j + 1]);
        }
        i++;
        arr.push(values);
      });
    }

    // Set chart options
    var options = {
      // 'title': ID,
      annotations: {
        stem: {
          color: '#097138'
        },
        style: 'line'
      },
      legend: {
        position: 'right',
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        }
      },
      chartArea: {
        right: 200,   // set this to adjust the legend width
        left: 60,     // set this eventually, to adjust the left margin
      },
      'width': 600,
      'height': 350,
      vAxis: {
        title: vAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
      },
      hAxis: {
        title: xAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
        // viewWindow: {
        //   min: 0
        // }
      },
      seriesType: 'line',
      // series: { 0: { type: 'scatter', pointSize: 1 } },
      // series: {1: {type: 'line'}},
    };

    console.log("plotting now");

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    console.log(arr);
    chart.draw(google.visualization.arrayToDataTable(arr), options);

  }
}


function drawBasinChart(ID, parameterIdx, tsidx) {

  console.log("drawing chart for basin ", ID, " parameterIdx ", parameterIdx, " tsidx ", tsidx);

  if (ID) {

    //prepare a Google datatable for our chart, create a column for the date and set the chart title and the axis title
    // let data = new google.visualization.DataTable();
    let arr = [];
    let header = [];
    let values = [];

    let EventT0 = new Date(Settings.SimulationT0);
    let dambreaktsidx = -1;

    // data.addColumn('date', 'Date');
    header.push("Date");
    header.push({ role: 'annotation', type: 'string' });  //annotation for current timestep
    header.push({ role: 'annotation', type: 'string' });  //annotation for time breach

    let chartTitle = document.getElementById("chart_title");
    document.getElementById('chart_subtitle').style.display = "none";
    chartTitle.innerText = ID;
    let vAxisTitle = "titel";
    let dates = {};

    if (parameterIdx == 0) {
      vAxisTitle = "Level (m + AD)";
    } else if (parameterIdx == 1) {
      vAxisTitle = "Storage (m3)";
    }

    //count the number of scenario's wwe have. This will be the number of columns in our datatable
    nScenarios = IWRMNodeResults.scenarios.length;
    let nSeries = 0;

    //each scenario gets its own column for the data to be stored in
    let seriesIdx = -1
    for (let myScenarioIdx = 0; myScenarioIdx < IWRMNodeResults.scenarios.length; myScenarioIdx++) {

      //find the feature we're dealing with!
      console.log("Finding feature ", ID);
      let myFeature = IWRMNodeResults.scenarios[myScenarioIdx].features.find(x => x.id == ID);
      console.log("Feature is ", myFeature);

      if (parameterIdx == 0) {
        //only plot the currently active scenario because otherwise we have too many lines!
        seriesIdx = addDateTimeSeries(IWRMNodeResults.scenarios[myScenarioIdx].scenario, "level", header, dates, IWRMNodeResults.scenarios[myScenarioIdx].timesteps_second, myFeature.level, seriesIdx);
        nSeries++;
      } else if (parameterIdx == 1) {
        seriesIdx = addDateTimeSeries(IWRMNodeResults.scenarios[myScenarioIdx].scenario, "storage", header, dates, IWRMNodeResults.scenarios[myScenarioIdx].timesteps_second, myFeature.storage, seriesIdx);
        nSeries++;
      }
    }

    //finally add our observed data
    let myObserved = measurements.locations.find(x => x.ModelID === ID);
    if (myObserved) {

      if (parameterIdx == 0 && myObserved.h) {
        seriesIdx = addObservedSeries(header, dates, myObserved.h.dates, myObserved.h.values, seriesIdx);
        nSeries++;
      } else if (parameterIdx == 1 && myObserved.Q) {
        seriesIdx = addObservedSeries(header, dates, myObserved.Q.dates, myObserved.Q.values, seriesIdx);
        nSeries++;
      } else if (parameterIdx == 2 && myObserved.Q) {
        seriesIdx = addObservedSeries(header, dates, myObserved.Q.dates, myObserved.Q.values, seriesIdx, true);
        nSeries++;
      } else {
        console.log("No observed data found for ", ID);
      }
    } else {
      console.log("No observed data found for ", ID);
    }

    //add our header to the results array
    arr.push(header);

    //and add all our data to the results array!
    let xAxisTitle = "Datum";
    if (xaxisrelative) {

      //set the starttime of our event so we can calculate the difference in hours
      xAxisTitle = "Tijd na aanvang simulatie (uren)"
      if (MeshResults.scenarios[0].DambreakT0Seconds) {
        xAxisTitle = "Tijd na aanvang bres (uren)"
        EventT0.setSeconds(EventT0.getSeconds() + MeshResults.scenarios[0].DambreakT0Seconds);
        dambreaktsidx = GetDambreakTimestepIndex(dates, EventT0);
      }

      let i = 0;
      Object.keys(dates).forEach(key => {

        let myDate = new Date(key);
        let Hours = getDifferenceBetweenTwoDatesInHours(EventT0, myDate);

        //only plot from two hours before our event
        if (Hours >= 0) {
          values = [];
          values.push(Hours);

          if (i == tsidx) {
            values.push("nu");
          } else {
            values.push(null);
          }

          if (dambreaktsidx >= 0 && i == dambreaktsidx) {
            values.push("bres")
          } else {
            values.push(null);
          }

          for (let j = 0; j < nSeries; j++) {
            values.push(dates[key][j + 1]);
          }
          arr.push(values);
        }
        i++;
      });

    } else {
      let i = 0;

      //set our dambreak timestep index, if present
      if (MeshResults.scenarios.length > 0 && MeshResults.scenarios[0].DambreakT0Seconds) {
        EventT0.setSeconds(EventT0.getSeconds() + MeshResults.scenarios[0].DambreakT0Seconds);  //set EventT0 equal to the start of our simulation
        dambreaktsidx = GetDambreakTimestepIndex(dates, EventT0);
      }

      Object.keys(dates).forEach(key => {

        values = [];
        values.push(new Date(key));

        if (i == tsidx) {
          values.push("nu");
        } else {
          values.push(null);
        }

        console.log("pushing bres");
        if (dambreaktsidx >= 0 && i == dambreaktsidx) {
          values.push("bres")
        } else {
          values.push(null);
        }

        for (let j = 0; j < nSeries; j++) {
          values.push(dates[key][j + 1]);
        }
        i++;
        arr.push(values);
      });
    }

    // Set chart options
    var options = {
      // 'title': ID,
      annotations: {
        stem: {
          color: '#097138'
        },
        style: 'line'
      },
      legend: {
        position: 'right',
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        }
      },
      chartArea: {
        right: 200,   // set this to adjust the legend width
        left: 60,     // set this eventually, to adjust the left margin
      },
      'width': 600,
      'height': 350,
      vAxis: {
        title: vAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
      },
      hAxis: {
        title: xAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
        // viewWindow: {
        //   min: 0
        // }
      },
      seriesType: 'line',
      // series: { 0: { type: 'scatter', pointSize: 1 } },
      // series: {1: {type: 'line'}},
    };

    console.log("plotting now");

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(google.visualization.arrayToDataTable(arr), options);

  }
}


function drawStructureChart(ID, parameter, tsidx) {

  if (ID) {

    //prepare a Google datatable for our chart, create a column for the date and set the chart title and the axis title
    // let data = new google.visualization.DataTable();
    let arr = [];
    let header = [];
    let values = [];

    let EventT0 = new Date(Settings.SimulationT0);
    let dambreaktsidx = -1;

    // data.addColumn('date', 'Date');
    header.push("Date");
    header.push({ role: 'annotation', type: 'string' });  //annotation for current timestep
    header.push({ role: 'annotation', type: 'string' });  //annotation for time breach

    let chartTitle = document.getElementById("chart_title");
    document.getElementById('chart_subtitle').style.display = "none";
    chartTitle.innerText = ID;
    let vAxisTitle = "titel";
    let dates = {};

    if (parameter == 'discharge') {
      vAxisTitle = "Debiet (m3/s)";
    }

    //count the number of scenario's wwe have. This will be the number of columns in our datatable
    nScenarios = Settings.scenarios.length;
    let nSeries = 0;

    //each scenario gets its own column for the data to be stored in
    let seriesIdx = -1
    for (let myScenarioIdx = 0; myScenarioIdx < StructureResults.scenarios.length; myScenarioIdx++) {

      //find the feature we're dealing with!
      let myFeature = StructureResults.scenarios[myScenarioIdx].features.find(x => x.id === ID);

      if (parameter == 'discharge') {
        //only plot the currently active scenario because otherwise we have too many lines!
        seriesIdx = addDateTimeSeries(StructureResults.scenarios[myScenarioIdx].scenario, "discharge", header, dates, StructureResults.scenarios[myScenarioIdx].timesteps_second, myFeature.discharge, seriesIdx);
        nSeries++;
      }
    }

    //finally add our observed data
    let myObserved = measurements.locations.find(x => x.ModelID === ID);
    if (myObserved) {
      seriesIdx = addObservedSeries(header, dates, myObserved.Q.dates, myObserved.Q.values, seriesIdx);
      nSeries++;
    } else {
      console.log("No observed data found for ", ID);
    }

    //add our header to the results array
    arr.push(header);

    //and add all our data to the results array!
    let xAxisTitle = "Datum";
    if (xaxisrelative) {

      //set the starttime of our event so we can calculate the difference in hours
      xAxisTitle = "Tijd na aanvang simulatie (uren)"
      if (MeshResults.scenarios[0].DambreakT0Seconds) {
        xAxisTitle = "Tijd na aanvang bres (uren)"
        EventT0.setSeconds(EventT0.getSeconds() + MeshResults.scenarios[0].DambreakT0Seconds);
        dambreaktsidx = GetDambreakTimestepIndex(dates, EventT0);
      }

      let i = 0;
      Object.keys(dates).forEach(key => {

        let myDate = new Date(key);
        let Hours = getDifferenceBetweenTwoDatesInHours(EventT0, myDate);

        //only plot from two hours before our event
        if (Hours >= 0) {
          values = [];
          values.push(Hours);

          if (i == tsidx) {
            values.push("nu");
          } else {
            values.push(null);
          }

          if (dambreaktsidx >= 0 && i == dambreaktsidx) {
            values.push("bres")
          } else {
            values.push(null);
          }

          for (let j = 0; j < nSeries; j++) {
            values.push(dates[key][j + 1]);
          }
          arr.push(values);
        }
        i++;
      });

    } else {
      let i = 0;

      //set our dambreak timestep index, if present
      if (MeshResults.scenarios.length > 0 && MeshResults.scenarios[0].DambreakT0Seconds) {
        EventT0.setSeconds(EventT0.getSeconds() + MeshResults.scenarios[0].DambreakT0Seconds);  //set EventT0 equal to the start of our simulation
        dambreaktsidx = GetDambreakTimestepIndex(dates, EventT0);
      }

      Object.keys(dates).forEach(key => {

        values = [];
        values.push(new Date(key));

        if (i == tsidx) {
          values.push("nu");
        } else {
          values.push(null);
        }

        if (dambreaktsidx >= 0 && i == dambreaktsidx) {
          values.push("bres")
        } else {
          values.push(null);
        }

        for (let j = 0; j < nSeries; j++) {
          values.push(dates[key][j + 1]);
        }
        i++;
        arr.push(values);
      });
    }

    // Set chart options
    var options = {
      // 'title': ID,
      annotations: {
        stem: {
          color: '#097138'
        },
        style: 'line'
      },
      legend: {
        position: 'right',
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        }
      },
      chartArea: {
        right: 200,   // set this to adjust the legend width
        left: 60,     // set this eventually, to adjust the left margin
      },
      'width': 600,
      'height': 350,
      vAxis: {
        title: vAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
      },
      hAxis: {
        title: xAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
        // viewWindow: {
        //   min: 0
        // }
      },
      seriesType: 'line',
      // series: { 0: { type: 'scatter', pointSize: 1 } },
      // series: {1: {type: 'line'}},
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(google.visualization.arrayToDataTable(arr), options);

  }
}



function GetDambreakTimestepIndex(dates, EventT0) {
  //figure out which timestep index best matches the start of our dambreak so we can add a vertical annotation line there
  let i = 0;
  let minDif = 9E99;
  Object.keys(dates).forEach(key => {
    let myDate = new Date(key);
    let Hours = getDifferenceBetweenTwoDatesInHours(EventT0, myDate);
    if (Math.abs(Hours) < minDif) {
      minDif = Math.abs(Hours);
      dambreaktsidx = i
    }
    i++;
  })
  return dambreaktsidx;
}

function drawChart2DDepth(ID, tsidx) {

  if (ID) {

    //prepare a Google datatable for our chart, create a column for the date and set the chart title and the axis title
    let arr = [];
    let header = [];
    let values = [];
    let xAxisTitle = "Datum"

    let EventT0 = new Date(Settings.SimulationT0);
    let dambreaktsidx = -1;

    if (xaxisrelative) {
      header.push("Number");
    } else {
      header.push("Date");
    }

    header.push({ role: 'annotation', type: 'string' });
    header.push({ role: 'annotation', type: 'string' });

    let chartTitle = document.getElementById("chart_title");
    document.getElementById('chart_subtitle').style.display = "none";
    chartTitle.innerText = "Overstromingsdiepte";
    let vAxisTitle = "Waterdiepte (m)";

    let dates = {};

    //count the number of scenario's wwe have. This will be the number of columns in our datatable
    nScenarios = MeshResults.scenarios.length;
    let nSeries = 0;

    //each scenario gets its own column for the data to be stored in
    let seriesIdx = -1
    for (let myScenarioIdx = 0; myScenarioIdx < MeshResults.scenarios.length; myScenarioIdx++) {

      //first find the feature we're dealing with here and then add the incremental timeseries for this feature to our chart data
      let myFeature = MeshResults.scenarios[myScenarioIdx].features.find(x => x.i === ID);

      seriesIdx = addDateTimeSeriesFromIncrementalData(MeshResults.scenarios[myScenarioIdx].scenario, "waterdiepte", header, dates, MeshResults.scenarios[myScenarioIdx].timesteps_second, myFeature.t, myFeature.d, seriesIdx, 0.01);
      nSeries++;
    }

    //add our header to the results array
    arr.push(header);

    //and add all our data to the results array!
    if (xaxisrelative) {

      //set the starttime of our event so we can calculate the difference in hours
      xAxisTitle = "Tijd na aanvang simulatie (uren)"

      //set our dambreak timestep index, if present
      if (MeshResults.scenarios[0].DambreakT0Seconds) {
        xAxisTitle = "Tijd na aanvang bres (uren)"
        EventT0.setSeconds(EventT0.getSeconds() + MeshResults.scenarios[0].DambreakT0Seconds);  //set EventT0 equal to the start of our breach
        dambreaktsidx = GetDambreakTimestepIndex(dates, EventT0);
      }

      let i = 0;
      Object.keys(dates).forEach(key => {

        let myDate = new Date(key);
        let Hours = getDifferenceBetweenTwoDatesInHours(EventT0, myDate);

        //only plot from two hours before our event
        if (Hours >= 0) {
          values = [];
          values.push(Hours);

          if (i == tsidx) {
            values.push("nu");
          } else {
            values.push(null);
          }

          if (i == dambreaktsidx) {
            values.push("bres");
          } else {
            values.push(null);
          }

          for (let j = 0; j < nSeries; j++) {
            values.push(dates[key][j + 1]);
          }
          arr.push(values);
        }
        i++;
      });

    } else {

      //set our dambreak timestep index, if present
      if (MeshResults.scenarios[0].DambreakT0Seconds) {
        EventT0.setSeconds(EventT0.getSeconds() + MeshResults.scenarios[0].DambreakT0Seconds);  //set EventT0 equal to the start of our simulation
        dambreaktsidx = GetDambreakTimestepIndex(dates, EventT0);
      }

      //populate the array with all chart values: date + annotation1 + annotation2 + result + result etc.
      let i = 0;
      Object.keys(dates).forEach(key => {
        values = [];
        values.push(new Date(key));

        if (i == tsidx) {
          values.push("nu");
        } else {
          values.push(null);
        }

        if (i == dambreaktsidx) {
          values.push("bres");
        } else {
          values.push(null);
        }

        for (let j = 0; j < nSeries; j++) {
          values.push(dates[key][j + 1]);
        }
        i++;
        arr.push(values);
      });
    }

    // Set chart options
    var options = {
      annotations: {
        stem: {
          color: '#097138'
        },
        style: 'line'
      },
      legend: {
        position: 'right',
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        }
      },
      chartArea: {
        right: 200,   // set this to adjust the legend width
        left: 60,     // set this eventually, to adjust the left margin
      },
      'width': 600,
      'height': 350,
      vAxis: {
        title: vAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
      },
      hAxis: {
        title: xAxisTitle,
        textStyle: {
          fontName: 'Helvetica',
          fontSize: 14,
        },
        titleTextStyle: {
          fontName: 'Helvetica',
          fontSize: 16,
        }
        //title: 'Datum',
        // viewWindow: {
        //   min: 0
        // }
      },
      seriesType: 'line',
      // series: { 0: { type: 'scatter', pointSize: 1 } },
      // series: {1: {type: 'line'}},
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(google.visualization.arrayToDataTable(arr), options);
  }
}


function addDateTimeSeries(scenarioName, parameter, header, dates, timesteps_second, values, seriesIdx, multiplier = 1, cumulative = false) {
  seriesIdx++;
  header.push(scenarioName + ' ' + parameter);

  let startDate = new Date(Settings.SimulationT0);

  let year = startDate.getFullYear();
  let month = startDate.getMonth();
  let day = startDate.getDate();
  let hour = startDate.getHours();
  let minute = startDate.getMinutes();
  let second = startDate.getSeconds();
  let lastval = 0;

  //walk through all timesteps as specified in the Settings.js file and set the value for the current timestep + scenario in the datatable
  for (let tsidx = 0; tsidx < Settings.timesteps_second.length; tsidx++) {

    //set the date
    let curDate = new Date(year, month, day, hour, minute, second + Settings.timesteps_second[tsidx]);
    let curDateStr = curDate.toISOString().substring(0, 19)                      //convert our date to the ISO 8601 format, only keep YYYY-MM-DDTHH:mm:ss

    //check if this date is already existing as a key in our dictionary. If not, add it
    if (!(curDateStr in dates)) {
      dates[curDateStr] = {};
    }

    //so first look up the corresponding index for the given timestep in our timeseries
    let series_tsindex = timesteps_second.indexOf(Settings.timesteps_second[tsidx]);


    if (series_tsindex >= 0) {
      //yes. our series actually contains the exact timestep from the settings.timesteps_second array
      if (cumulative) {
        if (tsidx == 0) {
          //cumulatives always start with zero on the first timestep
          dates[curDateStr][seriesIdx + 1] = 0;   //set the value for this scenario and timestep in our dictionary      
          lastval = dates[curDateStr][seriesIdx + 1];
        } else {
          //we will multiply the discharge from the previous timestep with the timestep size and add that to our cumulative
          //however this can only be done if the timestep index in our series is > 0
          if (series_tsindex > 0) {
            dates[curDateStr][seriesIdx + 1] = lastval + multiplier * (Settings.timesteps_second[tsidx] - Settings.timesteps_second[tsidx - 1]) * values[series_tsindex - 1];   //set the value for this scenario and timestep in our dictionary      
            lastval = dates[curDateStr][seriesIdx + 1];
          } else {
            //apparently the index number found in our timeseries does not exceed 0 so we'll have to stick with 0 for our cumulative
            dates[curDateStr][seriesIdx + 1] = 0;   //set the value for this scenario and timestep in our dictionary      
            lastval = dates[curDateStr][seriesIdx + 1];
          }
        }
      } else {
        dates[curDateStr][seriesIdx + 1] = multiplier * values[series_tsindex];   //set the value for this scenario and timestep in our dictionary      
      }
      lastval = dates[curDateStr][seriesIdx + 1];
    } else {
      //unfortunately our series does not contain the exact timestep that we're looking for from the settings.timesteps_second array
      //therefore we will walk backwards in that array until we find the first value before the timestep we were looking for
      if (cumulative) {
        for (let j = timesteps_second.length - 1; j >= 0; j--) {
          if (timesteps_second[j] <= Settings.timesteps_second[tsidx]) {
            //we will multiply the discharge from the previous timestep with the timestep size and add that to our cumulative
            //however this can only be done if the timestep index found in our series is also > 0
            if (j > 0) {
              dates[curDateStr][seriesIdx + 1] = lastval + multiplier * (Settings.timesteps_second[tsidx] - Settings.timesteps_second[tsidx - 1]) * values[j];   //set the value for this scenario and timestep in our dictionary
              lastval = dates[curDateStr][seriesIdx + 1];
            } else {
              //apparently the index number found in our timeseries does not exceed 0 so we'll have to stick with 0 for our cumulative
              dates[curDateStr][seriesIdx + 1] = 0;   //set the value for this scenario and timestep in our dictionary      
              lastval = dates[curDateStr][seriesIdx + 1];
            }
            break;
          }
        }
      } else {
        for (let j = timesteps_second.length - 1; j >= 0; j--) {
          if (timesteps_second[j] <= Settings.timesteps_second[tsidx]) {
            dates[curDateStr][seriesIdx + 1] = multiplier * values[tsidx];   //set the value for this scenario and timestep in our dictionary
            break;
          }
        }
      }

      // dates[curDateStr][seriesIdx + 1] = NaN;   //set the value for this scenario and timestep in our dictionary      
    }
  }
  return seriesIdx;
}



function addObservedSeries(header, dates, ResultDates, ResultValues, seriesIdx, cumulative = false) {
  seriesIdx++;
  header.push("gemeten");

  //walk through all timesteps as specified in the Settings.js file and set the value for the current timestep + scenario in the datatable
  let startDate = new Date(Settings.SimulationT0);
  let year = startDate.getFullYear();
  let month = startDate.getMonth();
  let day = startDate.getDate();
  let hour = startDate.getHours();
  let minute = startDate.getMinutes();
  let second = startDate.getSeconds();
  let lastval = 0;

  let timesteps_template = Settings.timesteps_second;   //the timesteps specified in Settings form the basis for all our charts
  for (let tsidx = 0; tsidx < timesteps_template.length; tsidx++) {

    //set the date
    let curDate = new Date(year, month, day, hour, minute, second + timesteps_template[tsidx]);
    let curDateStr = curDate.toISOString()   //.substring(0, 24)                      //convert our date to the ISO 8601 format, only keep YYYY-MM-DDTHH:mm:ss.sssZ

    //now look up the index number for this date in our observed data array
    let obsIdx = ResultDates.indexOf(curDateStr);
    if (obsIdx >= 0) {
      //yess we actually found our desired timestep in the observed series
      let curDateStr = curDate.toISOString().substring(0, 19)                      //convert our date to the ISO 8601 format, only keep YYYY-MM-DDTHH:mm:ss
      if (cumulative) {
        if (tsidx == 0) {
          //cumulative results always start at 0
          dates[curDateStr][seriesIdx + 1] = 0;                                    //add our observed value
          lastval = dates[curDateStr][seriesIdx + 1];
        } else {
          //we use the result of the previous timestep value found and multiply it with the timestep size
          //however this can only be done when obsIdx is also > 0
          if (obsIdx > 0) {
            dates[curDateStr][seriesIdx + 1] = lastval + (timesteps_template[tsidx] - timesteps_template[tsidx - 1]) * ResultValues[obsIdx - 1];                              //add our observed value
            lastval = dates[curDateStr][seriesIdx + 1];
          } else {
            //we have to stick to 0 for now
            dates[curDateStr][seriesIdx + 1] = 0
            lastval = dates[curDateStr][seriesIdx + 1];
          }
        }
      } else {
        dates[curDateStr][seriesIdx + 1] = ResultValues[obsIdx];                              //add our observed value
      }

    } else {
      if (cumulative) {
        //unfortunately our series does not contain the exact timestep from the settings.timesteps_second array
        //therefore we will walk backwards in that array until we find the first value before the timestep we were looking for
        for (let j = ResultDates.length - 1; j >= 0; j--) {
          if (ResultDates[j] <= curDate) {
            //found in our series the first timestep before the one we are looking for for our chart
            if (tsidx == 0) {
              //cumulatives always start with zero on the first timestep
              dates[curDateStr][seriesIdx + 1] = 0;   //set the value for this scenario and timestep in our dictionary
              lastval = dates[curDateStr][seriesIdx + 1]
            } else {
              //we will multiply the discharge from the first value just before the current timestep and add that to our cumulative
              dates[curDateStr][seriesIdx + 1] = lastval + multiplier * (Settings.timesteps_second[tsidx] - Settings.timesteps_second[tsidx - 1]) * ResultValues[j];   //set the value for this scenario and timestep in our dictionary
              lastval = dates[curDateStr][seriesIdx + 1];
            }
            break;
          }
        }
      } else {
        dates[curDateStr.substring(0, 19)][seriesIdx + 1] = NaN;
      }
    }
  }
  return seriesIdx;
}


