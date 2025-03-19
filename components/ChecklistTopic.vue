<template>
    <div>
        <!-- <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          > -->
        <div class="manage-task mt-6">
              <b-row>
                <b-col cols="6">
                    <b-row>
                 <b-col cols="2" class="hse-document-badge-tab">
                    <div class="bold-title md-line-height me-0">
                        {{ $t('form.topic') }}
                    </div>
                  </b-col>
                <b-col cols="2" class="mt-7 p-0" >
                <div role="button" v-if="!checkAddReport && editedItem.editPermission" @click="addNewTopicName" :class="topicArray.length===1?'plus-icon-gray text-center d-flex align-center justify-center':'plus-icon text-center'" >
                 +
                </div>
                </b-col>
              </b-row>
                </b-col>
                <b-col v-for="(item, index) in topicArray" :key="index" cols="12" class="mb-5 mt-5">
                  <div class="section-connect-to section-connect-to-checklist-topic">
                    <div class="section-connect-to-label section-connect-to-label-checklist add-new-section display-inline-flex">
                      <v-text-field
                        v-model="item.name"
                        :label="$t('form.topic')+' '+(index+1)"
                        :rules="required"
                        outlined
                        :readonly="!editedItem.editPermission"
                      />
                     <div class="input-icon">
                      <img class="icon-img" @click="copyTopic(item , index)" src="../assets/images/icon/file.png" alt="file.png"/>
                      <v-icon v-if="!checkAddReport || editedItem.editPermission" class="ml-5 icon-checklist-topic-delete" :disabled="topicArray.length === 1" @click.stop="deleteTopicList(item)">
                        delete
                      </v-icon>
                     </div>
                    </div>

                    <v-btn v-if="!checkAddReport || editedItem.editPermission" class="add-new-down-title btn-add-new-checklist-checkpoint" @click="addNewQuestion(index)">
                      + {{ $t('button.checkpoint') }}
                    </v-btn>

                    <div class="padding-15-checklist">
                      <v-expansion-panels v-if="isAddNewCheckpoint" :value="panelValue">
                      <!-- <v-expansion-panels v-if="isAddNewCheckpoint" > -->
                        <v-expansion-panel
                          v-for="(question,i) in item.questions"
                          :key="question.questions"
                        >
                          <v-expansion-panel-header class="">
                            <template v-slot:default="{ open }">
                              <span v-if="!open && !question.name">{{ $t('form.checkpoint') }} {{i+1}}</span>
                              <span v-if="!open && question.name">{{ question.name}}</span>
                              <b-col cols="1" class="d-flex  justify-content-between" @click.stop>
                                <span class="img-icon">
                               <img  v-if="!open" src="../assets/images/icon/file.png" alt="file.png" @click="copyQuestion(index, question)"/>
                                </span>
                              <v-icon v-if="!open" class="icon-checklist-topic-delete delete-icon" :disabled="item.questions.length === 1" @click.stop="deleteQuestionItem(item, question)">
                                delete
                              </v-icon>
                            </b-col>
                             
                            </template>
                            
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <div class="input-wrap section-connect-to section-connect-to-checklist-topic">
                            <b-row class="align-items-baseline check-point-accordian ">
                              <b-col cols="10" class="pb-0">
                                  <v-text-field
                                    v-model="question.name"
                                    :label="$t('form.checkpoint')+' '+(i+1)"
                                    :rules="required"
                                    outlined
                                    :readonly="!editedItem.editPermission"
                                    class="bg-white"
                                  />
                              </b-col>
                              <b-col cols="1" class="bg-white mx-auto d-flex pb-0">
                             <div class="mx-auto">
                              <img role="button" src="../assets/images/icon/file.png" alt="file.png" @click="copyQuestion(index,question)"/>
                                <v-icon v-if="!checkAddReport || editedItem.editPermission" class="icon-checklist-topic-delete" :disabled="item.questions.length === 1"
                                @click.stop="deleteQuestionItem(item, question)">
                               delete
                                </v-icon>
                             </div>
                              </b-col>
                            </b-row>
                            <b-row class="mt-0">
                              <b-col cols="2" class="pt-0">
                                <div class="department-title-with-new">
                                  {{ $t('form.option') }}
                                </div>
                                <v-btn :disabled="viewOnly || !editedItem.editPermission" class="add-new-down-title" @click="addNewOption(i)">
                                  + {{ $t('button.new_option') }}
                                </v-btn>
                              </b-col>
                              <b-col cols="10"  class="pt-0">
                                <div class="input-wrap">
                                  <v-select v-if="!checkApplyItem"
                                    v-model="question.default_option_id"
                                    :items="checkApplyItem ? answerData : answerArray"
                                    item-text="option_name"
                                    item-value="id"
                                    label="Options"
                                    outlined
                                    :rules="required"
                                    :readonly="!editedItem.editPermission"
                                    @change="(e)=> optionSelect(e,answerArray,index,i)"
                                  />
                                  <v-select v-if="checkApplyItem"
                                    v-model="question.default_option_id"
                                    :items="answerArray"
                                    item-text="option_name"
                                    item-value="id"
                                    label="Options"
                                    outlined
                                    :rules="required"
                                    :readonly="!editedItem.editPermission"
                                    @change="(e)=> optionSelect(e,answerArray,index,i)"
                                  />
                                </div>
                              </b-col>
                              <b-col>
                                <NewRequiredComment
                                  :object-item="question"
                                  :isChecklistOption="true"
                                  :editMode="true"
                                  :checkActionswitch="(question.required_comment == 1 || question.required_attachment == 1) "
                                  :checkCommentswitch="question.required_comment == 1"
                                  :checkAttachmentswitch="question.required_attachment == 1"
                                  :mainAction="$t('form.action')"
                                  :subActionFirst="$t('form.comment')"
                                  :subActionSecond="$t('form.image')"
                                  class="required-comment"
                                  @changeSwitch="(comment,attachment)=>changeSwitch(comment,attachment,index,i)"
                                />
                                
                              </b-col>
                            </b-row>
                          </div>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </div>
                  </div>
                </b-col>
              </b-row>
              <b-row>
               
                <b-col v-if="isShowInputTopic && !checkAddReport && editedItem.editPermission" cols="9" class="mt-2">
                  <div class="connect-department">
                    <div class="department d-flex">
                      <v-text-field v-model="newTopicData.name" :rules="required" outlined />
                      <span class="department-button">
                        <v-btn class="mb-2 btn-add-department" @click="addNewTopicName">
                          {{ $t('button.add') }}
                        </v-btn>
                        <v-btn class="mt-1 mb-2 btn-cancel-department" @click="cancelNewTopicName">
                          {{ $t('button.cancel') }}
                        </v-btn>
                      </span>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
            <!-- </v-form> -->
            <NewAnswerOptionPopup
      :open-popup="dialogNewOption"
      :resource="userRoleId === 1"
      @closePopup="dialogNewOption = !dialogNewOption"
      @reloadAnswerOptionsList="reloadAnswerOptionsList"
      @isSelectOption="isSelectOption"
    />
    </div>
