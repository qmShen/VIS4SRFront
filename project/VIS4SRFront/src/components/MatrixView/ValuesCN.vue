<template>
    <g>
<!--        <circle r="5" fill="green" :cy="height / 2"></circle>-->
        <circle v-for="attr in firstLayerAttrs" :key="attr" :stroke="datasetIdToColor(attr)"
            :cx="xScale(data[attr])" :cy="height / 2" r="3" fill="none"
        ></circle>
        <rect :width="width" :height="height" fill="none" stroke-dasharray="2 2" stroke="grey"></rect>
    </g>
</template>

<script>
import * as d3 from "d3";
export default {
    name: "ValuesCN",
    props:['data', 'firstLayerAttrs', 'datasetIdToColor', 'width', 'height'],
    mounted(){

        console.log('data', this.firstLayerAttrs)
    },
    computed:{
        xScale(){
            return d3.scaleLinear().domain([0, 1]).range([0, this.width])
        }
    }

}
</script>

<style scoped>

</style>