<template>
    <div>
        <img style="margin-bottom: 10px">
        <div >
            <span style="font-weight:bold;">Label name: </span>
            <span>{{data.label_name}}</span>
        </div>


        <el-row  style="height: 40%; text-align: left; margin-top: 10px">
            <div style="width: 100%; height: 100%;
                    overflow-x: scroll; overflow-y: hidden;" >
                <div style="height: 100%; white-space:nowrap; ">
                    <div v-for="(im, index) in results" :key="index" style="width: 150px; display:inline-block;margin-left: 5px">
                        <el-row style="text-align: center; width: 150px" >
                            <div class="mini_title_center" style="width: 150px">{{im.model}}</div>
                        </el-row>

                        <el-row>
                            <el-image
                                    :src="'data:image/jpeg;base64,'+im.im"
                                    style="width: 150px; height: 150px"
                            ></el-image>
                        </el-row>
                        <el-row style="width: 150px; text-align: left">
                            <el-descriptions
                                    :labelStyle="{'width':'30px', 'background-color': '#ffffff'}"
                                    :contentStyle="{'background-color': '#ffffff'}"
                                    :colon="false"
                                    style="width: 150px" title="" :column="1" :size="'mini'" >
                                <el-descriptions-item
                                        label="Label" >
                                    {{data[idToLabel[im.model]]}}
                                </el-descriptions-item>
                                <el-descriptions-item
                                        label="Score">
                                    {{parseInt(data[idToLabel[im.model] + "_conf" ] * 1000) / 1000}}
                                </el-descriptions-item>
                                <el-descriptions-item label="Name" >
                                    <span style="white-space: pre-wrap;">
                                        {{label2Name[data[idToLabel[im.model]]]}}
                                    </span>
                                </el-descriptions-item>
                            </el-descriptions>
                        </el-row>
                    </div>

                </div>
            </div>
        </el-row>


    </div>
</template>

<script>
import {loadImage} from '@/service/module/dataService'

export default {
    name: "ImInfo",
    props:['data' ,'label2Name'],
    data(){
        return {
            imgb64: undefined,
            results: undefined,
            idToLabel: {
                bicubic: 'DS-bicubic_224',
                vdsr: 'VDSR-1_224',
                srresnet: 'SRResNet-4_224',
                hcflow: 'HCFlow-4_224',
                raw: 'raw_224'
            }
        }
    },
    mounted(){
        console.log('info view mounted ', this.data)
        console.log('size', this.$el.clientWidth, this.$el.clientHeight)
        console.log('imagenma', this.data.imname)
        loadImage({'imname': this.data.imname}, (d)=>{
            this.results = d
            console.log('ddd', d)
            this.results.forEach(r=>{
                r.im = r.imbase64.substring(2, r.imbase64.length - 1)
            })
        })
    }
}
</script>

<style >
.my-label{
    width: 20px;
    background-color: #d50e0e;
}
</style>