</template>
<script>
  // import {_} from 'vue-underscore';
  import cookies from "js-cookie";
  import NewAnswerOptionPopup from "./NewAnswerOptionPopup";
import NewRequiredComment from './NewRequiredComment.vue';
// import RequiredAction from './RequiredAction.vue';
  export default {
    name: "ChecklistTopic",
    components: {NewAnswerOptionPopup,
    NewRequiredComment,
    //  RequiredAction
     },
    props:{
        topicArray:{
            type:Array,
            require:false,
        },
        editedItem:{
            type:Object,
            require:false,
        },
        viewOnly: {
            type: Boolean,
            required: false,
        },
        answerArray:{
            type:Array,
            required:false
        },
        checkApplyItem:{
          type: Boolean,
            required: false,
        }
    },
    data: () => ({
        formDirty:false,
        valid:true,
        isShowInputTopic:false,
        currentIndex:0,
        dialogNewOption: false,
        isAddNewCheckpoint:true,
        checkAddReport: false,
        checkAction:false,
        checkAttachment:false,
        checkComment:false,
        panel:0,
      userRoleId: parseInt(cookies.get('roleID')), 
        newTopicData: {
            name: "",
            questions: [],
        },
        required: [
        v => {
          if (!v || v.length < 1)
            return 'This is required';
          else return true;
        }
      ],
      optionComment:false,
      optionImage:false,
      optionActionFlag:false,
      currentTopicInd:0,
      currentQueInd:0,
    }),
    watch: {
      topicArray(value) {
        // if (this.checkApplyItem == true) {
        //   this.panel=false
        // }else{
        //   this.panel=0
        // }
        // this.panel=0
        // value.map((topicItem)=>{
        //   topicItem.questions.map((que)=>{
        //     console.log("que",que);
        //   this.optionComment = que.required_comment == 1 ? true : false
        //   this.optionImage = que.required_attachment == 1 ? true : false
        //   this.checkAction = que.required_comment == 1 || que.required_attachment ==1 ? true : false
        //     console.log("this.checkComment",this.checkComment);
        //     console.log("this.checkAttachment",this.checkAttachment);
        //     console.log("this.checkAction",this.checkAction);
        //   })

      // })
      this.optionComment=false
      this.optionImage=false
        if(value=='')
        this.topicArray.push({name: "",questions:[{name:"",default_option_id:"",option_answers:"",required_comment:"",required_attachment:"",checklist_required_comment:"",checklist_required_attachment:""}]})
        },
      },

      computed: {
        panelValue() {
          return this.checkApplyItem ? null : this.panel;
        }
      },
   
    methods:{
      changeSwitch(checkComment,checkAttachment,currentTopicInd,currentQueInd){
        this.optionActionFlag=false
        if (this.topicArray[currentTopicInd]?.questions) {
          
          this.topicArray[currentTopicInd].questions[currentQueInd].checklist_required_comment=checkComment;
          this.topicArray[currentTopicInd].questions[currentQueInd].required_comment=checkComment;
          this.topicArray[currentTopicInd].questions[currentQueInd].required_attachment=checkAttachment
          this.topicArray[currentTopicInd].questions[currentQueInd].checklist_required_attachment=checkAttachment;
        }
      },
      optionSelect(id,answerData ,topicIndex , queIndex){
        this.currentTopicInd=topicIndex;
        this.currentQueInd=queIndex;
        this.optionComment=false
        this.optionImage=false
        let answerObj = answerData.filter((el)=> el.id==id);
        this.optionComment = (answerObj?.[0]?.checklist_required_comment == 1 || answerObj?.[0]?.checklist_required_comment == '1') ? true : false
        this.optionImage = (answerObj?.[0]?.checklist_required_attachment == 1 || answerObj?.[0]?.checklist_required_attachment == '1') ? true : false
        this.topicArray[topicIndex].questions[queIndex].required_comment=this.optionComment;
        this.topicArray[topicIndex].questions[queIndex].required_attachment=this.optionImage;
        this.topicArray[topicIndex].questions[queIndex].checklist_required_comment=this.optionComment;
        this.topicArray[topicIndex].questions[queIndex].checklist_required_attachment=this.optionImage;
        this.optionActionFlag=true
      },
        deleteTopicList(item) {
        this.formDirty = true;
        this.topicArray.splice(this.topicArray.indexOf(item), 1);
      },
      addNewOption(index){
        this.currentIndex=index
        this.dialogNewOption = true
      },
       addNewTopicName(item){
        console.log(item);
        this.newTopicData.questions = [];
        this.isShowInputTopic = false;
        this.newTopicData.name = "";
        this.topicArray.push({name: "",questions:[{name:"",default_option_id:"",option_answers:"",required_comment:"",required_attachment:"",checklist_required_comment:"",checklist_required_attachment:""}]})
      },
      copyTopic(item){
        this.newTopicData.questions = [];
        this.isShowInputTopic = false;
        this.newTopicData.name = "";
             const copiedQuestions = item.questions.map(question => ({
            name: question.name,
            default_option_id: question.default_option_id,
            option_answers: question.option_answers,
            required_comment: question.required_comment,
            required_attachment: question.required_attachment,
            checklist_required_comment: question.checklist_required_comment,
            checklist_required_attachment: question.checklist_required_attachment
          }));
          this.checkAction = copiedQuestions[0].required_comment == true || copiedQuestions[0].required_attachment ==true ? true : false
          this.checkComment = copiedQuestions[0].required_comment == true ? true : false
          this.checkAttachment = copiedQuestions[0].required_attachment == true ? true : false
          this.topicArray.push({
            name: item.name,
            questions:copiedQuestions
          })
      },  
      deleteQuestionItem(item, question) {
        this.formDirty = true;
        item.questions.splice(item.questions.indexOf(question), 1);
      },
      addMoreTopic() {
        this.isShowInputTopic = true; 
      },
      addNewQuestion(index) {
        this.isAddNewCheckpoint = true;
        this.topicArray[index].questions.push({name: "", default_option_id: "", option_answers: "",required_comment:"",required_attachment:"",checklist_required_comment:"",checklist_required_attachment:""});
      },
      copyQuestion(index,question) {
        this.isAddNewCheckpoint = true;
        this.topicArray[index].questions.push({name: question.name, default_option_id: question.default_option_id, option_answers: question.option_answers,required_comment:question.required_comment,required_attachment:question.required_attachment,checklist_required_comment:question.checklist_required_comment,checklist_required_attachment:question.checklist_required_attachment});
        this.checkAction = question.required_comment == true || question.required_attachment ==true ? true : false
          this.checkComment = question.required_comment == true ? true : false
          this.checkAttachment = question.required_attachment == true ? true : false
      },
      cancelNewTopicName() {
        this.isShowInputTopic = false;
      },
      reloadAnswerOptionsList(){
        this.$emit('reloadAnswerOptionsList');
      },
      isSelectOption(item){
                    
          this.topicArray[this.topicArray.length-1].questions[this.currentIndex].default_option_id=item.data.id;
      }
    }
}
</script>
<style scoped>
.plus-icon-gray {
  width: 25px;
  height: 25px;
  background-color: #9f9f9f;
  margin-left: -15px;
  border-radius: 100%;
  font-size: 30px;
  line-height: 0.9;
  color: #fff;
}
.plus-icon {
  width: 25px;
  height: 25px;
  background-color: #85a33d;
  margin-left: -15px;
  border-radius: 100%;
  font-size: 30px;
  line-height: 0.9;
  color: #fff;
}

