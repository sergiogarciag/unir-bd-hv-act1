d3.json("georef-spain-municipio@public.geojson").then(function(data) {
    // Crear una proyección geográfica
    var projection = d3.geoMercator().fitSize([500, 600], data);

    // Crear un generador de caminos geográficos
    var path = d3.geoPath().projection(projection);

    // Seleccionar el SVG
    var svg = d3.select("#mapa");

    // Dibujar cada provincia
    svg.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .on("mouseover", function(d) {
            // Mostrar información sobre la provincia
            d3.select(this).style("fill", "orange");
            console.log(d.properties.name);
        })
        .on("mouseout", function(d) {
            // Ocultar información sobre la provincia
            d3.select(this).style("fill", "steelblue");
        });
});

