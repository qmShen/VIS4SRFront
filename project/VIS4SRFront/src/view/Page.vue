<template>
    <div class="main-page" style="height: 100%"
         v-loading="!initSign"
         :element-loading-text="loadingText"
         element-loading-background="rgba(0, 0, 0, 0.8)"
    >
        <Main v-if="dataLoading"
        ></Main>
    </div>
</template>

<script>
import Main from "@/components/Main";
import {mapState} from "vuex";


export default {
    name: 'TestPage',
    components: {
        Main,
    },
    data(){
        return {
            nodes: [],
            links: [],
            startTime: new Date()

        }
    },
    mounted(){
        this.$store.dispatch("SR/loadSRModels", { x: 1 });
        this.$store.dispatch("SR/loadSRMetrics");
        this.$store.dispatch("SR/loadMetricNames")
        this.$store.dispatch("SR/loadDatasetIds")
        // this.$store.dispatch("test/fetchAllData");
    },
    computed: {
        ...mapState("SR", {
            dataLoading: (state) => state.dataLoading
        }),

        initSign(){
            if(this.dataLoading){
                return true
            }else{
                return false
            }

        },
        loadingText(){
            return "Loading:    "

        }
    }
}
</script>

<style >
.boundary {
    /*border-style: dashed;*/
    border-style: solid;
    border-color: #d3dce6;
    border-width: 0.5px;
    border-radius: 3px;
}


</style>
