<template>
    <div class="hello" style="height: 100%;">
        <svg width="3000" height="1000" style="">
            <g transform="translate(50, 100)">
                <g>
                    <SliceTitle v-for="(sliceCF, index) in sliceCNs" :key="index" :sliceCF="sliceCF"
                                :transform="'translate('+ [sliceCF.x, 0] +')'"
                    ></SliceTitle>
                </g>
                <g v-if="visConfig.datasetIdToColor!=null" >
                    <SliceCN v-for="(slice, index) in selectGroups" :key="index" :slice="slice"
                             :sliceCFs="sliceCNs"
                             :height="visConfig.unitHeight"
                             :transform="'translate('+[0, visConfig.unitHeight * index]+')'"
                             :datasetIds="datasetIds"
                             :metricNames="metricNames"
                             :datasetIdToColor="visConfig.datasetIdToColor"
                    ></SliceCN>
                </g>
                <!--                <SliceCN v-for="(slice, index) in selectGroups" :key="index" :slice="slice"-->
                <!--                         :transform="'translate('+[0, visConfig.unitHeight * index]+')'"-->
                <!--                         :sliceConfig="visConfig"-->
                <!--                         :datasetIds="datasetIds"-->
                <!--                         :metricNames="metricNames"-->
                <!--                ></SliceCN>-->
            </g>
        </svg>
    </div>
</template>

<script>

import {mapState} from "vuex";
import * as d3 from "d3"
import SliceCN from "@/components/MatrixView/SliceCN.vue";
import SliceTitle from "@/components/MatrixView/SliceTitle";

export default {
    name: 'MainComponent',
    props: [

    ],
    components: {
        SliceTitle,
        SliceCN

    },
    data(){
        return {
            selectGroups: [],

            sliceCNs: [],
            visConfig:{
                totalHeight: 800,
                totalLength: 1200,
                unitHeight: 50,
                datasetIdToColor: null
            }
        }
    },
    methods:{
    },
    mounted(){
        console.log('metrics')
    },
    watch:{
        imageMetrics(val){
            let results = d3.groups(val, d=>d.label)
            this.selectGroups = results.splice(0, 10)

            class ColumnConfig{
                constructor(columnType, title, x, width, height){
                    this.columnType = columnType;
                    this.title = title;
                    this.width = width;
                    this.height = height;
                    this.x = x
                }
                setProcessFunc(func){
                    this.setFunc = func
                }

                setKeyAttributes(attr){
                    this.keyAttr = attr
                }

                returnAnalysisContext(slice){
                    //Text of distribution
                    if(this.columnType == 'text'){
                        return this.setFunc(slice)
                    }else if (this.columnType == 'distribution'){
                        return ['datasetIds', 'metricNames']
                    }
                }
            }

            class ColumnFactory{
                static returnTextColumn(columnType, title, x, width, height, textFunc){
                    let conf = new ColumnConfig('text', title, x, width, height)
                    conf.setProcessFunc(textFunc)
                    return conf
                }

                static returnDisColumn(columnTyle, title, x, width, height, keyAttr){
                    let conf = new ColumnConfig('distribution', title, x, width, height)
                    conf.setKeyAttributes(keyAttr)
                    return conf
                }

                static returnText

            }

            let col = new ColumnConfig('text', 100, 100)
            col.setProcessFunc(function(slice){
                return slice[0]
            })
            let col2 = new ColumnConfig('distribution', 100, 100)
            let columnNames = col2.returnAnalysisContext()
            console.log('this[columnNames[0]]', this[columnNames[0]], this[columnNames[1]])
            console.log('config ', this.visConfig)
            let uh = this.visConfig.unitHeight
            let configs = [
                ColumnFactory.returnTextColumn('text', 'label', 0, uh, uh, d=>d[0]),
                ColumnFactory.returnTextColumn('text', 'number', uh, uh, uh, d=>d[1].length),
                ColumnFactory.returnDisColumn('distribution','lpips', uh*2,100, uh, 'lpips'),
                ColumnFactory.returnDisColumn('distribution', 'psnr',uh*2 + 100,100, uh, 'psnrs'),
                ColumnFactory.returnDisColumn('distribution', 'ssims',uh*2 + 200,100, uh, 'ssims'),
            ]
            this.sliceCNs=configs
            console.log('config', configs)
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
