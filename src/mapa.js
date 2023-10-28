console.log("Arrancando script.js");

d3.json("https://raw.githubusercontent.com/sergiogarciag/datasets/master/provincias-espanolas.geojson").then(function (datos) {
    
    console.log("Datos cargados");
   
     var h=700;
    var w=800;
    
    var margin = {
        top: 60,
        bottom: 60,
        left:60,
        right:50
    }
    
    // Nueva section
    d3.select("body").append("h1").text("Provincias");
                                                           
    // Vamos a crear la lista
    var elementoUl = d3.select("body").append("ul");
    
    //Posibilidad 1: recorriendo los elementos
    //datos.features.forEach(function (d){
    //    elementoUl.append("li").text(d.properties.provincia);        
    // });

    var svg = d3.select("body")
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 " + w + " " + h).style("background","#c9e8fd")
                .classed("svg-content", true);
    
    var projection = d3.geoMercator()
                        .translate([w/2, h/2])
                        .scale(2200)
                        .center([0,40]);
    
    var escalaColor = d3.scaleLinear ()
                        .domain ([1,25, 55])
                        .range (["red", "grey", "blue"])
    
    var path = d3.geoPath().projection(projection);
    
    svg.selectAll("path")
        .data(datos.features)
        .enter()
        .append("path")
        .attr("class","provincias")
        .attr("d", path)
        .attr("fill", function(d) { return escalaColor(d.properties.codigo) } )
        .on("mouseover", function(d) {
                      //pintarHistograma(d.partido)
                      pintarTooltip (d)
               })
        .on("mouseout", borrarTooltip);
    
    var tooltip = d3.select ("body")
                    .append("div")
                    .attr("class","tooltip");

    // Posibilidad 2: usando la función enter 
    /*
    elementoUl
        .selectAll("li")
        .data(datos) // JOIN
        .enter()
        .append("li")
        // Solo para testear
        //.text("hola")
        .text(function (d) {return d.partido; });   
    */
    
       /* Funciones para gestionar los Tooltips */
    function borrarTooltip(){
         tooltip// .transition()
                .style("opacity",0)         
    };
    
    function pintarTooltip(d){
        tooltip //.text (d.partido)
               .text(d.properties.provincia)
               .style ("top", d3.event.pageY + "px")
               .style ("left", d3.event.pageX + "px")
               // Para que la aparición no se brusca
               //.transition()
               .style("opacity",1);   
    }
});

