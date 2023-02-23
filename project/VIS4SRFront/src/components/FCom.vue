<template>
    <div>
        <!--        <div class="mini_head">-->

        <!--        :transform="'translate(' + [this.marginLeft, this.marginTop] + ')'"-->

        <div>
            <svg :width="size" :height="size" >
                <g class='container' >
                    <rect :width="size" :height="size" fill="none" fill-opacity="1"></rect>
                    <foreignObject :width="size" :height="size">
                        <canvas :width="size" :height="size"></canvas>
                    </foreignObject>
                </g>


            </svg>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3'

export default {
    name: "FCom",
    props:[
        'modelPerformance', 'size',
        'xLabel' ,'yLabel'
    ],
    mounted(){


        let sumConfig = {
            'PP': 0,
            'PN': 0,
            'NP': 0,
            'NN': 0
        }

        let xLabel = this.xLabel;
        let ylabel = this.yLabel;

        this.modelPerformance.forEach(d=>{
            let xKey =  d['label'] == d[xLabel]? 'P' : 'N'
            let yKey =  d['label'] == d[ylabel]? 'P' : 'N'

            let key = xKey + yKey;
            sumConfig[key] += 1
        })

        let xN = sumConfig['NN'] + sumConfig['NP']
        let xP = sumConfig['PP'] + sumConfig['PN']
        let yN = sumConfig['NN'] + sumConfig['PN']
        let yP = sumConfig['NP'] + sumConfig['PP']

        let xCenter = xN/(xN + xP) * this.size
        let yCenter = yP/(yP + yN) * this.size

        console.log('val', sumConfig)


        let scaleConfig = {
            'PP':{
                'x': d3.scaleLinear().domain([0,1]).range([xCenter, this.size]),
                'y': d3.scaleLinear().domain([0,1]).range([yCenter, 0])
            },
            'PN':{
                'x': d3.scaleLinear().domain([0,1]).range([xCenter, this.size]),
                'y': d3.scaleLinear().domain([0,1]).range([yCenter, this.size])
            },
            'NP':{
                'x': d3.scaleLinear().domain([0, 1]).range([xCenter, 0]),
                'y': d3.scaleLinear().domain([0, 1]).range([yCenter, 0])
            },
            'NN':{
                'x': d3.scaleLinear().domain([0, 1]).range([xCenter, 0]),
                'y': d3.scaleLinear().domain([0, 1]).range([yCenter, this.size])
            }
        }

        // let scaleConfig = {
        //     'PP':{
        //         'x': d3.scaleLinear().domain([0,1.2]).range([this.size/2, this.size]),
        //         'y': d3.scaleLinear().domain([0,1.2]).range([this.size/2, 0])
        //     },
        //     'PN':{
        //         'x': d3.scaleLinear().domain([0,1.2]).range([this.size/2, this.size]),
        //         'y': d3.scaleLinear().domain([0,1.2]).range([this.size/2, this.size])
        //     },
        //     'NP':{
        //         'x': d3.scaleLinear().domain([0, 1.2]).range([this.size/2, 0]),
        //         'y': d3.scaleLinear().domain([0, 1.2]).range([this.size/2, 0])
        //     },
        //     'NN':{
        //         'x': d3.scaleLinear().domain([0, 1.2]).range([this.size/2, 0]),
        //         'y': d3.scaleLinear().domain([0, 1.2]).range([this.size/2, this.size])
        //     }
        // }


        let xFeature = xLabel + '_conf'
        let yFeature = ylabel + '_conf'

        let canvas = d3.select(this.$el).select("canvas");
        let context = canvas.node().getContext("2d");

        context.clearRect(0, 0, this.size, this.size);
        context.globalAlpha = 0.2;

        this.modelPerformance.forEach(d=>{
            let xKey =  d['label'] == d[xLabel]? 'P' : 'N'
            let yKey =  d['label'] == d[ylabel]? 'P' : 'N'

            let key = xKey + yKey;
            let xScale = scaleConfig[key].x;
            let yScale = scaleConfig[key].y;

            let x = xScale(d[xFeature]);
            let y = yScale(d[yFeature]);

            context.beginPath();
            context.arc(x, y, 2, 0, 2 * Math.PI, true);
            if(d[this.xSelectedValue] == d.label){
                context.fillStyle = 'rgba(0,255,0,0.5)'
            }else{
                context.fillStyle = 'rgba(255,0,0,0.5)'
            }

            context.closePath();
            context.fill();
        })
        console.log('this-performance', scaleConfig, this.modelPerformance)
    }
}
</script>

<style scoped>

</style>