<template>
    <g><text style="font-size: 12px" :transform="transform">{{sliceCF.title}}</text></g>
</template>

<script>
export default {
    name: "SliceTitle",
    props:['sliceCF'],
    mounted(){},
    computed:{
        offsetX(){
            return this.sliceCF.width / 2
        },
        transform(){
            return 'translate(' + [this.offsetX, -5] + ')' + 'rotate(-45)'
        }
    }
}
</script>

<style scoped>

</style>