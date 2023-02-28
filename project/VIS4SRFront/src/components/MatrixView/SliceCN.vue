<template>
    <g>
<!--        <rect :height="height" :width="800"-->
<!--              :fill="'grey'" opacity="0.3"-->
<!--        ></rect>-->
        <ColumnCN v-for="(sliceCF, index) in sliceCFs" :key="index" :sliceCF="sliceCF" :slice='slice'
                  :datasetIdToColor="datasetIdToColor"
                  :datasetIds="datasetIds"
                  :transform="'translate('+ [sliceCF.x, 0] +')'"
        ></ColumnCN>
    </g>
</template>

<script>

import ColumnCN from "@/components/MatrixView/ColumnCN";
export default {
    name: "SliceCN",
    components: {
        ColumnCN

    },
    data(){
        return{

        }
    },
    props:['slice', 'sliceCFs','height', 'datasetIds',  'datasetIdToColor'],
    mounted(){
    },
    computed:{

    }
}
</script>

<style scoped>

</style>