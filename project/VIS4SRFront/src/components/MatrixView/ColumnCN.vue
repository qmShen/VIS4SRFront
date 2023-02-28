<template>
    <g>
        <g v-if="sliceCF.columnType=='text'">
            <TextCN :width="sliceCF.width" :height="sliceCF.height"
                    :text="sliceCF.returnAnalysisContext(slice)"
            ></TextCN>
        </g>
        <g v-if="sliceCF.columnType=='distribution'">
            <g >
                <DistributionCN :width="sliceCF.width" :height="sliceCF.height"
                          :firstLayerAttrs="datasetIds" :metricName="sliceCF.keyAttr"
                          :datasetIdToColor="datasetIdToColor"
                          :slice="slice"
                ></DistributionCN>
            </g>
        </g>
        <g v-if="sliceCF.columnType=='values'">
            <g >
                <ValuesCN :width="sliceCF.width" :height="sliceCF.height"
                          :firstLayerAttrs="datasetIds"
                          :datasetIdToColor="datasetIdToColor"
                          :data="sliceCF.setFunc(datasetIds, slice)"
                ></ValuesCN>
            </g>
        </g>

    </g>
</template>

<script>

import TextCN from "@/components/MatrixView/TextCN";
import DistributionCN from "@/components/MatrixView/DistributionCN.vue";
import ValuesCN from "@/components/MatrixView/ValuesCN.vue";
export default {
    name: "ColumnCN",
    components: {
        ValuesCN,
        TextCN, DistributionCN
    },
    props:['sliceCF', 'slice', 'datasetIds', 'metricNames', 'datasetIdToColor'],
    mounted(){
    },
}
</script>

<style scoped>

</style>