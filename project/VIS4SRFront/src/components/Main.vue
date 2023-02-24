<template>
    <div class="hello" style="height: 100%;">
        <svg width="3000" height="1000" style="background-color: none">

        </svg>
    </div>
</template>

<script>

import {mapState} from "vuex";
import * as d3 from "d3"

export default {
    name: 'MainComponent',
    props: [

    ],
    components: {

    },
    data(){
        return {
            selectGroups: [],
            visConfig:{
                totalHeight: 800,
                totalLength: 1200,
                unitHeight: 30,
            }
        }
    },
    methods:{

    },
    mounted(){

    },
    watch:{
        imageMetrics(val){
            let results = d3.groups(val, d=>d.label)
            this.selectGroups = results.splice(0, 10)
            console.log('this.select_groups ', this.selectGroups)

            let rootContainer = d3.select(this.$el).select('svg').append('g').attr('transform', 'translate(50, 100)');
            let sliceContainers = rootContainer.selectAll('.sliceContainer')
                .data(this.selectGroups).enter().append('g').attr('class', 'sliceContainer')
                .attr('transform', (d, i)=>{
                    return 'translate(' + [0, i * this.visConfig.unitHeight] + ')'
                })
            sliceContainers.append('rect').attr('width', this.visConfig.totalHeight).attr('height', this.visConfig.unitHeight)
                .attr('stroke', 'grey').attr('fill', 'none')
            let _this = this


            // let labelOffsetX = 0
            let sliceId = 'Label'
            let columnWidth = 50
            rootContainer.append('text').text(sliceId).style('font-size', 10).attr('transform', 'translate(10, 0) rotate(-45)')
            sliceContainers.each(function(d){
                let _container = d3.select(this)
                // label of slice
                let text = _container.append('text').style('font-size', 10).text(d[0])
                let bBox = text.node().getBBox()
                text.attr('y', bBox.height +  (_this.visConfig.unitHeight - bBox.height) / 2)

                _container.append('rect').attr('width', columnWidth).attr('height', _this.visConfig.unitHeight)
                    .attr('stroke' ,'blue').attr('fill', 'none')
                // _container.append('rect').attr('stroke', 'red').attr('fill', 'none')
                //     .attr('x', bBox.x).attr('y', bBox.y)
                //     .attr('height', bBox.height).attr('width', bBox.width)

            })

            // Entity number
            let numberOffsetX = 50
            columnWidth=50
            rootContainer.append('text').text('Number').style('font-size', 10)
                .attr('transform', 'translate('+[numberOffsetX, 0]+') rotate(-45)')
            sliceContainers.each(function(d){
                let _container = d3.select(this)
                // Number of images
                let number = _container.append('text').style('font-size', 10).text(d[1].length).attr('x', numberOffsetX)
                let bBox = number.node().getBBox()
                bBox = number.node().getBBox()
                number.attr('y', bBox.height +  (_this.visConfig.unitHeight - bBox.height) / 2)
                // _container.append('rect').attr('stroke', 'red').attr('fill', 'none')
                //     .attr('x', bBox.x).attr('y', bBox.y)
                //     .attr('height', bBox.height).attr('width', bBox.width)
                _container.append('rect').attr('width', columnWidth)
                    .attr('x', numberOffsetX)
                    .attr('height', _this.visConfig.unitHeight)
                    .attr('stroke', 'green').attr('fill', 'none')
                // .attr('fill' ,'green').attr('opacity', 0.3)
            })

            // Metric lpips




            numberOffsetX += 50
            let metricName = 'lpips'
            rootContainer.append('text').text('Metrics').style('font-size', 15)
                .attr('transform', 'translate('+[numberOffsetX, -30]+')')
            let colorScale = d3.scaleOrdinal().domain(_this.datasetIds).range(d3.schemeCategory10)

            let g = rootContainer.append('g').attr('transform', 'translate(' + [numberOffsetX, -80] + ')')
            let legendContainers = g.selectAll('.datasetLegend').data(this.datasetIds).enter().append('g')
                .attr('transform', (d, i) => 'translate(' + [0, 10 * i] + ')')
            legendContainers.append('circle').attr('r', 5).attr('fill', d=>colorScale(d))
            legendContainers.append('text').style('font-size', 10).text(d=>d).attr('y', 5).attr('x', 10)

            rootContainer.append('text').text('Lpips').style('font-size', 10)
                .attr('transform', 'translate('+[numberOffsetX, 0]+') rotate(-45)')

            columnWidth=100
            sliceContainers.each(function(d){
                let _container = d3.select(this)
                // Number of images
                let avgs = []
                _this.datasetIds.forEach((datasetid, index)=>{
                    avgs.push({'datasetId': datasetid,
                        'avg': d3.mean(d[1], val=>val[datasetid][metricName]),
                        'min': d3.min(d[1], val=>val[datasetid][metricName]),
                        'max': d3.max(d[1], val=>val[datasetid][metricName]),
                        'index': index
                    })
                })
                let metricScale = d3.scaleLinear().domain([0, 1]).range([0, columnWidth])

                _container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                    .attr('cx', c=>numberOffsetX + metricScale(c.avg))
                    .attr('cy', c=>(_this.visConfig.unitHeight) / (_this.datasetIds.length + 1) * (c.index+1))
                    .attr('r', 3).attr('fill', 'none').attr('stroke', c=>colorScale(c.datasetId))

                _container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                    .attr('cx', c=>numberOffsetX + metricScale(c.min))
                    .attr('cy', c=>(_this.visConfig.unitHeight) / (_this.datasetIds.length + 1) * (c.index+1))
                    .attr('r', 3).attr('fill', c=>colorScale(c.datasetId)).attr('stroke', c=>colorScale(c.datasetId))

                _container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                    .attr('cx', c=>numberOffsetX + metricScale(c.max))
                    .attr('cy', c=>(_this.visConfig.unitHeight) / (_this.datasetIds.length + 1) * (c.index+1))
                    .attr('r', 3).attr('fill', c=>colorScale(c.datasetId)).attr('stroke', c=>colorScale(c.datasetId))

                _container.append('g').selectAll('line').data(avgs).enter().append('line')
                    .attr('x1', c=>numberOffsetX + metricScale(c.min)).attr('x2', c=>numberOffsetX + metricScale(c.max))
                    .attr('y1', c=>(_this.visConfig.unitHeight) / (_this.datasetIds.length + 1) * (c.index+1))
                    .attr('y2', c=>(_this.visConfig.unitHeight) / (_this.datasetIds.length + 1) * (c.index+1))
                    .attr('stroke', c=>colorScale(c.datasetId)).attr('stroke-width', 2)

                _container.append('rect').attr('width', columnWidth)
                    .attr('x', numberOffsetX)
                    .attr('height', _this.visConfig.unitHeight)
                    .attr('fill' ,'none').attr('stroke', 'red')
            })

            // Metric Ssim
            numberOffsetX += columnWidth
            metricName = 'ssims'
            rootContainer.append('text').text('Ssim').style('font-size', 10)
                .attr('transform', 'translate('+[numberOffsetX, 0]+') rotate(-45)')
            sliceContainers.each(function(d){
                let _container = d3.select(this)
                // Number of images
                let avgs = []
                _this.datasetIds.forEach((datasetid, index)=>{
                    avgs.push({'datasetId': datasetid,
                        'avg': d3.mean(d[1], val=>val[datasetid][metricName]),
                        'min': d3.min(d[1], val=>val[datasetid][metricName]),
                        'max': d3.max(d[1], val=>val[datasetid][metricName]),
                        'index': index
                    })
                })
                let metricScale = d3.scaleLinear().domain([0, 1]).range([0, columnWidth])

                _container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                    .attr('cx', c=>numberOffsetX + metricScale(c.avg))
                    .attr('cy', c=>(_this.visConfig.unitHeight) / (_this.datasetIds.length + 1) * (c.index+1))
                    .attr('r', 3).attr('fill', 'none').attr('stroke', c=>colorScale(c.datasetId))

                _container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                    .attr('cx', c=>numberOffsetX + metricScale(c.min))
                    .attr('cy', c=>(_this.visConfig.unitHeight) / (_this.datasetIds.length + 1) * (c.index+1))
                    .attr('r', 2).attr('fill', c=>colorScale(c.datasetId)).attr('stroke', c=>colorScale(c.datasetId))

                _container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                    .attr('cx', c=>numberOffsetX + metricScale(c.max))
                    .attr('cy', c=>(_this.visConfig.unitHeight) / (_this.datasetIds.length + 1) * (c.index+1))
                    .attr('r', 2).attr('fill', c=>colorScale(c.datasetId)).attr('stroke', c=>colorScale(c.datasetId))

                _container.append('g').selectAll('line').data(avgs).enter().append('line')
                    .attr('x1', c=>numberOffsetX + metricScale(c.min)).attr('x2', c=>numberOffsetX + metricScale(c.max))
                    .attr('y1', c=>(_this.visConfig.unitHeight) / (_this.datasetIds.length + 1) * (c.index+1))
                    .attr('y2', c=>(_this.visConfig.unitHeight) / (_this.datasetIds.length + 1) * (c.index+1))
                    .attr('stroke', c=>colorScale(c.datasetId)).attr('stroke-width', 2)

                _container.append('rect').attr('width', columnWidth)
                    .attr('x', numberOffsetX)
                    .attr('height', _this.visConfig.unitHeight)
                    .attr('fill' ,'none').attr('stroke', 'red')
            })

            // Metric Ssim
            numberOffsetX += columnWidth
            metricName = 'psnrs'
            rootContainer.append('text').text('Psnr').style('font-size', 10)
                .attr('transform', 'translate('+[numberOffsetX, 0]+') rotate(-45)')
            sliceContainers.each(function(d){
                let _container = d3.select(this)
                // Number of images
                let avgs = []
                _this.datasetIds.forEach(datasetid=>{
                    avgs.push({'datasetId': datasetid,
                        'avg': d3.mean(d[1], val=>val[datasetid][metricName]),
                        'min': d3.min(d[1], val=>val[datasetid][metricName]),
                        'max': d3.max(d[1], val=>val[datasetid][metricName])

                    })
                })
                let metricScale = d3.scaleLinear().domain([0, 50]).range([0, columnWidth])

                _container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                    .attr('cx', c=>numberOffsetX + metricScale(c.avg))
                    .attr('cy', _this.visConfig.unitHeight / 2)
                    .attr('r', 5).attr('fill', 'none').attr('stroke', c=>colorScale(c.datasetId))

                _container.append('rect').attr('width', columnWidth)
                    .attr('x', numberOffsetX)
                    .attr('height', _this.visConfig.unitHeight)
                    .attr('fill' ,'none').attr('stroke', 'blue')
            })
            // numberOffsetX += 50
            // rootContainer.append('text').text('Psnr').style('font-size', 10)
            //     .attr('transform', 'translate('+[numberOffsetX, 0]+') rotate(-45)')

        }
    },
    computed:{
        ...mapState("SR", {
            imageMetrics: (state) => state.imageMetrics,
            metricNames: (state) => state.metricNames,
            datasetIds: (state) => state.datasetIds
        }),
    }


}
</script>

<style scoped>

</style>
