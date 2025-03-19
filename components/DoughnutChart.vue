<script>
import { Doughnut } from 'vue-chartjs';
import {_} from "vue-underscore";
// import {_} from "vue-underscore";

export default {
  name: "DoughnutChart",
  extends: Doughnut,
  props: ['type', 'mode'],

  data: () => ({
    total: 0,
    chartData: {
      labels: [],
      datasets: [{
        label: '',
        data: [],
        backgroundColor: [],
        hoverOffset: 4
      }],
    },
    options: {
      responsive: true,
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
          text: 'Chart.js Doughnut Chart',
          padding: {
            top: 10,
            bottom: 30
          }
        }
      }
    },
  }),

  mounted () {
    let that = this;
    that.$nextTick(() => {
      if (that.type === 'taskAssignee') {
        that.chartData.labels = ['New', 'Processing', 'Closed'];
        that.$store.dispatch('taskAssignees/index').then(result => {
          that.processingData = {
            total: result.data.length,
            new: _.filter(result.data, function (item) {
              return item.status === 1;
            }).length,
            processing: _.filter(result.data, function (item) {
              return item.status === 2;
            }).length,
            closed: _.filter(result.data, function (item) {
              return item.status === 3;
            }).length,
          };
          that.chartData.datasets[0].data = [that.processingData.new, that.processingData.processing, that.processingData.closed];
          // that.chartData.datasets[0].backgroundColor = ['rgb(61,214,140)', 'rgb(254,199,95)', 'rgb(6,208,233)'];
          // that.chartData.datasets[0].backgroundColor = ['rgb(247,67,67,0.8)', 'rgb(254,199,95,0.9)', 'rgb(61,214,140,0.8)'];
          that.chartData.datasets[0].backgroundColor = ['rgb(231,134,134,0.9)', 'rgb(255,214,101,0.9)', 'rgb(153,213,128,0.9)'];
          that.renderChart(that.chartData, that.options);
          that.returnTotal(that.processingData.total);
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.fail_task_assignee_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      } else if (that.type === 'contact') {
        that.$store.dispatch('statements/index', {param: 'dashboard', dashboardType: that.type}).then(result => {
          that.listArray = result.data;
          if (result.data) {
            _.each(that.listArray, function (item) {
              let countByCategory = 0;
              if (item.countByCategory) {
                countByCategory = parseInt(item.countByCategory);
              }
              that.total = that.total + countByCategory;
              that.chartData.labels.push(item.name);
              that.chartData.datasets[0].data.push(countByCategory);
              let strRGBA = 'rgba(' + Math.floor(Math.random() * (255 + 1)) + ',' + Math.floor(Math.random() * (255 + 1)) + ',' + Math.floor(Math.random() * (255 + 1)) + ',0.7)';
              that.chartData.datasets[0].backgroundColor.push(strRGBA);
            });
            that.renderChart(that.chartData, that.options);
            that.returnTotal(that.total);
          }
          that.$nuxt.$loading.finish();
        }).catch((error) => {
            if (error.response.status == 401) {
            that.$router.push('/login');
            that.$toaster.error(that.$i18n.t('message.token_expired'));
          }
          // that.$toaster.error(that.$i18n.t('message.fail_statement_view'));
          // that.$toaster.error(error.response.data.message || error.response.data.errors[0].errorMessage || error.response.data.errors);
          that.$nuxt.$loading.finish();
        });
      }
    });
  },

  methods: {
    returnTotal(value) {
      this.$emit('getTotal', value);
    }
  }
};
</script>

<style scoped>

</style>
