// Dimensiones del mapa
const width = 800;
const height = 600;

// Crear lienzo SVG
const svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const div = d3.select("#info")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const body = d3.select("body");

// Tooltip
const tooltip = d3.select("body")
  .append("div")
  .attr("class","tooltip")

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
            mostrarInformacion(info, d);
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

    // Generar texto en formato HTML listo para mostrar
    function generarTextoHTML (d, data) { 
        textoHTML = "<h3>" + d.properties.name + "</h3>";
        if (dataInfo) {
            textoHTML += "Provincia: " + dataInfo.nombre + "<br/>";
            textoHTML += "Genero: " + dataInfo.ambos.descripcion + "<br/><br/>";
            textoHTML += "<b>Datos Históricos</b><br/>";
            textoHTML += "<table>";
            textoHTML += "<tr>";
            textoHTML += "<th>Año</th>";
            textoHTML += "<th>Tasa Actividad</th>";
            textoHTML += "<th>Tasa Empleo</th>";
            textoHTML += "<th>Tasa Empleo</th>";
            textoHTML += "</tr>"
            
            // Bucle que va desde 2002 hasta 2023
            for (let anio = 2002; anio <= 2023; anio++) {
                console.log("Año:", anio);
                textoHTML += "<tr>"
                textoHTML += "<td>" + anio + "</td>";
                textoHTML += "<td>" + dataInfo.ambos[anio].actividad.T3 + " % </td>";
                textoHTML += "<td>" + dataInfo.ambos[anio].empleo.T3 + " % </td>"; 
                textoHTML += "<td>" + dataInfo.ambos[anio].paro.T3 + " % </td>";
                textoHTML += "</tr>"
            }
    
            textoHTML += "</table>";
        }
        return textoHTML;
    }

    function mostrarInformacion (info, d) {
            
        // Recupera la información de la provincia seleccionada
        dataInfo = info[d.id];
        console.log("dataInfo: ", dataInfo);
        textoHTML = generarTextoHTML(d, dataInfo)
        
        const bodyWidth = body.node().getBoundingClientRect().width;
        
        const left = bodyWidth - 400;
        const top = 30;
        
        console.log("left: ", left);
        
        // Insertamos información provincia en formato HTML
        div.html(textoHTML)
           .style("top", (d3.event.pageY - 28) + "px")
           .style("top", (top) + "px");
        // .style("left", (d3.event.pageX) + "px")
        // .style("left", (left) + "px");
        
        div.transition()
           .duration(200)
           .style("opacity", 0.9);

        // // Obtener el contenedor HTML
        // const container = d3.select("#json-container");
        //
        // // Llamar a la función recursiva para crear los elementos HTML
        // crearElementos(dataInfo, container);
    };

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

