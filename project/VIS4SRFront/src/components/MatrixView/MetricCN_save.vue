<template>
    <g>
        <rect :width="width" :height="height" fill="none"></rect>
    </g>
</template>

<script>
import * as d3 from "d3";

export default {
    name: "MetricCN",
    props:['width', 'height', 'slice', 'firstLayerAttrs', 'metricName', 'datasetIdToColor'],
    methods:{
        drawMetrics(container, d, metricName,  columnWidth, colorScale){
            let avgs = []
            this.firstLayerAttrs.forEach((flAttr, index)=>{
                avgs.push({'flAttr': flAttr,
                    'avg': d3.mean(d[1], val=>val[flAttr][metricName]),
                    'min': d3.min(d[1], val=>val[flAttr][metricName]),
                    'max': d3.max(d[1], val=>val[flAttr][metricName]),
                    'index': index
                })
            })
            let metricScale = null
            if(metricName != 'psnrs'){
                metricScale = d3.scaleLinear().domain([0, 1]).range([0, columnWidth])
            }else{
                metricScale = d3.scaleLinear().domain([0, 80]).range([0, columnWidth])
            }
            container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                .attr('cx', c=>metricScale(c.avg))
                .attr('cy', c=>(this.height) / (this.firstLayerAttrs.length + 1) * (c.index+1))
                .attr('r', 3).attr('fill', 'none').attr('stroke', c=>colorScale(c.flAttr))

            container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                .attr('cx', c=>metricScale(c.min))
                .attr('cy', c=>(this.height) / (this.firstLayerAttrs.length + 1) * (c.index+1))
                .attr('r', 2).attr('fill', c=>colorScale(c.flAttr)).attr('stroke', c=>colorScale(c.flAttr))

            container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                .attr('cx', c=>metricScale(c.max))
                .attr('cy', c=>(this.height) / (this.firstLayerAttrs.length + 1) * (c.index+1))
                .attr('r', 2).attr('fill', c=>colorScale(c.flAttr)).attr('stroke', c=>colorScale(c.flAttr))

            container.append('g').selectAll('line').data(avgs).enter().append('line')
                .attr('x1', c=>metricScale(c.min)).attr('x2', c=>metricScale(c.max))
                .attr('y1', c=>(this.height) / (this.firstLayerAttrs.length + 1) * (c.index+1))
                .attr('y2', c=>(this.height) / (this.firstLayerAttrs.length + 1) * (c.index+1))
                .attr('stroke', c=>colorScale(c.flAttr)).attr('stroke-width', 2)

            container.append('rect').attr('width', columnWidth)
                .attr('x', 0)
                .attr('height', this.height).attr('stroke-width', 0.5)
                .attr('fill' ,'none').attr('stroke', 'grey').attr('stroke-dasharray',"3 1")
        }
    },
    mounted(){
        let container = d3.select(this.$el).append('g');
        this.drawMetrics(container, this.slice, this.metricName, this.width, this.datasetIdToColor)
    }
}
</script>

<style scoped>

</style>