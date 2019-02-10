var svgHeight = 600,
    svgWidth = 960,
    margin = {top: 20, right: 20, bottom: 40, left: 40},
    height = svgHeight - margin.top - margin.bottom,
    width = svgWidth - margin.left - margin.right;

var chartData = []; //initialize this to be the holder for the data once the promise completes

var xValue = function(data) { return data.length; },
    xScale = d3.scaleLinear().range([0,width]),
    xMap = function(data) { return xScale(xValue(data)); },
    xAxis = d3.axisBottom().scale(xScale).ticks(10);

var yValue = function(data) { return data.width; },
    yScale = d3.scaleLinear().range([height,0]),
    yMap = function(data) { return yScale(yValue(data)); },
    yAxis = d3.axisLeft().scale(yScale).ticks(10);

var cValue = function(data) { return data.species; },
    cScale = d3.scaleOrdinal(d3.schemeCategory10),
    cMap = function(data) { return cScale(cValue(data)); };

var svg = d3.select('.chart')
                .attr('height',svgHeight)
                .attr('width',svgWidth).append('g')
                    .attr('transform','translate('+margin.left + ',' + margin.top + ')');

svg.append('g')
    .attr('class','xaxis')
    .attr('transform','translate(0,' + height + ')');

svg.append('g')
    .attr('class','yaxis');

d3.csv('http://localhost:8000/iris.csv', function(d,i) { return {row: i, species: d.species, length: +d.petal_length, width: +d.petal_width}})
    .then(function(data) { 
        chartData = data;
        updateData(data);
    })
    .catch(function(err) { console.log(err); });

var updateData = function(data) {

    //update
    xScale.domain([0,d3.max(data, xValue)]);
    yScale.domain([0,d3.max(data, yValue)]);

    svg.select('.xaxis').call(xAxis);
    svg.select('.yaxis').call(yAxis);

    var selection = svg.selectAll('.dot')
        .data(data)
            .attr('class', 'dot')
            .attr('cx', xMap)
            .attr('cy', yMap)
            .attr('r', 5)
            .attr('fill', cMap)
            .attr('species', cValue);

    //enter
    selection.enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', xMap)
            .attr('cy', yMap)
            .attr('r',5)
            .attr('fill', cMap)
            .attr('species', cValue);
    
    //exit
    selection.exit().remove();
};