/* Stylesheet by Yifeng Ai, 2019 */
//initialize function called when the script loads
window.onload = setMap()

function setMap() {
 //map frame dimensions
    var width = 960,
        height = 480;

    //create new svg container for the map
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    //create Albers equal area conic projection centered on Asia
    var projection = d3.geoAlbers()
        .center([3.64,36.33])
        .rotate([-91, 7.27, 0])
        .parallels([18.36,52])
        .scale(400)
        .translate([width / 2, height / 2]);
    var path = d3.geoPath()
        .projection(projection);

    //use Promise.all to parallelize asynchronous data loading
    var promises = [];
    promises.push(d3.csv("data/China_province_data.csv")); //load attributes from csv
    promises.push(d3.json("data/Asia_countries.topojson")); //load background spatial data
    promises.push(d3.json("data/China_provinces.topojson")); //load choropleth spatial data
    Promise.all(promises).then(callback);

    function callback(data){
        var graticule = d3.geoGraticule()
            .step([5, 5]); //place graticule lines every 5 degrees of longitude and latitude

        //create graticule lines
        var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
            .data(graticule.lines()) //bind graticule lines to each element to be created
            .enter() //create an element for each datum
            .append("path") //append each element to the svg as a path element
            .attr("class", "gratLines") //assign class for styling
            .attr("d", path); //project graticule lines

	    csvData = data[0];
	    asia = data[1];
	    china = data[2];

        // get geographic paths from Asia_countries and China_provinces
        var asia_countries = topojson.feature(asia, asia.objects.Asia_countries),
            china_provinces = topojson.feature(china, china.objects.China_provinces).features
        
        console.log(asia_countries, china_provinces)
        
        // append the path from countries
        var countries = map.append("path")
            .datum(asia_countries)
            .attr("class", "asia_countries")
            // data will be projected according to variable path
            .attr("d", path);

        //add France regions to map
        var regions = map.selectAll(".regions")
            .data(china_provinces)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "regions " + d.properties.ADM1_EN;
            })
            // data will be projected accodingto variable path
            .attr("d", path);
        };
        //examine the results
        console.log('HERE',regions);
        console.log();
};