.section-connect-to.section-connect-to-checklist-topic {
    border: 1px solid #ccc;
}
.icon-img{
    width: 17px;
    height: 23px;
    margin-top: 15px;
}
.delete-icon{
  max-width: 50px;
}
.img-icon{
  max-width: 50px;
  margin-left: 14px!important;
}
:deep(.section-connect-to .section-connect-to-label-checklist .icon-checklist-topic-delete){
  margin-top:15px;
}
.input-icon{
  position: absolute;
  display: flex;
  align-items: center;
  right: 18px;
}
:deep(.btn-add-new-checklist-checkpoint){
  padding: 0 !important;
}
.check-point-accordian{
  position: relative;
  top: -33px;
}
  :deep(.v-expansion-panel--active .v-expansion-panel-header__icon){
    position: absolute;
    right: 130px;
    top: 46px;
    z-index: 999;
  }
  :deep(.v-expansion-panel-header__icon){
    position: absolute;
    right: 85px;
    top: 34px;
    z-index: 999;
  }
:deep(.v-expansion-panel-header__icon i){
  font-size: 30px;
  background: #fff;
}
:deep(.v-expansion-panel-header:before){
  left: -5px;
  font-size: 30px;
  top: -29px;
  z-index: 999;
  background: #fff;
}
:deep(.padding-15-checklist){
  padding: 55px 15px 15px 15px;
}
:deep(.v-expansion-panel--active>.v-expansion-panel-header){
  min-height: 0px;
}
:deep(.required-comment .sub-action){
  max-width: 100px !important;
  margin-left: 80px;
}
:deep(.required-comment .sub-action-2){
  max-width: 100px !important;
  margin-left: 40px;
}
</style>