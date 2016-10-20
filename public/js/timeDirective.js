angular.module('omniMood')
  .directive('whateveryouwant', function() {
    return {
      restrict: 'E',
      scope: {

      },
      link: somethingelse
    };

    function somethingelse(scope, element, attr) {
      var mapSVG = d3.select(element[0]).append("svg")
        .attr("id", "svg_map"),
        width = window.innerWidth * .70,
        height = window.innerHeight * .70,
        outlineDefault = "#eeeeee",
        outlineHighlight = "#1221ee",
        fillDefault = "#000000",
        moodMin = -10,
        moodMid = 0,
        moodMax = 10,
        countryArrayIndex = 0;

      var moodScale = d3.scaleLinear()
        .domain([moodMin, moodMid, moodMax])
        .range(["red", "yellow", "green"]);

      var g = mapSVG
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("id", "map-container");

      g
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "steelblue");

      d3.json("../json/countries_no_show_antarctica.json", function(error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        var projection = d3.geoMercator()
          .scale((height + 50) / (1.55 * Math.PI))
          .translate([width / 2, height / 1.5]);

        var path = d3.geoPath()
          .projection(projection);

        g.selectAll(".country")
          .data(countries)
          .enter().insert("path", ".graticule")
          .attr("id", function(d) {
            return "cc" + (d.properties.iso_n3 / 1);
          })
          .attr("d", path)
          .attr("stroke", outlineDefault)
          .on("mouseover", function(d) {
            d3.select(this)
            .attr("stroke", outlineHighlight);
          })

          .on("mouseout", function() {
            d3.select(this)
              .attr("stroke", outlineDefault);
          })
          .on("click", function (d) {
            var w = width;
            var h = height;
            var centroid = path.centroid(d);
            var x = w / 2 - centroid[0];
            var y = h / 2 - centroid[1];

            countryId = "path#cc" + d.properties.iso_n3;

            mapSVG
              .append("g")
              .attr("id", "countryInfo-wrapper");

            d3.select("g#map-container")
              .transition()
              .delay(250)
              .attr("visibility", "hidden");

            var g = d3.select("g#countryInfo-wrapper")
              .append("g")
              .attr("id", "country-wrapper")
              .insert("path", countryId)
              .attr("d", this.attributes.d.value)
              .attr("stroke", "red")
              .transition()
              .delay(250)
              .attr("transform", "translate(" + x + "," + y + ")")
              .style("stroke", "#eeeeee")
              .style("fill", "#000000");

            d3.select("g#country-wrapper")
              .append("text")
              .text(d3.select(this).text())
              .attr("transform", "translate(800, 50)")
              .transition()
              .delay(250)
              .style("font-size", "25")
              .style("font-family", "serif")
              .style("text-anchor", "middle")
              .style("font-weight", "bold")
              .style("fill", "orange");

            d3.select("g#countryInfo-wrapper")
              .on("click", backToMap);
        })
        .append("svg:title")
        .text(function(d) {
          return d.properties.name;
        });
      });
    }
    function backToMap () {
      d3.select("g#countryInfo-wrapper")
        .remove();
      d3.select("g#map-container")
        .attr("visibility", "visible");
    }
  });
      var moodScale = d3.scaleLinear()
        .domain([-10, 0, 10])
        .range(["red", "yellow", "green"]);

d3.json('http://localhost:3000/api/timeline', function(error, timeData) {
    var countries = timeData.countries;
    d3.select('#timeRange').
      on('change', function(stuff){
        var timePlace = document.getElementById("timeRange").value;
        for(var country in countries){
          d3.select("path#cc" + country)
              .style("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", 1)
              .transition()
              .duration(2000)
              .attr("stroke","#eeeeee")
              .attr("stroke-width", 1)
              .style("fill", moodScale(countries[country][timePlace] * 10));
        }
      });
    });