<template>
    <div class="hello" style="height: 100%;">
        <svg width="3000" height="1000" style="">
            <g transform="translate(50, 100)">
                <SliceCN v-for="(slice, index) in selectGroups" :key="index" :slice="slice"
                         :transform="'translate('+[0, visConfig.unitHeight * index]+')'"
                         :sliceConfig="visConfig"
                         :datasetIds="datasetIds"
                         :metricNames="metricNames"
                ></SliceCN>
            </g>
        </svg>
    </div>
</template>

<script>

import {mapState} from "vuex";
import * as d3 from "d3"
import SliceCN from "@/components/MatrixView/SliceCN.vue";

export default {
    name: 'MainComponent',
    props: [

    ],
    components: {
        SliceCN

    },
    data(){
        return {
            selectGroups: [],
            visConfig:{
                totalHeight: 800,
                totalLength: 1200,
                unitHeight: 30,
                datasetIdToColor: null
            }
        }
    },
    methods:{
        // , 'metricName', 'colorScale'
        drawMetrics(container, d, metricName,  columnWidth, colorScale){
            let avgs = []
            this.datasetIds.forEach((datasetid, index)=>{
                avgs.push({'datasetId': datasetid,
                    'avg': d3.mean(d[1], val=>val[datasetid][metricName]),
                    'min': d3.min(d[1], val=>val[datasetid][metricName]),
                    'max': d3.max(d[1], val=>val[datasetid][metricName]),
                    'index': index
                })
            })
            console.log('column', columnWidth)

            let metricScale = null
            if(metricName != 'psnrs'){
                metricScale = d3.scaleLinear().domain([0, 1]).range([0, columnWidth])
            }else{
                metricScale = d3.scaleLinear().domain([0, 60]).range([0, columnWidth])
            }
            container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                .attr('cx', c=>metricScale(c.avg))
                .attr('cy', c=>(this.visConfig.unitHeight) / (this.datasetIds.length + 1) * (c.index+1))
                .attr('r', 3).attr('fill', 'none').attr('stroke', c=>colorScale(c.datasetId))

            container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                .attr('cx', c=>metricScale(c.min))
                .attr('cy', c=>(this.visConfig.unitHeight) / (this.datasetIds.length + 1) * (c.index+1))
                .attr('r', 2).attr('fill', c=>colorScale(c.datasetId)).attr('stroke', c=>colorScale(c.datasetId))

            container.append('g').selectAll('circle').data(avgs).enter().append('circle')
                .attr('cx', c=>metricScale(c.max))
                .attr('cy', c=>(this.visConfig.unitHeight) / (this.datasetIds.length + 1) * (c.index+1))
                .attr('r', 2).attr('fill', c=>colorScale(c.datasetId)).attr('stroke', c=>colorScale(c.datasetId))

            container.append('g').selectAll('line').data(avgs).enter().append('line')
                .attr('x1', c=>metricScale(c.min)).attr('x2', c=>metricScale(c.max))
                .attr('y1', c=>(this.visConfig.unitHeight) / (this.datasetIds.length + 1) * (c.index+1))
                .attr('y2', c=>(this.visConfig.unitHeight) / (this.datasetIds.length + 1) * (c.index+1))
                .attr('stroke', c=>colorScale(c.datasetId)).attr('stroke-width', 2)

            container.append('rect').attr('width', columnWidth)
                .attr('x', 0)
                .attr('height', this.visConfig.unitHeight)
                .attr('fill' ,'none').attr('stroke', 'red')
            console.log('container, d', container, d)
        }
    },
    mounted(){
        console.log('metrics')
    },
    watch:{
        imageMetrics(val){
            let results = d3.groups(val, d=>d.label)
            this.selectGroups = results.splice(0, 10)
        //     TODO: here to config
        },
        datasetIds(){
            this.visConfig.datasetIdToColor = d3.scaleOrdinal().domain(this.datasetIds).range(d3.schemeCategory10)
        },

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
