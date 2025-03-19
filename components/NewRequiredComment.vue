<template>
  <div class="section-required-action">
    <b-row>
      <b-col class="main-action" cols="2">
        <div class="required-action-title position-relative">
          <!-- <b>{{ $t('form.required_action') }}</b> -->
          <b>{{ mainAction }}</b>
          <v-badge
            v-if="isBadge"
            :value="hover"
            right
            transition="slide-x-transition"
            class="hse-badge-icon reson-hover-label">
            <span slot="badge">{{ $t('form.transfer_all_information') }} </span>
            <v-hover v-model="hover">
              <i class="fa fa-question-circle"></i>
            </v-hover>
          </v-badge>
        </div>
      </b-col>
      <b-col class="main-action-switch" cols="2">
        <div class="switch-component">
          <label class="left-text">{{ $t('form.none') }}</label>
          <v-switch
            v-model="checkAction"
            :label="$t('form.active')"
            inset
            class="right-text"
            @change="changeAction"
          />
        </div>
      </b-col>
      <b-col v-if="checkAction" class="sub-action" cols="2">
        <div class="required-action-title text-right">
          <b>{{ subActionFirst }}</b>
        </div>
      </b-col>
      <b-col v-if="checkAction" cols="2" class="sub-action-switch">
        <div class="switch-component switch-required-action">
          <label class="left-text">{{ $t('form.no') }}</label>
          <v-switch
            v-model="checkComment"
            :label="$t('form.yes')"
            inset
            class="right-text"
            @change="changeComment"
          />
        </div>
      </b-col>
      <b-col v-if="checkAction" class="sub-action-2" cols="2">
        <div class="required-action-title text-center">
          <b>{{ subActionSecond }}</b>
        </div>
      </b-col>
      <b-col v-if="checkAction" cols="2" class="sub-action-switch-2">
        <div class="switch-component switch-required-action">
          <label class="left-text">{{ $t('form.no') }}</label>
          <v-switch
            v-model="checkAttachment"
            :label="$t('form.yes')"
            inset
            class="right-text"
            @change="changeAttachment"
          />
        </div>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  name: 'NewRequiredComment',
  components: {},
  props: {
    objectItem: {
      type: Object,
      required: true,
    },
    isAttendee: {
      type: Boolean,
      required: false,
    },
    editMode: {
      type: Boolean,
      required: false,
    },
    isChecklistOption: {
      type: Boolean,
      required: false,
    },
    mainAction: {
      type: String,
      required: false,
    },
    subActionFirst: {
      type: String,
      required: false,
    },
    subActionSecond: {
      type: String,
      required: false,
    },
    isBadge: {
      type: Boolean,
      required: false,
    },
    checkActionswitch:{
      type: Boolean,
      required: false,
    },
    checkCommentswitch:{
       type: Boolean,
      required: false,
    },
     checkAttachmentswitch:{
       type: Boolean,
      required: false,
    },
  },
  data: () => ({
    hover: false,
    checkAction: false,
    checkComment: false,
    checkAttachment: false,
  }),

  watch: {
    objectItem(value) {
      if (value) {
        if (this.editMode) {
          this.editItem(this.objectItem)
          this.actionItem()
        } else {
          this.addNew()
        }
      }
    },
    checkActionswitch(value){
      console.log("Check action log");
      if (value) {
        this.checkAction= value
      }
      else{
        this.checkAction= false
      }
    },
    checkCommentswitch(value){
      if (value) {
        this.checkComment= value;
      }
      else{
        this.checkComment= false
      }
    },
    checkAttachmentswitch(value){
      if (value) {
        this.checkAttachment= value
      }
      else{
        this.checkAttachment= false
      }
    }

  },
  mounted(){
    console.log("hello comment called");
    this.checkAction= this.checkActionswitch ? this.checkActionswitch : false,
    this.checkComment= this.checkCommentswitch ? this.checkCommentswitch : false,
    this.checkAttachment= this.checkAttachmentswitch ? this.checkAttachmentswitch : false
  },

  methods: {
    addNew() {
      this.checkAction = this.checkComment = this.checkAttachment = false
    },
    actionItem(){
      this.checkAction= this.checkActionswitch ? this.checkActionswitch : false,
    this.checkComment= this.checkCommentswitch ? this.checkCommentswitch : false,
    this.checkAttachment= this.checkAttachmentswitch ? this.checkAttachmentswitch : false
    },
    editItem(item) {

      this.checkComment = 
      !this.isChecklistOption ? (this.isAttendee ? item['attendee'].required_comment : item['responsible'].required_comment) : item.checklist_required_comment
      
      this.checkAttachment = 
      !this.isChecklistOption ? (this.isAttendee ? item['attendee'].required_attachment : item['responsible'].required_attachment) : item.checklist_required_attachment
      
      this.checkAction = this.checkComment || this.checkAttachment
    },

    changeAction(val){
      if (this.isAttendee) {
          this.objectItem.attendee_required_comment = val == false ? false : '';
          this.objectItem.attendee_required_attachment= val == false ? false : '';
          this.checkComment = false
          this.checkAttachment = false
        } 
        if (!this.isAttendee && !this.isChecklistOption){
          this.objectItem.responsible_required_comment = val == false ? false : '';
          this.objectItem.responsible_required_attachment = val == false ? false : '';
          this.checkComment = false
          this.checkAttachment = false
        }

        if(this.isChecklistOption){
          this.objectItem.required_comment=val == false ? false : '';
          this.objectItem.checklist_required_comment=val == false ? false : '';
          this.objectItem.required_attachment=val == false ? false : '';
          this.objectItem.checklist_required_attachment=val == false ? false : '';
          this.checkComment = false
          this.checkAttachment = false
        }
        if (val == false) {
          this.checkAction=false
          this.checkComment = false
          this.checkAttachment = false
        }
        this.$emit('changeSwitch',this.checkComment, this.checkAttachment);
    },

    changeComment(val) {
      if (this.isAttendee) {
          this.objectItem.attendee_required_comment = val;
        } 
        if (!this.isAttendee && !this.isChecklistOption){
          this.objectItem.responsible_required_comment = val;
        }

        if(this.isChecklistOption){
          this.objectItem.required_comment=val;
          this.objectItem.checklist_required_comment=val;
        }

        this.checkComment = val == true ? true : false
        this.checkAction = this.checkComment || this.checkAttachment ? true : false
        this.$emit('changeSwitch',this.checkComment, this.checkAttachment);
    },

    changeAttachment(val) {
      if (this.isAttendee) {
          this.objectItem.attendee_required_attachment = val;
        } 
        if (!this.isAttendee && !this.isChecklistOption){
          this.objectItem.responsible_required_attachment = val;
        }

        if(this.isChecklistOption){
          this.objectItem.required_attachment=val;
          this.objectItem.checklist_required_attachment=val;
        }

        this.checkAttachment = val == true ? true : false
        this.checkAction = this.checkComment || this.checkAttachment ? true : false
        this.$emit('changeSwitch',this.checkComment, this.checkAttachment);

    },
  },
}
</script>
<style scoped>
.reson-hover-label {
  position: absolute;
  /* top: 8px;
    left: 142px; */
}
</style>
