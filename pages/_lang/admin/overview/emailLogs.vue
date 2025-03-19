<template>
    <div class="resources-page">
        <b-tabs card>
            <b-tab :title="$t('tab.email_logs')">
                    <v-container>
                        <!-- Add new -->
                        <EmailLogs :open-popup="checkEmailLogs" :edited-item="emailLogsItem"
                            @closePopup="checkEmailLogs = !checkEmailLogs" @reloadList="reloadListEmailLogs" />

                        <!-- Table -->
                        <v-data-table :headers="headers" :items="contentsArray"
                            class="elevation-1 hse-table table-data" :items-per-page="10" :single-expand="true"
                            :sort-by="['created_at']" :sort-desc="[true, false]" @click:row="editEmailLogs">

                            <template v-slot:header>
                                <h4 class="table-name">
                                    {{ $t('table.email_logs') }}
                                </h4>
                            </template>

                            <template v-slot:item.company="{ item }">
                                {{ item.company ? item.company.name : "-" }}
                            </template>

                            <template v-slot:item.status="{ item }">
                                <b-badge :variant="item.status == 1 ? 'info' :'danger' ">{{ item.status == 1  ? 'Sent' : 'Fail' }}</b-badge>
                           </template>

                            <template v-slot:item.created_at="{ item }">
                            {{ moment(item.created_at).format('DD.MM.YYYY') }}
                            </template>

                            <template v-slot:no-data>
                                {{ $t('table.no_data') }}
                            </template>
                        </v-data-table>
                    </v-container>
                </b-tab>
        </b-tabs>
    </div>
</template>
<script>
import EmailLogs from '../../../../components/EmailLogsPopup.vue';

export default {
    components: {
        EmailLogs
    },

    data: () => ({
        checkEmailLogs: false,
        contentsArray: [],
        listSetting: [],    
        emailLogsItem: null,

        required: [
            v => {
                if (!v || v.length < 1)
                    return 'This is required';
                else return true;
            },
        ],
    }),

    computed: {
        headers() {
            return [
                {
                    text: this.translateCol('company'),
                    value: 'company',
                    align: 'left'
                },
                
                {
                    text: this.translateCol('type'),
                    align: 'left',
                    value: 'type',
                },
                // {
                //     text: this.translateCol('description'),
                //     align: 'left',
                //     value: 'description',
                //     width: '40%',
                // }, 
                {
                    text: this.translateCol('status'),
                    align: 'left',
                    value: 'status',
                },
                {
                    text: this.translateCol('created_at'),
                    align: 'left',
                    value: 'created_at',
                },
            ];
        },
    },

    watch: {},

    mounted() {
        this.reloadListEmailLogs();
    },

    methods: {
        translateCol(colName) {
            return this.$i18n.t('column.' + colName);
        },
        handleSelectValue(value) {
            console.log(value)
        }, 
        editEmailLogs(item) {
            this.emailLogsItem = item;
            this.checkEmailLogs = true;
        },
        
        reloadListEmailLogs() {
            let that = this;
            that.$store.dispatch('emailLogs/index').then(result => {
                that.contentsArray = result.data;
                that.$nuxt.$loading.finish();
            }).catch((error) => {
                if (error.response.status == 401) {
                    that.$router.push('/login');
                    that.$toaster.error(that.$i18n.t('message.token_expired'));
                } else {
                    that.$toaster.error(that.$i18n.t('message.fail_contents_view_detail'));
                }
                that.$nuxt.$loading.finish();
            });
        },
    },
};  
</script>

