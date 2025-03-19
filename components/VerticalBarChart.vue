<script>
import { Bar } from 'vue-chartjs';
import {_} from "vue-underscore";
import cookies from "js-cookie";

export default {
  name: "VerticalBarChart",
  extends: Bar,
  props: ['type', 'mode'],

  data: () => ({
    userRoleId: parseInt(cookies.get('roleID')),
    userDepartmentID: parseInt(cookies.get('userDepartmentID')),
    checkAdmin: cookies.get('checkAdmin'),
    roleUser: cookies.get('roleUser'),
    userID: parseInt(cookies.get('userID')),
    aveRate: 0,
    chartData: {
      labels: [
        'Personal',
        'Department',
        ''
      ],
      datasets: [{
        label: '',
        backgroundColor: 'rgb(58,155,165)',
        hoverOffset: 4
      }],
    },
    options: {
      responsive: true,
      legend: {
        display: true
      },
      layout: {
        padding: {
          bottom: 20
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          align: 'start'
        },
        title: {
          display: true,
          text: 'Chart.js Bar Chart',
          padding: {
            top: 10,
            bottom: 30
          }
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    },
    listArray: [],
  }),

  // watch: {
  //   chartData: {
  //     handler: 'getData',
  //     immediate: true,
  //   },
  // },

  mounted () {
    let that = this;
    that.$nextTick(() => {
      that.$nuxt.$loading.start();
      that.chartData.datasets[0].label = 'Number of ' + that.type + 's';
      let hasStatus = ['goal', 'report checklist', 'risk analysis', 'deviation'];
      let withoutStatus = ['task', 'routine', 'instruction', 'checklist', 'risk element', 'document'];
       if (_.indexOf(withoutStatus, that.type) > -1) {
        that.$store.dispatch('statements/index', {param: 'dashboard', dashboardType: that.type}).then(result => {
          that.listArray = result.data;
          // if (that.type === 'deviation') {
          //   console.log('aaa: ', result.data);
          // }
          if (that.mode === 'user' || that.mode === 'manager') {
            let total = that.listArray.length;
            let personal = _.filter(that.listArray, function (item) {
              return item.added_by === that.userID;
            }).length;
            let department = _.filter(that.listArray, function (item) {
              return item.userDepartment === that.userDepartmentID;
            }).length;

            that.chartData.datasets[0].data = [personal, department];
            that.renderChart(that.chartData, that.options);
            if (total === 0) {
              that.aveRate = 0;
            } else {
              that.aveRate = personal * 100 / total;
              that.aveRate = that.aveRate.toFixed(2);
            }
            that.returnAveRate(that.aveRate + '%');
          } else {
            let total = that.listArray.length;
            let personal = _.filter(that.listArray, function (item) {
              return item.added_by === that.userID;
            }).length;
            // let department = _.filter(that.listArray, function (item) {
            //   return item.userDepartment === that.userDepartmentID;
            // }).length;

            that.chartData.labels = ['Personal', 'Company', ''];
            that.chartData.datasets[0].data = [personal, total];
            that.renderChart(that.chartData, that.options);
            if (total === 0) {
              that.aveRate = 0;
            } else {
              that.aveRate = personal * 100 / total;
              that.aveRate = that.aveRate.toFixed(2);
            }
            that.returnAveRate(that.aveRate + '%');
          }
          that.$nuxt.$loading.finish();
        }).catch(() => {
          // that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
       } else if (_.indexOf(hasStatus, that.type) > -1) {
         that.$store.dispatch('statements/index', {param: 'dashboard', dashboardType: that.type}).then(result => {
           that.listArray = result.data;
           // console.log(result.data);
           if (that.mode === 'user' || that.mode === 'manager') {
             let total = that.listArray.length;
             let personal_total = 0;
             let personal_new = 0;
             let personal_processing = 0;
             let personal_closed = 0;
             let department_new = 0;
             let department_processing = 0;
             let department_closed = 0;

             _.each(that.listArray, function (item) {
               if (item.added_by === that.userID) {
                 personal_total = personal_total + 1;
                 if (item.status === 1) {
                   personal_new = personal_new + 1;
                 } else if (item.status === 3) {
                   personal_closed = personal_closed + 1;
                 } else {
                   personal_processing = personal_processing + 1;
                 }
               }
               if (item.userDepartment && item.userDepartment === that.userDepartmentID) {
                 if (item.status === 1) {
                   department_new = department_new + 1;
                 } else if (item.status === 3) {
                   department_closed = department_closed + 1;
                 } else {
                   department_processing = department_processing + 1;
                 }
               }
             });

             that.chartData.datasets = [
               {
                 label: 'New',
                 data: [personal_new, department_new],
                 backgroundColor: 'rgb(231,134,134,0.9)',
                 stack: 'Stack 0',
               },
               {
                 label: 'Processing',
                 data: [personal_processing, department_processing],
                 backgroundColor: 'rgb(255,214,101,0.9)',
                 stack: 'Stack 0',
               },
               {
                 label: 'Closed',
                 data: [personal_closed, department_closed],
                 backgroundColor: 'rgb(153,213,128,0.9)',
                 stack: 'Stack 0',
               }
             ];
             that.renderChart(that.chartData, that.options);
             if (total === 0) {
               that.aveRate = 0;
             } else {
               that.aveRate = personal_total * 100 / total;
               that.aveRate = that.aveRate.toFixed(2);
             }
             that.returnAveRate(that.aveRate + '%');
           } else {
             let total = that.listArray.length;
             let personal_total = 0;
             let personal_new = 0;
             let personal_processing = 0;
             let personal_closed = 0;
             let company_new = 0;
             let company_processing = 0;
             let company_closed = 0;

             _.each(that.listArray, function (item) {
               if (item.added_by === that.userID) {
                 personal_total = personal_total + 1;
                 if (item.status === 1) {
                   personal_new = personal_new + 1;
                 } else if (item.status === 3) {
                   personal_closed = personal_closed + 1;
                 } else {
                   personal_processing = personal_processing + 1;
                 }
               }
               if (item.status === 1) {
                 company_new = company_new + 1;
               } else if (item.status === 3) {
                 company_closed = company_closed + 1;
               } else {
                 company_processing = company_processing + 1;
               }
             });

             that.chartData.labels = ['Personal', 'Company', ''];
             that.chartData.datasets = [
               {
                 label: 'New',
                 data: [personal_new, company_new],
                 backgroundColor: 'rgb(231,134,134,0.9)',
                 stack: 'Stack 0',
               },
               {
                 label: 'Processing',
                 data: [personal_processing, company_processing],
                 backgroundColor: 'rgb(255,214,101,0.9)',
                 stack: 'Stack 0',
               },
               {
                 label: 'Closed',
                 data: [personal_closed, company_closed],
                 backgroundColor: 'rgb(153,213,128,0.9)',
                 stack: 'Stack 0',
               }
             ];

             that.renderChart(that.chartData, that.options);
             if (total === 0) {
               that.aveRate = 0;
             } else {
               that.aveRate = personal_total * 100 / total;
               that.aveRate = that.aveRate.toFixed(2);
             }
             that.returnAveRate(that.aveRate + '%');
           }
           that.$nuxt.$loading.finish();
         }).catch(() => {
           // that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
           // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
           that.$nuxt.$loading.finish();
         });
       }
    });
  },

  methods: {
    returnAveRate(value) {
      this.$emit('getAveRate', value);
    }
  }
};
</script>

<style scoped>

</style>
