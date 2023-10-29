d3.json("https://unpkg.com/es-atlas/es/municipalities.json")
  .catch(err => console.warn(err))
  .then(es => {
    svg
      .append('path')
      .attr('d', path(topojson.mesh(es)))
      .attr('fill', 'none')
      .attr('stroke', 'black');

    svg
      .append('path')
      .attr('d', projection.getCompositionBorders())
      .attr('fill', 'none')
      .attr('stroke', 'black');
  })
</script>