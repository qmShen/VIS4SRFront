<template>
    <div>
        <svg :width="width" :height="height" >
            <g class='container' :transform="'translate(' + [this.marginLeft, this.marginTop] + ')'">
                <rect :width="size" :height="size" fill="white" fill-opacity="1"></rect>
                <foreignObject :width="size" :height="size">
                    <canvas :width="size" :height="size"></canvas>
                </foreignObject>

                <g class="highlight">

                    <circle v-for="d in groupSelected" :key="d.imname"
                            :cx="xScale(d[xFeature])"
                            :cy="yScale(d[yFeature])"
                            fill="blue"
                            r="3"
                    ></circle>

                </g>
                <line :x1="xScale(0)"
                      :y1="yScale(0)"
                      :x2="xScale(maxXFeature)"
                      :y2="yScale(maxYFeature)"
                      stroke="grey"
                      stroke-width="1"
                ></line>
                <circle v-if=" global_x!= undefined" :cx="global_x" :cy="global_y" r="3" fill="none" stroke="blue"></circle>
                <circle v-if="mouseoverSelected"
                        :cx="xScale(mouseoverSelected[xFeature])"
                        :cy="yScale(mouseoverSelected[yFeature])"
                        r="5" fill="green" stroke="blue"></circle>
                <g class="xaxis"></g>
                <g class="yaxis"></g>
            </g>
            <g class='container' v-if="false"
               :transform="'translate(' + [this.marginLeft, this.marginTop] + ')'">
                <g v-for="d in modelPerformance" :key="d.imname"
                   :transform="getTransform(d)">
                    <CircleSim :d="d"></CircleSim>
                </g>


            </g>

        </svg>
    </div>
</template>

<script>


import * as d3 from 'd3'
import CircleSim from "@/components_new/Comparison/CircleSim";

export default {
    name: "Scatter",
    components:{CircleSim},
    data(){
        return {
            global_x: undefined,
            global_y: undefined,

            selectedRecord: undefined,

            // xScale: undefined,
            // yScale: undefined,

            // maxXFeature: 1,
            minXFeature: 0,

            // maxYFeature: 1,
            minYFeature: 0,

            labelMap: {
                'conf': '_with_label_conf',
                'lpips': '_lpips',
                'ssim': '_ssim',
                'psnr': '_psnr'
            }

        }
    },
    props:['modelPerformance',
        'xSelectedValue', 'ySelectedValue',
        'xLabel', 'yLabel',
        // 'xScale', 'yScale',
        'width', 'height', 'size',
        'marginLeft', 'marginTop',
        'groupSelected', 'mouseoverSelected'],
    methods:{
        getTransform(d){
            return 'translate(' + [this.xScale(d[this.xFeature]),
                this.yScale(d[this.yFeature])] + ')'
        },
        updateCanvas(){
            console.log('update canvas', this.modelPerformance)
            let _this = this;
            let canvas = d3.select(this.$el).select("canvas");
            let context = canvas.node().getContext("2d");

            context.clearRect(0, 0, this.size, this.size);
            context.globalAlpha = 0.3;
            console.log('xlabel' ,this.xSelectedValue,this.ySelectedValue)
            this.modelPerformance.forEach(d=>{
                let x = this.xScale(d[this.xFeature]);
                let y = this.yScale(d[this.yFeature]);
                context.beginPath();
                context.arc(x, y, 1, 0, 2 * Math.PI, true);
                if((d[this.ySelectedValue]  == d.label) && (d[this.xSelectedValue] == d.label)){
                    context.fillStyle = 'rgba(77,175,74,1)'
                }else if((d[this.xSelectedValue] == d.label) && (d[this.ySelectedValue] != d.label)){
                    context.fillStyle = 'rgba(152,78,163,1)'
                }else if((d[this.xSelectedValue] != d.label) && (d[this.ySelectedValue] == d.label)){
                    context.fillStyle = 'rgba(55,126,184,1)'
                }
                else{
                    context.fillStyle = 'rgba(228,26,28,1)'
                }

                context.closePath();
                context.fill();
            })

            const tree = d3.quadtree()
                .x(d=>{
                    return _this.xScale(d[this.xFeature])
                })
                .y(d=>{
                    return _this.yScale(d[this.yFeature])
                }).addAll(this.modelPerformance)
            let interactionSign = false
            if(interactionSign){
                canvas.on('mousemove', function(event){
                    let x = _this.global_x = event.layerX - _this.marginLeft;
                    let y = _this.global_y = event.layerY - _this.marginTop;
                    let find_result = tree.find(x, y, 1)
                    _this.$store.commit('test/updateMouseoverSelected', find_result)
                })

                canvas.on('mouseout', function(){
                    _this.global_x = _this.global_y = undefined
                })

            }


            d3.select(this.$el).select('.xaxis').call(d3.axisLeft(this.yScale))
            d3.select(this.$el).select('.yaxis').attr('transform', 'translate(' + [0, this.size] + ')').call(d3.axisBottom(this.xScale))
        }
    },
    mounted(){


        this.updateCanvas()

        // let container = d3.select(this.$el).select('.container')


    },
    computed:{

        xScale(){
            let x = d3.scaleLinear().domain([this.minXFeature, this.maxXFeature]).range([0, this.size]);
            return x
        },
        yScale(){
            let y = d3.scaleLinear().domain([this.minYFeature, this.maxYFeature]).range([this.size, 0])
            return y
        },
        xFeature(){
            if(this.xSelectedValue&&this.xLabel){
                return this.xSelectedValue + this.labelMap[this.xLabel]
            }else{
                return undefined
            }
        },
        yFeature(){
            if(this.ySelectedValue&&this.yLabel){
                return this.ySelectedValue + this.labelMap[this.yLabel]
            }else{
                return undefined
            }
        },
        maxXFeature(){
            return Math.max(1, d3.max(this.modelPerformance, d=>d[this.xFeature]))
        },
        maxYFeature(){
            return Math.max(1, d3.max(this.modelPerformance, d=>d[this.yFeature]))
        }
        // yFeature(){
        //     if(this.ySelectedValue&&this.yLabel){
        //         if(this.yLabel == 'conf'){
        //             return this.ySelectedValue + '_with_label_conf'
        //         }else if(this.yLabel == 'lpips'){
        //             return this.ySelectedValue + '_lpips'
        //         }else{
        //             return this.ySelectedValue + '_width_label_conf'
        //         }
        //     }else{
        //         return undefined
        //     }
        // }
    },
    watch:{
        xSelectedValue(){
            this.updateCanvas()
        },
        ySelectedValue(){
            this.updateCanvas()
        },
        xLabel(){
            this.updateCanvas()
        },
        yLabel(){
            this.updateCanvas()
        }
    }
}
</script>

<style scoped>

</style>