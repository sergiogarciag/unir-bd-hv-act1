// Dimensiones del mapa
const width = 800;
const height = 600;

const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", function (event) {
        console.log("event: ", event);
        const {transform} = event;
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
    });

// Crear lienzo SVG
const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Proyección geográfica para España
const projection = d3.geoMercator()
    .center([-3, 40])
    .scale(2000)
    .translate([width / 2, height / 2]);

// Crear ruta (path) para dibujar las provincias
const path = d3.geoPath().projection(projection);

// Cargar datos TopoJSON de las provincias de España
d3.json("provinces.json").then(function(data) {

    d3.json("resultados.json").then(function(info) {

    console.log("data: ", data);
    // Convertir TopoJSON a GeoJSON
    //const geoData = topojson.feature(data, data.objects.autonomous_regions);
    const geoData = topojson.feature(data, data.objects.provinces);

    // Dibujar las provincias
    svg.selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "red")
        .style("stroke", "black")
        .style("stroke-width", 0.5)
        .on("click", (d, e) => {
            console.log("click: ", d, e);
            pintarTooltip(d, e);

            div.transition()
            .duration(200)
            .style("opacity", 0.9);

            // dataInfo = filtrarPorProvincia(info, d.id);
            dataInfo = info[d.id];
            console.log("dataInfo: ", dataInfo);

            textoHTML = "Resultados: <br/><b>" + d.properties.name + "</b><br/>";
            if (dataInfo) {
                textoHTML += "Nombre: " + dataInfo.nombre + "<br/>";
                textoHTML += "Genero: " + dataInfo.ambos.descripcion + "<br/>";
                textoHTML += "Año: 2022" + "<br/>";
                textoHTML += "Tasa Actividad:  " + dataInfo.ambos[2022].actividad.T1 + " % <br/>";
                textoHTML += "Tasa Empleo:  " + dataInfo.ambos[2022].empleo.T1 + " % <br/>"; 
                textoHTML += "Tasa Paro:  " + dataInfo.ambos[2022].paro.T1 + " % <br/>";
            }

            div.html(textoHTML)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

            // Obtener el contenedor HTML
            const container = d3.select("#json-container");



            // Llamar a la función recursiva para crear los elementos HTML
            crearElementos(dataInfo, container);
        })
        .on("mouseover", function(d, e) {
            console.log("mouseover: ", d, e);
            // Mostrar información sobre la provincia
            d3.select(this).style("fill", "orange");
            pintarTooltip(d, e);
          })
        .on("mouseout", function(d, e) {
            console.log("mouseout: ", d, e);
            // Dejar de mostrar información sobre la provincia
            d3.select(this).style("fill", "red");
            borrarTooltip();
        });

    svg.call(zoom);

    // Colocamos
    const tooltip = d3.select("body")
      .append("div")
      .attr("class","tooltip")

    function borrarTooltip(){
        console.log("borraTooltip");
        tooltip
            .style("opacity",0)         
    };

    function pintarTooltip(d, e){
       
        console.log("pintarTooltip.d: ", d);
        console.log("pintarTooltip.name: ", d.properties.name);
        console.log("pintarTooltip.d3.event.pageY: ", d3.event.pageY);
        console.log("pintarTooltip.d3.event.pageX: ", d3.event.pageX);
        console.log("pintarTooltip.d3.event: ", d3.event);
        console.log("pintarTooltip.e: ", e);
       
        tooltip //.text (d.partido)
        .text(d.properties.name)
        .style ("top", d3.event.pageY + "px")
        .style ("left", d3.event.pageX + "px")
        // Para que la aparición no se brusca
        //.transition()
        .style("opacity",1);  
    }

    // Función recursiva para crear elementos HTML para cada campo y valor del objeto JSON
    function crearElementos(objeto, contenedor) {
        for (let key in objeto) {
            const value = objeto[key];
            const div = contenedor.append("div");
            const strong = div.append("strong").text(key + ": ");
    
            if (typeof value === 'object') {
                crearElementos(value, div);
            } else {
                const span = div.append("span").text(value);
            }
        }
    }

    });
});

