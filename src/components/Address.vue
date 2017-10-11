<template>
    <div id="container" tabindex="0">
        <div id="mapContainer"></div>
        <!-- <div class='center'>
                                                                                            <div id='bt' class="btmtip" @click='goGD'>点击去高德地图</div>
                                                                                        </div> -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            lnglatXY: []
        }
    },
    mounted() {
        this.getLocation()
    },
    methods: {
        getLocation() {
            var self = this
            self.lnglatXY = [this.$route.query.longitude, this.$route.query.latitude]
            var map = new AMap.Map('mapContainer', {
                resizeEnable: true,
                center: self.lnglatXY,
                zoom: 12,
            });
            var marker = new AMap.Marker({
                map: map,
                position: self.lnglatXY
            });
            marker.on('click', function (e) {
                marker.markOnAMAP({
                    position: marker.getPosition()
                })
            })
            marker.setMap(map);

        }
    }
}

</script>
<style>
#container {
    width: 100%;
    height: 100%;
}

#mapContainer {
    margin: 0;
    height: 100%;
    width: 100%;
    text-align: center;
    font-size: 12px;
}

#container .center {
    position: absolute;
    width: 100%;
    bottom: 24px;
}

#container .btmtip {
    cursor: pointer;
    border-radius: 5px;
    background-color: #0D9BF2;
    padding: 6px;
    width: 160px;
    color: white;
    margin: 0 auto;
    text-align: center;
}
</style>
