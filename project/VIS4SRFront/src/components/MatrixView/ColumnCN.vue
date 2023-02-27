<template>
    <g>
        <g v-if="sliceCF.columnType=='text'">
            <TextCN :width="sliceCF.width" :height="sliceCF.height"
                    :text="sliceCF.returnAnalysisContext(slice)"
            ></TextCN>
        </g>
        <g v-if="sliceCF.columnType=='distribution'">
            <g >
                <MetricCN :width="sliceCF.width" :height="sliceCF.height"
                          :firstLayerAttrs="datasetIds" :metricName="sliceCF.keyAttr"
                          :datasetIdToColor="datasetIdToColor"
                          :slice="slice"
                ></MetricCN>
            </g>
        </g>

    </g>
</template>

<script>

import TextCN from "@/components/MatrixView/TextCN";
import MetricCN from "@/components/MatrixView/MetricCN";
export default {
    name: "ColumnCN",
    components: {
        TextCN, MetricCN
    },
    props:['sliceCF', 'slice', 'datasetIds', 'metricNames', 'datasetIdToColor'],
    mounted(){
    },
}
</script>

<style scoped>

</style>