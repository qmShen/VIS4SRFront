<template>
    <g>
        <circle :r="2" :fill="fill" :cx="xMin"></circle>
        <circle :r="2" :fill="fill" :cx="xMax"></circle>
        <line :x1="xMin" :x2="xMax" :y1="0" :y2="0" stroke="grey" stroke-width="1"></line>
        <circle :r="3" :fill="'none'" :stroke="fill" :cx="xAvg"></circle>
    </g>
</template>

<script>
import * as d3 from "d3";

export default {
    name: "SingleDistribution",
    props:['firstAttr', 'secondAttr', 'data', 'firstAttrColor', 'xScale'],
    mounted(){
    },
    computed:{
        minV() {
            return d3.min(this.data, val => val[this.firstAttr][this.secondAttr])
        },
        maxV() {
            return d3.max(this.data, val => val[this.firstAttr][this.secondAttr])
        },
        avgV(){
            return  d3.mean(this.data, val => val[this.firstAttr][this.secondAttr])
        },
        xMin(){
            return this.xScale(this.minV)
        },
        xMax(){
            return this.xScale(this.maxV)
        },
        xAvg(){
            return this.xScale(this.avgV)
        },
        fill(){
            return this.firstAttrColor(this.firstAttr)
        }
    }

}
</script>

<style scoped>

</style>