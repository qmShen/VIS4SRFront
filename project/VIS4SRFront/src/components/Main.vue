<template>
    <div class="hello" style="height: 100%;">

        <el-row :gutter="20">
            <el-col :span="4">
                <div class="grid-content bg-purple">First Layer Attributes:</div>
                <el-select size="mini" v-model="selectedFirstAttributes"
                           multiple placeholder="Select">
                    <el-option
                            v-for="item in datasetIds"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <div class="grid-content bg-purple">Second Layer Attribute:</div>

                <el-select size="mini" v-model="selectedMetrics"
                           multiple placeholder="Select">
                    <el-option
                            v-for="item in metricNames"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <div class="grid-content bg-purple">Second Layer Attribute:</div>
                <el-select size="mini" v-model="selectedClassifications"
                           multiple placeholder="Select">
                    <el-option
                            v-for="item in metricNames"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </el-col>

            <el-col :span="4">
                <div class="grid-content bg-purple">Fetch classification results</div>
                <el-select size="mini" v-model="selectedClassifications"
                           multiple placeholder="Select">
                    <el-option
                            v-for="item in classificationIds"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
                <el-button size="mini" @click="joinSubmission"> submit</el-button>
            </el-col>
        </el-row>
        <svg width="3000" height="1000" style="">
            <g transform="translate(50, 100)" class="metricGroup">
                <g>
                    <SliceTitle v-for="(sliceCF, index) in sliceCFs" :key="index" :sliceCF="sliceCF"
                                :transform="'translate('+ [sliceCF.x, 0] +')'"
                    ></SliceTitle>
                </g>
                <g v-if="visConfig.datasetIdToColor!=null" >
                    <SliceCN v-for="(slice, index) in selectGroups" :key="index" :slice="slice"
                             :sliceCFs="sliceCFs"
                             :height="visConfig.unitHeight"
                             :transform="'translate('+[0, visConfig.unitHeight * index]+')'"
                             :datasetIds="datasetIds"
                             :datasetIdToColor="visConfig.datasetIdToColor"
                    ></SliceCN>
                </g>
            </g>

            <g transform="translate(500, 100)" class="metricGroup">
                <g>
                    <SliceTitle v-for="(sliceCF, index) in g2SliceCFs" :key="index" :sliceCF="sliceCF"
                                :transform="'translate('+ [sliceCF.x, 0] +')'"
                    ></SliceTitle>
                </g>
                <g v-if="visConfig.datasetIdToColor!=null" >
                    <SliceCN v-for="(slice, index) in selectClassificationGroups" :key="index" :slice="slice"
                             :sliceCFs="g2SliceCFs"
                             :height="visConfig.unitHeight"
                             :transform="'translate('+[0, visConfig.unitHeight * index]+')'"
                             :datasetIds="datasetIds"
                             :datasetIdToColor="visConfig.datasetIdToColor"
                    ></SliceCN>
                </g>
            </g>
        </svg>
    </div>
</template>

<script>

import {mapState} from "vuex";
import * as d3 from "d3"
import SliceCN from "@/components/MatrixView/SliceCN.vue";
import SliceTitle from "@/components/MatrixView/SliceTitle";
import {ColumnConfig, ColumnFactory} from "@/libDev/ColumnGenerator.js"


export default {
    name: 'MainComponent',
    props: [],
    components: {SliceTitle,SliceCN},
    data(){
        return {
            selectGroups: [],
            sliceCFs: [],
            visConfig:{
                totalHeight: 800,
                totalLength: 1200,
                unitHeight: 50,
                datasetIdToColor: null
            },
            allFirstAttributes:[],
            selectedFirstAttributes: [],
            selectedMetrics:[],

            selectedClassifications:['vgg19'],

            g2SliceCFs: [],
            selectClassificationGroups: []
        }
    },
    methods:{
        joinSubmission(){
            // firstAttributes: datasetId/SR
            //
            console.log('join submission',
                this.selectedClassifications, this.selectedFirstAttributes)

            this.$store.dispatch("SR/jointlyAnalysis",
                {
                    'classificationIds': this.selectedClassifications,
                    'firstAttributes': this.selectedFirstAttributes
                });
        }
    },
    mounted(){},
    watch:{
        imageMetrics(val){
            let results = d3.groups(val, d=>d.label)
            this.selectGroups = results.splice(0, 20)


            let col = new ColumnConfig('text', 100, 100)
            col.setProcessFunc(function(slice){
                return slice[0]
            })
            let uh = this.visConfig.unitHeight
            let configs = [
                ColumnFactory.returnTextColumn('text', 'label', 0, uh, uh, d=>d[0]),
                ColumnFactory.returnTextColumn('text', 'number', uh, uh, uh, d=>d[1].length),
                ColumnFactory.returnDisColumn('distribution','lpips', uh*2,100, uh, 'lpips'),
                ColumnFactory.returnDisColumn('distribution', 'psnr',uh*2 + 100,100, uh, 'psnrs'),
                ColumnFactory.returnDisColumn('distribution', 'ssims',uh*2 + 200,100, uh, 'ssims'),
            ]
            this.sliceCFs=configs
            //     TODO: here to config
        },
        imageClassification(val){
            console.log('classification results', val)

            let results = d3.groups(val, d=>d.label)
            this.selectClassificationGroups = results.splice(0, 20)
            let calcAcc = function(datasetIds, dataGroup){
                let rc = {}
                let dataList = dataGroup[1]
                console.log('dataList ', dataList)
                datasetIds.forEach(datasetId=>{
                    let count = d3.sum(dataList, d=>d[datasetId].top1_id == d.label? 1 : 0)
                    let total = dataList.length
                    rc[datasetId] = count / total
                })
                return rc
            }

            let uh = this.visConfig.unitHeight
            let labelCol = ColumnFactory.returnTextColumn('text', 'label', 0, uh, uh, d=>d[0])
            let col = ColumnFactory.returnValuesColumn('values', 'Accuracy', uh, 100, 50, calcAcc)
            let confCol = ColumnFactory.returnDisColumn('distribution', 'Confidence', 150,100, uh, 'top1_prob')

            this.g2SliceCFs = [labelCol, col, confCol]
        },
        datasetIds(){
            this.selectedFirstAttributes = [...this.datasetIds]
            this.visConfig.datasetIdToColor = d3.scaleOrdinal().domain(this.datasetIds).range(d3.schemeCategory10)
        },
        metricNames(){
            this.selectedMetrics = [...this.metricNames]
        }

    },
    computed:{
        ...mapState("SR", {
            imageMetrics: (state) => state.imageMetrics,
            metricNames: (state) => state.metricNames,
            datasetIds: (state) => state.datasetIds,
            classificationIds: (state) => state.classificationIds,
            imageClassification: (state) => state.imageClassification
        }),
    }


}
</script>

<style scoped>

</style>
