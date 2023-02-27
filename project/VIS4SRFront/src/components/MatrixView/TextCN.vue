<template>
    <g>
        <text class="text" style="font-size: 10px">{{text}}</text>
        <rect :width="width" :height="height" :stroke="'grey'" stroke-width=0.5 :fill="'none'" stroke-dasharray="1 3"></rect>
    </g>

</template>

<script>
//A column configuration consists of a type: text, or sth.
import * as d3 from "d3";

export default {
    name: "ColumnCN",
    props: ['width', 'height', 'text'],
    mounted(){
        let text = d3.select(this.$el).select('.text')
        let bBox = text.node().getBBox()
        let columnWidth = this.height
        text.attr('y', bBox.height +  (this.height - bBox.height) / 2).attr('x', (columnWidth - bBox.width) / 2)

    }
}
</script>

<style scoped>

</style>