<template>
    <div>
        <v-dialog v-model="openPopup" max-width="800px" persistent>
            <v-card class="p-4">
                    <div class="popup-header text-center p-4 text-green " style="font-size: 20px;">
                        {{ formTitle }}
                    </div>
                        <table class="table border p-2 rounded">
                                <thead>
                                    <tr class="text-white text-uppercase font-weight-bold"
                                        style="background-color: #B1BFC6;">
                                        <th v-if="form.for_admin" scope="col">{{ $t('column.company') }}</th>
                                        <th scope="col">{{ $t('column.type') }}</th>
                                        <th scope="col">{{ $t('column.status') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td v-if="form.for_admin">{{ form.company }}</td>
                                        <td>{{ form.type }}</td>
                                        <td>{{ form.status == 1 ? 'Sent' : 'Fail' }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="table border p-2 rounded">
                                <thead>
                                    <tr class="text-white text-uppercase font-weight-bold"
                                        style="background-color: #B1BFC6;">
                                        <th scope="col">{{ $t('column.description') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{{ form.description }}</td>
                                    </tr>
                                </tbody>
                            </table>
       
                        <div class="d-flex mt-6" style="gap: 5px;">
                            <v-btn class="w-100 p-2  rounded text-center" @click="close">
                                {{ $t('button.cancel') }}
                            </v-btn>
                        </div>
            </v-card>
        </v-dialog>
    </div>
</template>
    
<script>
export default {
    name: "ELogsPopup",
    components: {},
    props: {
        openPopup: {
            type: Boolean,
            required: false,
        },
        editedItem: {
            type: Object,
        }
    },
    data: () => ({
        form: {
            company: "",
            type: "",
            description: "",
            status : "",
            for_admin : "",
        },
        formTitle: '',
    }),

    computed: {},

    watch: {
        openPopup(value) {
            if (value) {
                if (this.editedItem) {
                    this.editContent(this.editedItem);
                }
            }
        },
    },

    mounted() {},

    methods: {
        editContent(item) {
            this.formTitle = this.$i18n.t('title.email_logs');
            this.form = {
                id: item.id,
                type: item.type,
                description: item.description,
                company: item?.company?.name,
                status: item.status,
                for_admin: item.for_admin,
            }
        },

        close() {
            this.$emit('closePopup');
        },

        reloadList() {
            this.$emit('reloadList');
        },
    },
};
</script>
    
<style scoped>
.text-green {
    color: #87a53a;
}
</style>