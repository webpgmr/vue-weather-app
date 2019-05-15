<style>
    div,
    section {
        border: 1px solid cornflowerblue;
        border-radius: 5px;
        margin-bottom: 15px;
        padding: 10px;
    }
</style>

<template>
    <weather :location="location"></weather>
    <div>
        <label>Filter <input v-model="filter" debounce="100"></label>
    </div>
    <phone-number v-show="showPhoneNumbers" :id="$index" :entry="entry" v-for="entry in numbers | filterBy filter"
                  @phonenumber-delete="deleteEntry" @modified="saveEntries | debounce 500"
                  v-ref:phonenumbers>
    </phone-number>
    <div>
        <label><input v-model="showPhoneNumbers" type="checkbox"> Show phonebook <img slot="header" src="assets/phone.svg" alt="" width="15" height="15"></label>
    </div>
    <div>
        <input v-model="newName" @keyup.enter="addNewEntry">
        <input v-model="newNumber" @keyup.enter="addNewEntry">
        <button @click="addNewEntry">Add</button>
    </div>
</template>

<script type="text/ecmascript-6">
    import PhoneNumber from './phoneNumber.vue'
    import Weather from './weather.vue'

    export default {
        components: {
            PhoneNumber,
            Weather
        },
        created () {
            // load configuration as early as possible
            this.config = require('./config.hson');
            this.location = this.config.location;
        },
        ready () {
            this.loadEntries();
            console.log('ready ended');
        },
        data() {
            return {
                filter: '',
                showPhoneNumbers: true,
                numbers: [],
                newName: '',
                newNumber: '',
                location: ''
            }
        },
        methods: {
            addNewEntry () {
                var newEntry = {'name': this.newName, 'number': this.newNumber, 'isFavored': false};
                this.numbers.push(newEntry);
                this.newName = '';
                this.newNumber = '';
                this.saveEntries();
            },
            loadEntries () {
                if(!this.config.thingyToken) {
                    return;
                }
                this.$http.get("https://api.thethings.io/v2/things/" + this.config.thingyToken + "/resources/numbers",
                        function (data, status, request) {
                            this.numbers = data[0].value;
                            console.log('data loaded')
                        }.bind(this)).error(function (data, status, request) {
                    // handle error
                    console.log('error');
                });
            },
            saveEntries () {
                if(!this.config.thingyToken) {
                    return;
                }
                // save new entry
                this.$http.post("https://api.thethings.io/v2/things/" + this.config.thingyToken + "",
                        {
                            'values': [
                                {
                                    'key': 'numbers',
                                    'value': this.numbers
                                }
                            ]
                        },
                        function (data, status, request) {
                            console.log(data);
                        }).error(function (data, status, request) {
                    // handle error
                })
            },
            getIndexByEntry (entry) {
                var i = 0;
                var match = -1;
                this.numbers.forEach(function (foo) {
                    if (foo.number == entry.number && foo.name == entry.name) {
                        match = i;
                    }
                    i++;
                }.bind(this));
                return match;
            },
            deleteEntry (entry, id) {
                // this method will be called when the delete event is fired in child component
                // it is not really an event listener, you could also use an event listener here
                // the advance oh this approach is, its applied in template and thus more in line with the vue approach
                // using @phonenumber-delete="deleteEntry" like with native events
                console.log('deleteEntry', arguments);
                var index = this.getIndexByEntry(entry);
                console.log(this.numbers);
                console.log(index);
                this.numbers.splice(index, 1);
                this.saveEntries();
            }
        }
    }
</script>
