<template>
    <g>
        <circle fill="red" r="3"></circle>
        <rect :height="sliceConfig.unitHeight" :width="sliceConfig.totalLength"
              :fill="'grey'" opacity="0.3"
        ></rect>

        <TextCN
            :type="'text'"
            :width="sliceConfig.unitHeight" :height="sliceConfig.unitHeight" :transform="'translate(' + [0,0] + ')'"
            :text="slice[0]"
        ></TextCN>

        <TextCN :type="'text'"
                :width="sliceConfig.unitHeight" :height="sliceConfig.unitHeight" :transform="'translate(' + [ sliceConfig.unitHeight,0] + ')'"
                :text="slice[1].length"
        ></TextCN>


        <MetricCN v-for="(metricName, index) in metricNames" :key="metricName"
                  :width="100" :height="sliceConfig.unitHeight" :transform="'translate(' + [ sliceConfig.unitHeight * 2 + index * 100,0] + ')'"
                  :slice="slice" :datasetIds="datasetIds" :datasetId2Color="sliceConfig.datasetIdToColor"
                  :metricName="metricName"
        ></MetricCN>


    </g>
</template>

<script>

import TextCN from "@/components/MatrixView/TextCN.vue";
import MetricCN from "@/components/MatrixView/MetricCN.vue";

export default {
    name: "SliceCN",
    components: {
        MetricCN,
        TextCN
    },
    data(){
        return{

        }
    },
    props:['sliceConfig', 'slice', 'datasetIds', 'metricNames'],
    mounted(){

    },
    computed:{

    }
}
</script>

<style scoped>

</style>