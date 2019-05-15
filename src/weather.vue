<style scoped>
    .temperature {
        line-height: 52px;
        vertical-align: top;
        font-size: 20px;
        font-weight: bold;
        margin-left: 15px;
    }
</style>

<template>
    <div @click="updateWeather | debounce 100" v-cloak>
        <img :src="weatherIcon" alt="" width="52" height="52"/>
        <span class="temperature">{{ temperature }}</span>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            location: {
                type: String,
                required: true
            }
        },
        ready () {
            this.updateWeather();

            // update weather each minute
            this.handle = setInterval(function () {
                this.updateWeather();
            }.bind(this), 60 * 1000);

            console.log('ready ended weather component');
        },
        data() {
            return {
                temperature: '-',
                weatherData: null
            }
        },
        computed: {
            weatherIcon () {
                var weatherIconNumber = 0;
                if (this.weatherData) {
                    weatherIconNumber = this.weatherData.query.results.channel.item.condition.code;
                }
                return 'http://l.yimg.com/a/i/us/we/52/' + weatherIconNumber + '.gif';
            }
        },
        methods: {
            updateWeather () {
                this.$http.get("https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + this.location + "') and u='c'&format=json", function (data, status, request) {
                    this.weatherData = data;
                    this.temperature = data.query.results.channel.item.condition.temp + '° C';
                    console.log('wetter aktualisiert');
                }).error(function (data, status, request) {
                    // handle error
                })
            }
        },
        destroyed () {
            // clear update interval on component destruction
            clearInterval(this.handle);
        }
    }
</script>
