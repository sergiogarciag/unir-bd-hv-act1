d3.json(
    "https://raw.githubusercontent.com/sergiogarciag/datasets/master/provincias-espanolas.geojson"
).then(function (datos) {
    var h = 700;
    var w = 1000;

    //Creamos el elemento SVG.
    var svg = d3
        .select("body")
        .append("svg")
        .attr("width", "750")
        .attr("height", "600")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "-320 150 " + w + " " + h)
        .classed("svg-content", true);

    //Creamos la proyección. Necesaria para transformar la geometría poligonal esférica en geometría plana.
    var projection = d3
        .geoMercator()
        .translate([w / 2, h / 2])
        .scale(1900)
        .center([0, 40]);

    //Por darle color (orden alfabético, de rojo a gris y a azul)
    var escalaColor = d3
        .scaleLinear()
        .domain([1, 25, 55])
        .range(["red", "grey", "blue"]);

    var path = d3.geoPath().projection(projection);

    var flag = false; //booleano para que elimine el nombre de la provincia sólo si se ha clickado alguna vez.

    svg.selectAll("path")
        .data(datos.features)
        .enter()
        .append("path")
        .attr("class", "provincias")
        .attr("d", path)
        .attr("fill", function (d) {
            return escalaColor(d.properties.codigo);
        })
        .on("click", function (d) {
            if (flag) {
                borrarTooltip();
            }
            pintando(d);
        });

    /*  - Escribe el nombre de la provincia y su código en las coordenadas en las que ha clickado.
        - Si clicka en otra provincia, se elimina la que había.
        */
    function pintando(d) {
        flag = true;
        var pp = document.createElement("div");
        pp.textContent = d.properties.codigo + "--" + d.properties.provincia;
        pp.id = "name_provincia";
        pp.setAttribute(
            "style",
            "transition-duration: 500ms; transition-property: margin-right; background-color: black; color:white; position: absolute; top: " +
                event.pageY + //o ClientX. Mejor pageX, así siempre va a coger las
                //coordenadas donde está el mouse, de la otra manera, si amplias la pantalla se descoordina
                "px; left: " +
                event.pageX +
                "px;"
        );
       // pp.style.transition = "margin-right 2s"; //Ni caso
        document.getElementsByTagName("body")[0].appendChild(pp);
    }

    function borrarTooltip() {
        document.getElementById("name_provincia").remove();
    }
});
