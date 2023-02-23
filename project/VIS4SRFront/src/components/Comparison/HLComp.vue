<template>
    <div>
        <!--        <div class="mini_head">-->
        <div class="mini_title">{{comp.uid}}</div>
        <!--        </div>-->
        <el-row style="width: 100%; height: 30px; margin-top: 5px" :gutter="5">
            <el-col :span="6">
                <el-select v-model="xSelectedValue" placeholder="X" size="mini"
                >
                    <el-option
                            v-for="item in srOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-select v-model="xLabel" placeholder="X Label" size="mini">
                    <el-option
                            v-for="item in srLabels"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-select v-model="ySelectedValue" placeholder="Y" size="mini">
                    <el-option
                            v-for="item in srOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-select v-model="yLabel" placeholder="Y Label" size="mini">
                    <el-option
                            v-for="item in srLabels"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
        </el-row>
        <Scatter :xSelectedValue="xSelectedValue"
                 :ySelectedValue="ySelectedValue"
                 :xLabel="xLabel"
                 :yLabel="yLabel"
                 :modelPerformance="modelPerformance"
                 :xScale="xScale"
                 :yScale="yScale"
                 :marginTop="marginTop"
                 :marginLeft="marginLeft"
                 :width="width"
                 :size="size"
                 :height="height"
                 :groupSelected="groupSelected"
                 :mouseoverSelected="mouseoverSelected"
                 v-if="inited"
        >
        </Scatter>
    </div>
</template>

<script>
import Scatter from "@/components/Comparison/Scatter";

import * as d3 from "d3"

export default {
    name: "HLComp",
    components: {Scatter},
    props: ['comp', 'modelPerformance', 'groupSelected', 'mouseoverSelected'],
    data(){
        return {
            xScale: undefined,
            yScale: undefined,

            width:undefined,
            height:undefined,
            size: undefined,

            xSelectedValue: undefined,
            xLabel: undefined,

            ySelectedValue: undefined,
            yLabel: undefined,

            marginTop: 10,
            marginLeft: 30,

            srOptions: [
                {
                    value: 'DS-bicubic_224',
                    label: 'Bicubic'
                }, {
                    value: 'VDSR-1_224',
                    label: 'VDSR'
                }, {
                    value: 'SRResNet-4_224',
                    label: 'SRResNet'
                }, {
                    value: 'HCFlow-4_224',
                    label: 'HCFlow'
                }, {
                    value: 'raw_224',
                    label: 'Raw'
                }],
            srLabels:[
                {
                    value: 'conf',
                    label: 'conf'
                },
                {
                    value: 'lpips',
                    label: 'lpips'
                },
                {
                    value: 'ssim',
                    label: 'ssim'
                },
                {
                    value: 'psnr',
                    label: 'psnr'
                }
            ]
        }
    },
    mounted(){
        console.log('comp', this.modelPerformance[0])


        // TODO： hardcode
        this.height = this.$el.clientHeight - 50;
        this.width = this.height;

        d3.select(this.$el).style('width', this.width + 'px')

        this.size = Math.min(this.width, this.height) - 2 * Math.max(this.marginTop, this.marginLeft)

        this.xScale = d3.scaleLinear().domain([0, 1]).range([0, this.size])
        this.yScale = d3.scaleLinear().domain([0, 1]).range([this.size, 0])
    },
    methods:{
        confirm(){
            if((!this.yLabel) && (!this.yLabel)){
                return
            }
        }
    },
    computed:{
        inited(){
            if(this.xSelectedValue &&
                this.ySelectedValue &&
                this.xScale &&
                this.yScale &&
                this.width!=undefined &&
                this.height!=undefined &&
                this.xLabel &&
                this.yLabel
            ) {
                return true}
            else{
                return false
            }

        }
    },
    watch:{
        groupSelected(d){
            console.log('dddd ', d)
        }
    }
}
</script>

<style scoped>

</style>