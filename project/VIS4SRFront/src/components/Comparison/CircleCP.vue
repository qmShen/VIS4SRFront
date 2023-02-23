<template>
    <g :transform="transform">
        <circle r="1" fill="red"></circle>
    </g>

</template>

<script>
export default {
    name: "circle",
    props:['data', 'xScale', 'yScale', 'xSelectedValue', 'ySelectedValue'],
    computed:{
        transform(){
            let xFeature = this.xSelectedValue + '_with_label_conf'
            let yFeature = this.ySelectedValue + '_with_label_conf'
            console.log('data ------- ', this.data)
            console.log('feature -------', xFeature, yFeature)
            console.log('scale  ', this.xScale.domain(), this.xScale.range())
            return 'translate(' + [this.xScale(this.data[xFeature]),
                this.yScale(this.data[yFeature])] + ')'
        }
    }
}
</script>

<style scoped>

</style>