<template>
    <g>
        <rect :width="width" :height="height" fill="none" stroke-dasharray="2 2" stroke="grey"></rect>
        <SingleDistribution v-for="(attr, index) in firstLayerAttrs" :key="index"
                            :attr="attr" :transform="'translate(' + [0, height /(firstLayerAttrs.length + 1) * (index+1)] + ')'"
                            :firstAttr="attr" :secondAttr="metricName" :data="slice[1]"
                            :firstAttrColor="datasetIdToColor"
                            :xScale="xScale"
        ></SingleDistribution>
    </g>
</template>

<script>
import * as d3 from "d3";
import SingleDistribution from "@/components/MatrixView/SingleDistribution";

export default {
    name: "MetricCN",
    components: {SingleDistribution},
    props:['width', 'height', 'slice', 'firstLayerAttrs', 'metricName', 'datasetIdToColor'],
    methods:{

    },
    mounted(){

    },
    computed: {
        xScale(){
            if(this.metricName != 'psnrs'){
                return d3.scaleLinear().domain([0, 1]).range([0, this.width])
            }else{
                return d3.scaleLinear().domain([0, 80]).range([0, this.width])
            }
        }
    }
}
</script>

<style scoped>

</style>