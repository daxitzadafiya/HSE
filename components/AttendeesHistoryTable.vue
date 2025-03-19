<template>
    <div>
        <v-data-table v-if="attendeeItemsDetail.length > 0"
              :headers="attendeeHistoryHeaders"
              :items="attendeeItemsDetail" 
              class="elevation-1 review-table review-popup-table mt-5"
              :items-per-page="15"
              :single-expand="true"
              :sort-by="['created_at']"
              :sort-desc="[true, false]"
              hide-default-header
              hide-default-footer
              @click:row="attendeeStatus"
            >
            
              <template slot="top">
                <v-toolbar flat class="align-center">
                  <v-toolbar-title>
                    {{ title ? title : $t('title.attendees_history') }}
                  </v-toolbar-title>
                </v-toolbar>
              </template>
                <template v-slot:item.imageStatus="{item , index}">
                  <img src="../assets/images/icon/change-employee.png" alt="" srcset="" v-if="item.type == 'change'">
                  <img src="../assets/images/icon/remove-employee.png" alt="" srcset="" v-if="item.type == 'remove'">
                  
                </template>
                <template v-slot:item.employeeStatus="{item , index}">
                  <span v-if="item.type == 'change'">{{item.old_attendee_employee + ' ' + 'Change To' + ' ' + item.new_attendee_employee + ' ' + 'By' + ' ' + item.updated_by}}</span>
                  <span v-if="item.type == 'remove'">{{item.old_attendee_employee + ' ' + 'Removed By' + ' ' + item.updated_by}}</span>
                  <!-- {{ index%2==0 ? item.employeeStatus : item.employeeStatus }} -->
                  
                </template>
                <template v-slot:item.plusicon="{item}">
                  <div role="button"  class="plus-icon-gray d-flex align-center justify-center ms-auto" >
                    +
                  </div>
                </template>
            </v-data-table>
            <review-attendee-history
            v-if="attendeeReview"
              :open-popup="isAttendeeDetail"
              :objectItem="editedItem"
              :time_info="time_info"
              @closePopup="isAttendeeDetail = !isAttendeeDetail"
              />
    </div>
</template>
<script>
import ReviewAttendeeHistory from './ReviewAttendeeHistory.vue'
export default {
  components: { ReviewAttendeeHistory },
    name:"AttendeesHistoryTable",
    props:{
        title:{
            type:String,
            required:false,
        },
        attendeeHistoryHeaders:{
            type:[Array,Object],
            required:false
        },
        attendeeItemsDetail:{
            type:[Array,Object],
            required:false
        },
        responsible_name:{
          type:[Array,Object],
            required:false
        },
        attendeeReview:{
          type:Boolean,
          required:false
        },
        
    },
    data(){
      return{
        isAttendeeDetail:false,
        editedItem:{},
        time_info:{}
      }
    },
    methods:{
        attendeeStatus(item){
          console.log("review-his",item);
          if (this.attendeeReview == true) {
            this.editedItem = item
            this.time_info = this.editedItem.time_info
            this.isAttendeeDetail = true
            }else{
              this.$emit('viewAttendeeDetail',item)
            }
        }
    }
}
</script>
<style scoped>
.plus-icon-gray {
  width: 25px;
  height: 25px;
  background-color: #9f9f9f;
  margin-left: 10px;
  border-radius: 100%;
  font-size: 25px;
  line-height:25px;
  color: #fff;
}
</style>
