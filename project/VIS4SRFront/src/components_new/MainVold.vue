<template>
    <div class="hello" style="height: 100%;">
        <el-row :gutter="5" style="height: 100%;">
            <el-col :span="9" style="height: 100%; text-align: left; " class="boundary">
                <div style="width: 100%; height: 100%; margin-top: 10px">
                    <el-form size="mini" :inline="true" style="margin-left: 10px; position:relative"
                             label-width="100">

                        <el-form-item label="Label">
                            <el-select
                                    v-model="selectLabels"
                                    size="mini"
                                    multiple
                                    collapse-tags

                                    placeholder="Select image label">
                                <el-option
                                        v-for="item in labels"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Label" style="position: absolute; right: 10px">
                            <el-button size="mini"  @click="addModelComparison">Create Comparison</el-button>
                        </el-form-item>

                    </el-form>
                    <div style="width: 100%; height: 100%; " class="boundary">
                        <el-table size="mini"
                                  lazy
                                  :load="loadDetailInfo"
                                  :data="currentSelected"
                                  max-height="800"
                                  empty-text="No Selection"
                                  @cell-mouse-enter = enter
                                  style="width: calc(100% - 20px);">

                            <el-table-column type="expand"
                                             label=""
                                             prop=""
                                             width="">

                                <template slot-scope="props">
                                    <div style="margin-left: 10px">
                                        <ImInfo
                                                :data="props.row"
                                                :label2Name="label2Name"
                                        ></ImInfo>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column v-for="(col, index) in columns" :key="index"
                                             :label="col.label"
                                             :prop="col.prop"
                                             :width="index == 0? '': ''"
                            ></el-table-column>
                        </el-table>

                    </div>
                </div>

            </el-col>
            <el-col :span="15" style="height: 100%">
                <div class="mini_head">
                    <div class="mini_title">Comp</div>
                </div>
                <el-row  style="height: 40%; text-align: left">
                    <div style="width: 100%; height: 100%; overflow-x: scroll; overflow-y: hidden;" >
                        <div style="height: 100%; white-space:nowrap; ">
                            <HLComp class="boundary" v-for="comp in comparisons" :modelPerformance="modelPerformance"
                                    :groupSelected="groupSelected"
                                    :mouseoverSelected="mouseoverSelected"
                                    style="height: 100%; background-color: #ffffff; display:inline-block; margin-right: 5px"
                                    :key="comp.uid" :comp="comp"></HLComp>
                        </div>
                    </div>
                </el-row>
                <el-row  style="height: calc(60% - 30px) ; margin-top:10px">
                    <div style="width: 100%; height: 500px; background-color: #d3dce6;  overflow-x: scroll; overflow-y: hidden;" v-if="false">
                        <div style="height: 100%; white-space:nowrap; ">
                            <FCom
                                    style="display:inline-block;"
                                    :xLabel="'DS-bicubic_224'"
                                    :yLabel="'VDSR-1_224'"
                                    :modelPerformance="modelPerformance" :size="500"></FCom>
                            <FCom
                                    style="display:inline-block;"
                                    :xLabel="'DS-bicubic_224'"
                                    :yLabel="'SRResNet-4_224'"
                                    :modelPerformance="modelPerformance" :size="500"></FCom>
                            <FCom
                                    style="display:inline-block;"
                                    :xLabel="'DS-bicubic_224'"
                                    :yLabel="'HCFlow-4_224'"
                                    :modelPerformance="modelPerformance" :size="500"></FCom>
                        </div>

                    </div>
                </el-row>

            </el-col>
        </el-row>
    </div>
</template>

<script>

import HLComp from "@/components_new/Comparison/HLComp";
import {uuidv4} from "@/lib/lib";
import * as d3 from 'd3'
import ImInfo from "@/components_new/ImInfo";
import FCom from "@/components_new/FCom";

export default {
    name: 'MainComponent',
    props: [
        'modelPerformance',
        'groupSelected',
        'mouseoverSelected',
        'label2Name'
    ],
    components: {
        FCom,
        ImInfo,
        HLComp},
    data(){
        return {
            columns:[
                {'label': 'ID', 'prop': 'id'},
                {'label': 'bicubic', 'prop': 'DS-bicubic_224'},
                {'label': 'VDSR', 'prop': 'VDSR-1_224'},
                {'label': 'SRResNet', 'prop': 'SRResNet-4_224'},
                {'label': 'HCFlow', 'prop': 'HCFlow-4_224'},
                {'label': 'raw', 'prop': 'raw_224'},
                {'label': 'label', 'prop': 'label'},

                // {'label': 'Inde', 'prop': 'label_name'}
            ],
            comparisons: [],
            selectLabels: [],
            labels: [],
            selectedRecords:[]
        }
    },
    methods:{
        addModelComparison(){
            let uid = uuidv4()
            this.comparisons.push({uid:uid})
        },
        enter(data){
            this.$store.commit('test/updateMouseoverSelected', data)
        },
        loadDetailInfo(tree, treeNode, resolve){
            setTimeout(() => {
                console.log('tree', tree, treeNode, resolve)
            }, 1000)
        }
    },
    mounted(){
        console.log('performance ', this.modelPerformance)
        let allLabels = d3.map(this.modelPerformance, d=>d.label)
        let labels = Array.from(new Set(allLabels)).sort((a,b)=>{return a-b})
        labels.forEach(label=>{
            this.labels.push({'value': label, 'label': label})
        })
    },
    watch:{
        selectLabel(d){
            console.log('updated ', d)
        },
        highlightRecords(list){
            this.$store.commit('test/updateGroupSelected', list)
        }
    },
    computed:{
        labelMap(){
            let map = {};
            this.selectLabels.forEach(label=>{
                map[label] = true
            })
            return map
        },
        highlightRecords(){
            let records = []
            this.modelPerformance.forEach(d=>{
                if(this.labelMap[d.label] == true){
                    records.push(d)
                }
            })
            return records
        },
        currentSelected(){
            if(this.mouseoverSelected != undefined){
                return this.groupSelected
                // return [this.mouseoverSelected].concat(this.groupSelected)
            }else{
                return this.groupSelected
            }
        }
    }


}
</script>

<style scoped>

</style>
