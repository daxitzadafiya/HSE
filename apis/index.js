import axios from 'axios';

export default {
  auth: {
    me: () => axios.get('users/me'),
    login: (data) => axios.post('auth/login', data),
    forgotPassword: (data) => axios.post('auth/forgot', data),
    resetPassword: (data) => axios.post('auth/reset', data),
    logout: (data) => axios.post("auth/logout", data),
    signup: (data) => axios.post("auth", data),
  },
  companies:{
    index:(query) => axios.get('companies', {params: query}),
    store:(data) => axios.post('companies', data),
    show:(id) => axios.get('companies/' + id),
    update:(data, id) => axios.put('companies/' + id, data),
    delete:(id) => axios.delete('companies/' + id),
    changeStatus:(id) => axios.post(`companies/${id}/change_status`),
  },
  roles:{
    index:(query) => axios.get('roles', {params: query}),
    store:(data) => axios.post('roles', data),
    show:(id) => axios.get('roles/' + id),
    update:(data, id) => axios.put('roles/' + id, data),
    delete:(id) => axios.delete('roles/' + id),

    all:(query) => axios.get('role/all', {params: query}),

    applyNewUpdate:(request_push_notification_id) => axios.put('new-update/apply/role/' + request_push_notification_id),
  },
  users:{
    index:(query) => axios.get('users', {params: query}),
    store:(data) => axios.post('users', data),
    show:(id) => axios.get('users/' + id),
    update:(data, id) => axios.put('users/' + id, data),
    delete:(id) => axios.delete('users/' + id),
    getEmployees:(params) => axios.get(`users/employees`,{params: params}),
    getManagers:(params) => axios.get(`users/managers?dep_ids`,{params: params}),
  },
  absences:{
    index:() => axios.get('absences'),
    store:(data) => axios.post('absences', data),
    show:(id) => axios.get('absences/' + id),
    update:(data, id) => axios.put('absences/' + id, data),
    delete:(id) => axios.delete('absences/' + id),

    indexDocument:(query) => axios.get('absences/documents', {params: query}),
    storeDocument:(data) => axios.post('absences/documents', data),
    showDocument:(id) => axios.get('absences/documents/' + id),
    updateDocument:(data, id) => axios.put('absences/documents/' + id, data),
    deleteDocument:(id) => axios.delete('absences/documents/' + id),
  },
  absenceReasons:{
    index:() => axios.get('absenceReasons'),
    store:(data) => axios.post('absenceReasons', data),
    show:(id) => axios.get('absenceReasons/' + id),
    update:(data, id) => axios.put('absenceReasons/' + id, data),
    delete:(id) => axios.delete('absenceReasons/' + id),
  },
  appraisals:{
    index:() => axios.get('appraisals'),
    store:(data) => axios.post('appraisals', data),
    show:(id) => axios.get('appraisals/' + id),
    update:(data, id) => axios.put('appraisals/' + id, data),
    delete:(id) => axios.get('appraisals/' + id),
  },
  categories:{
    index:(query) => axios.get('categories', {params: query}),
    store:(data) => axios.post('categories', data),
    show:(id) => axios.get('categories/' + id),
    update:(data, id) => axios.put('categories/' + id, data),
    delete:(id) => axios.delete('categories/' + id),
  },
  categoriesV2:{
    index:(query) => axios.get('categoriesV2', {params: query}),
    store:(data) => axios.post('categoriesV2', data),
    show:(id) => axios.get('categoriesV2/' + id),
    update:(data, id) => axios.put('categoriesV2/' + id, data),
    delete:(id) => axios.delete('categoriesV2/' + id),
  },
  places:{
    index:(query) => axios.get('places', {params: query}),
    store:(data) => axios.post('add_place', data),
    show:(id) => axios.get('places/' + id)
  },
  consequences:{
    index:(query) => axios.get('consequences', {params: query}),
    store:(data) => axios.post('add_consequence', data),
    show:(id) => axios.get('consequences/' + id)
  },
  contacts:{
    index:(query) => axios.get('contacts', {params: query}),
    store:(data) => axios.post('contacts', data),
    show:(id) => axios.get('contacts/' + id),
    update:(data, id) => axios.put('contacts/' + id, data),
    delete:(id) => axios.delete('contacts/' + id),

    indexPerson:(query) => axios.get('contacts/persons', {params: query}),
    storePerson:(data) => axios.post('contacts/persons', data),
    showPerson:(id) => axios.get('contacts/persons/' + id),
    updatePerson:(data, id) => axios.put('contacts/persons/' + id, data),
    deletePerson:(id) => axios.delete('contacts/persons/' + id),
  },
  deviations:{
    index:(query) => axios.get('deviations', {params: query}),
    filter:(query) => axios.get('deviations/filter', {params: query}),
    store:(data) => axios.post('deviations', data),
    show:(id) => axios.get('deviations/' + id),
    update:(data, id) => axios.put('deviations/' + id, data),
    delete:(id) => axios.delete('deviations/' + id),
  },
  goalsOld:{ // OLD goal
    index:(query) => axios.get('goalsOld', {params: query}),
    store:(data) => axios.post('goalsOld', data),
    show:(id) => axios.get('goalsOld/' + id),
    update:(data, id) => axios.put('goalsOld/' + id, data),
    delete:(id) => axios.delete('goalsOld/' + id),
  },
  goals:{
    index:(query) => axios.get('goals', {params: query}),
    store:(data) => axios.post('goals', data),
    show:(id) => axios.get('goals/' + id),
    update:(data, id) => axios.put('goals/' + id, data),
    delete:(id) => axios.delete('goals/' + id),
  },
  instructionsOld:{ // OLD instruction
    index:(query) => axios.get('instructionsOld', {params: query}),
    store:(data) => axios.post('instructionsOld', data),
    show:(id) => axios.get('instructionsOld/' + id),
    update:(data, id) => axios.put('instructionsOld/' + id, data),
    delete:(id) => axios.delete('instructionsOld/' + id),
  },
  instructions:{
    index:(query) => axios.get('instructions', {params: query}),
    store:(data) => axios.post('instructions', data),
    show:(id) => axios.get('instructions/' + id),
    update:(data, id) => axios.put('instructions/' + id, data),
    delete:(id) => axios.delete('instructions/' + id),
  },
  routines:{
    index:(query) => axios.get('routines', {params: query}),
    store:(data) => axios.post('routines', data),
    show:(id) => axios.get('routines/' + id),
    update:(data, id) => axios.put('routines/' + id, data),
    delete:(id) => axios.delete('routines/' + id),
  },
  departments:{
    index:(query) => axios.get('departments', {params: query}),
    store:(data) => axios.post('departments', data),
    show:(id) => axios.get('departments/' + id),
    update:(data, id) => axios.put('departments/' + id, data),
    delete:(id) => axios.delete('departments/' + id),
    list:(data) => axios.post('departments/list', data),
  },
  documentsOld:{ // old document before split database
    index:(query) => axios.get('documents', {params: query}),
    store:(data) => axios.post('documents', data),
    show:(id) => axios.get('documents/' + id),
    update:(data, id) => axios.put('documents/' + id, data),
    delete:(id) => axios.delete('documents/' + id),
    fileShow:(filename) => axios.get('uploads/documents/' + filename),
  },
  documents:{
    index:(query) => axios.get('documentsNew', {params: query}),
    store:(data) => axios.post('documentsNew', data),
    show:(id) => axios.get('documentsNew/' + id),
    update:(data, id) => axios.put('documentsNew/' + id, data),
    delete:(id) => axios.delete('documentsNew/' + id),
    fileShow:(filename) => axios.get('uploads/documents/' + filename),
    connect:(id) => axios.get('connectTo/document/' + id),
    connectRoutine:(id) => axios.get('connectTo/routine/' + id),
    attachment: (query) => axios.get('documentsNew/attachments', {params: query}),
  },
  employees:{
    index:(query) => axios.get('employees', {params: query}),
    store:(data) => axios.post('employees', data),
    show:(id) => axios.get('employees/' + id),
    update:(data, id) => axios.put('employees/' + id, data),
    delete:(id) => axios.delete('employees/' + id),

    indexRelation:(query) => axios.get('employees/relations', {params: query}),
    storeRelation:(data) => axios.post('employees/relations', data),
    showRelation:(id) => axios.get('employees/relations/' + id),
    updateRelation:(data, id) => axios.put('employees/relations/' + id, data),
    deleteRelation:(id) => axios.delete('employees/relations/' + id),

    indexRole:(query) => axios.get('employees/roles', {params: query}),

    indexAbsenceProcessor:(id) => axios.get('employees/absence/processor/' + id),

    import:(data) => axios.post('employees/import', data),
  },
  tasks:{
    index:(query) => axios.get('tasks', {params: query}),
    store:(data) => axios.post('tasks', data),
    show:(id) => axios.get('tasks/' + id),
    update:(data, id) => axios.put('tasks/' + id, data),
    progressTask:(data, id) => axios.put('tasks/progress/' + id, data),
    delete:(id) => axios.delete('tasks/' + id),

    // showGoalLimit:(id) => axios.get('tasks/user/goals/' + id),
    // showGoal:(id) => axios.get('tasks/goals/' + id),
    // updateGoal:(data, id) => axios.put('tasks/goals/' + id, data),
    showDeviationLimit:(id) => axios.get('tasks/user/deviations/' + id),
    showDeviation:(id) => axios.get('tasks/deviations/' + id),
    updateDeviation:(data, id) => axios.put('tasks/deviations/' + id, data),
    showRiskAnalysisLimit:(id) => axios.get('tasks/user/riskAnalysis/' + id),
    showRiskAnalysis:(id) => axios.get('tasks/riskAnalysis/' + id),
    updateRiskAnalysis:(data, id) => axios.put('tasks/riskAnalysis/' + id, data),
    showReport:(id) => axios.get('tasks/reports/' + id),
    showAttachmentLimit:(id) => axios.get('tasks/user/attachments/' + id),
    showAttachment:(id) => axios.get('tasks/attachments/' + id),
    updateAttachment:(data, id) => axios.put('tasks/attachments/' + id, data),
    showUserTaskLimit:(id) => axios.get('tasks/user/userTasks/' + id),
    showUserTask:(id) => axios.get('tasks/userTasks/' + id),
    updateUserTask:(data, id) => axios.put('tasks/userTasks/' + id, data),

    // Task REPORT
    showReportTaskLimit:(id) => axios.get('tasks/report/reportTasks/' + id),
    showReportTask:(id) => axios.get('tasks/reportTasks/' + id),
    updateReportTask:(data, id) => axios.put('tasks/reportTasks/' + id, data),

    indexAdmin:(query) => axios.get('tasks/admin', {params: query}),
  },
  contactPersons:{
    index:(query) => axios.get('contactPersons', {params: query}),
    store:(data) => axios.post('contactPersons', data),
    show:(id) => axios.get('contactPersons/' + id),
    update:(data, id) => axios.put('contactPersons/' + id, data),
    delete:(id) => axios.delete('contactPersons/' + id),
  },
  employeeRelations:{
    index:(query) => axios.get('employeeRelations', {params: query}),
    store:(data) => axios.post('employeeRelations', data),
    show:(id) => axios.get('employeeRelations/' + id),
    update:(data, id) => axios.put('employeeRelations/' + id, data),
    delete:(id) => axios.delete('employeeRelations/' + id),
  },
  checklists:{
    index:(query) => axios.get('checklists', {params: query}),
    store:(data) => axios.post('checklists', data),
    show:(id) => axios.get('checklists/' + id),
    update:(data, id) => axios.put('checklists/' + id, data),
    delete:(id) => axios.delete('checklists/' + id),
  },
  topics:{
    index:(query) => axios.get('topics', {params: query}),
    store:(data) => axios.post('topics', data),
    show:(id) => axios.get('topics/' + id),
    update:(data, id) => axios.put('topics/' + id, data),
    delete:(id) => axios.delete('topics/' + id),
  },
  questions:{
    index:(query) => axios.get('questions', {params: query}),
    store:(data) => axios.post('questions', data),
    show:(id) => axios.get('questions/' + id),
    update:(data, id) => axios.put('questions/' + id, data),
    delete:(id) => axios.delete('questions/' + id),
  },
  reports:{
    index:(query) => axios.get('reports', {params: query}),
    store:(data) => axios.post('reports', data),
    show:(id) => axios.get('reports/' + id),
    update:(data, id) => axios.put('reports/' + id, data),
    delete:(id) => axios.delete('reports/' + id),
    storeTask:(data) => axios.post('reports/tasks', data),
    uploadMultiple:(data) => axios.post('reports/documentsMultiple', data),
    filter:(query) => axios.get('reports/filter', {params: query}),
  },
  industries:{
    index:() => axios.get('industries'),
    store:(data) => axios.post('industries', data),
    show:(id) => axios.get('industries/' + id),
    update:(data, id) => axios.put('industries/' + id, data),
    delete:(id) => axios.delete('industries/' + id),
  },
  permissions:{
    show:(id) => axios.get('permissions/' + id),
    update:(data, id) => axios.put('permissions/' + id, data),
  },
  riskAnalysis:{
    index:(query) => axios.get('riskAnalysis', {params: query}),
    filter:(query) => axios.get('riskAnalysis/filter', {params: query}),
    store:(data) => axios.post('riskAnalysis', data),
    show:(id) => axios.get('riskAnalysis/' + id),
    update:(data, id) => axios.put('riskAnalysis/' + id, data),
    delete:(id) => axios.delete('riskAnalysis/' + id),
  },
  riskElementSource:{
    index:(query) => axios.get('riskElementSource', {params: query}),
    store:(data) => axios.post('riskElementSource', data),
    show:(id) => axios.get('riskElementSource/' + id),
    update:(data, id) => axios.put('riskElementSource/' + id, data),
    delete:(id) => axios.delete('riskElementSource/' + id),
  },
  titleCaption:{
    index:(query) => axios.get('titleCaption', {params: query}),
    store:(data) => axios.post('titleCaption', data),
    show:(id) => axios.get('titleCaption/' + id),
    showByKey:(key) => axios.get('titleCaption/key/' + key),
    update:(data, id) => axios.put('titleCaption/' + id, data),
    delete:(id) => axios.delete('titleCaption/' + id),
  },
  requestPushNotification:{
    index:(query) => axios.get('requestPushNotification', {params: query}),
    store:(data) => axios.post('requestPushNotification', data),
    show:(id) => axios.get('requestPushNotification/' + id),
    update:(data, id) => axios.put('requestPushNotification/' + id, data),
    delete:(id) => axios.delete('requestPushNotification/' + id),

    declineNewUpdate:(id) => axios.put('new-update/decline/' + id),
  },
  notifications:{
    countUnRead:(query) => axios.get('notifications/countUnRead', {params: query}),
    index:(query) => axios.get('notifications', {params: query}),
    store:(data) => axios.post('notifications', data),
    show:(id) => axios.get('notifications/' + id),
    update:(data, id) => axios.put('notifications/' + id, data),
    delete:(id) => axios.delete('notifications/' + id),
  },
  statements:{
    index:(query) => axios.get('statements', {params: query}),
    store:(data) => axios.post('statements', data),
    show:(id) => axios.get('statements/' + id),
    update:(data, id) => axios.put('statements/' + id, data),
    delete:(id) => axios.delete('statements/' + id),
  },
  attachments:{
    showImage:(filename) => axios.get('image/' + filename),
    store:(data) => axios.post('attachments', data), // required attachment
  },
  options:{
    index:(query) => axios.get('options', {params: query}),
    store:(data) => axios.post('options', data),
    update:(data, id) => axios.put('options/' + id, data),
    show:(id) => axios.get('options/' + id),
  },
  userTasks:{
    index:() => axios.get('userTasks'),
    store:(data) => axios.post('userTasks', data),
    show:(id) => axios.get('userTasks/' + id),
    update:(data, id) => axios.put('userTasks/' + id, data),
    delete:(id) => axios.delete('userTasks/' + id),
  },
  optionAnswers:{
    index:(query) => axios.get('optionAnswers', {params: query}),
  },
  permissionsFormat:{
    index:(query) => axios.get('permissionsFormat', {params: query}),
  },
  jobTitles:{
    index:(query) => axios.get('jobTitles', {params: query}),
    store:(data) => axios.post('jobTitles', data),
    show:(id) => axios.get('jobTitles/' + id),
    update:(data, id) => axios.put('jobTitles/' + id, data),
    delete:(id) => axios.delete('jobTitles/' + id),
    list:(data) => axios.post('jobTitles/list', data),
  },
  userPermissions:{
    show:(id) => axios.get('userPermissions/' + id),
    update:(data, id) => axios.put('userPermissions/' + id, data),
  },
  unwantedEvents: {
    index: () => axios.get('unwantedEvents'),
    store: (data) => axios.post('unwantedEvents', data),
    show: (id) => axios.get('unwantedEvents/' + id),
    update: (data, id) => axios.put('unwantedEvents/' + id, data),
    delete: (id) => axios.delete('unwantedEvents/' + id),
  },
  repositories: {
    index:(query) => axios.get('repositories', {params: query}),
    store: (data) => axios.post('repositories', data),
    show: (id) => axios.get('repositories/' + id),
    update: (data, id) => axios.put('repositories/' + id, data),
    delete: (id) => axios.delete('repositories/' + id),
  },
  intervalSetting: {
    index:(query) => axios.get('intervalSetting', {params: query}),
    store: (data) => axios.post('intervalSetting', data),
    show: (id) => axios.get('intervalSetting/' + id),
    update: (data, id) => axios.put('intervalSetting/' + id, data),
    delete: (id) => axios.delete('intervalSetting/' + id),
  },
  taskAssignees: {
    index:(query) => axios.get('taskAssignees', {params: query}),
    store: (data) => axios.post('taskAssignees', data),
    show: (id) => axios.get('taskAssignees/' + id),
    update: (data, id) => axios.put('taskAssignees/' + id, data),
    delete: (id) => axios.delete('taskAssignees/' + id),
  },
  verificationCode: {
    show: (code) => axios.get('verificationCode/' + code),
  },
  help: {
    index:(query) => axios.get('help', {params: query}),
    store: (data) => axios.post('help', data),
    show: (id) => axios.get('help/' + id),
    update: (data, id) => axios.put('help/' + id, data),
    delete: (id) => axios.delete('help/' + id),
  },
  helpQuestion: {
    index:(query) => axios.get('helpQuestion', {params: query}),
    store: (data) => axios.post('helpQuestion', data),
    show: (id) => axios.get('helpQuestion/' + id),
    update: (data, id) => axios.put('helpQuestion/' + id, data),
    delete: (id) => axios.delete('helpQuestion/' + id),
  },
  billings: {
    index:(query) => axios.get('billings', {params: query}),
    store: (data) => axios.post('billings', data),
    show: (id) => axios.get('billings/' + id),
    update: (data, id) => axios.put('billings/' + id, data),
    delete: (id) => axios.delete('billings/' + id),
    status: (id) => axios.post('billings/status/' + id),
    sendEmail: (id) => axios.get('billings/sendEmail/' + id),
    history: (query) => axios.get('invoice_histories', {params: query}),
    showHistory: (id) => axios.get(`invoice_histories/${id}`),
    pdf: (data) => axios.post('/billings/pdf', data),
  },
  connectToObject: {
    getByObject:(query) => axios.get('connectTo', {params: query}),
    getObjects:(query) => axios.get('connectTo/getObjects', {params: query}),

    show: (type, id) => axios.get('connectTo/' + type + '/' + id),
    store: (type, id, data) => axios.post('connectTo/' + type + '/' + id, data),
    update: (type, id, data) => axios.put('connectTo/' + type + '/' + id, data),
    delete: (id) => axios.delete('connectTo/' + id),
    objectByFunction: (functionName) => axios.get('connectTo/getByFunction/' + functionName),
    getAllObject: (type) => axios.get('connectTo/getObjects', type),
  },
  objects: {
    index:(query) => axios.get('objects', {params: query}),
    store: (data) => axios.post('objects', data),
    show: (id) => axios.get('objects/' + id),
    update: (data, id) => axios.put('objects/' + id, data),
    delete: (id) => axios.delete('objects/' + id),

    updateStatus: (data, id) => axios.put('objects/processing/' + id, data),

    attendeeStatus: (data) =>  axios.post(`objects/update_attendee/`+data.id , data.data),
    getAttendeeData: (id) =>  axios.get(`objects/getAttendee/`+ id ),
    getSingleAttendee: (id1, id2) =>  axios.get(`objects/getProcessingInfo/${id1}/${id2}`),
    responsibleStatus: (data) =>  axios.post(`objects/update_responsible/`+data.id , data.data),
    actionStore: (data) =>  axios.post(`objects/objectsAttendee/processing`, data),
    managerAction: (data) =>  axios.post(`objects/objectsResponsible/processing`, data),
    extend_timeline: (data) => axios.post('objects/extend_timeline', data),
    extend_action: (data) => axios.post('/objects/update_extended_timeline', data),
    getResponsibleData: (id) =>  axios.get(`objects/getResponsible/`+ id )
  },

  plans:{
    index:(query) => axios.get('plans', {params: query}),
    store: (data) => axios.post('plans/store', data),
    show: (id) => axios.get(`plans/${id}`),
    update: (data, id) => axios.put('plans/' + id, data),
    destroy: (id) => axios.delete('plans/' + id),
  },

  addons:{
    index:(query) => axios.get('addons', {params: query}),
    store: (data) => axios.post('addons/store', data),
    show: (id) => axios.get(`addons/${id}`),
    update: (data, id) => axios.put('addons/' + id, data),
    destroy: (id) => axios.delete('addons/' + id),
  },

  subscriptions:{
    stripeCard: (data) => axios.post('stripeCard', data),
    creditCheck: (data) => axios.get('creditCheck', data),
    planPurchase: (data) => axios.post('plan/purchase', data),
    planPurchaseCompleted: (data) => axios.post('plan/purchase_completed', data),
    planActive: (data) => axios.get('plan/active', data),
    planCancel: (data) => axios.post('plan/cancel', data),
    addonPurchase: (data) => axios.post('addon/purchase', data),
    addonCancel: (data) => axios.post('addon/cancel', data),
    immediatelyDeactive: (data) => axios.post('immediatelyDeactive', data),
  },

  coupon:{
    index:(query) => axios.get('coupons', {params: query}),
    store: (data) => axios.post('coupons/store', data),
    show: (id) => axios.get(`coupons/${id}`),
    update: (data, id) => axios.put('coupons/' + id, data),
    destroy: (id) => axios.delete('coupons/' + id),
    check: (data) => axios.post('coupon-checking' , data)
  },

  setting:{
    index:(query) => axios.get('settings', {params: query}),
    update: (data) => axios.put('settings' , data),
    checkDisabled: (data) => axios.get('check-disable-setting' , data),
  },

  emailContents:{
    index:(query) => axios.get('email_contents', {params: query}),
    update: (data, id) => axios.put('email_contents/' + id, data),
  },

  invites:{
    index:(query) => axios.get('invites', {params: query}),
    store:(data) => axios.post('invites', data),
    show:(id) => axios.get('invites/' + id),
    update:(data, id) => axios.put('invites/' + id, data),
    delete:(id) => axios.delete('invites/' + id),
    resendInvitation: (id) => axios.get('invites/resendInvitation/' + id),
    import:(data) => axios.post('invite/import', data),
  },

  cards:{
    index:(query) => axios.get('cards', {params: query}),
    store: (data) => axios.post('cards/store', data),
    destroy: (id) => axios.delete('cards/' + id),
    active: (data) => axios.post('cards/active', data),
  },

  customerServices:{
    index:(query) => axios.get('customerService', {params: query}),
    store:(data) => axios.post('customerService', data),
    show:(id) => axios.get('customerService/' + id),
    update:(data, id) => axios.put('customerService/' + id, data),
    delete:(id) => axios.delete('customerService/' + id),
    permissions:(query) => axios.get('cs/permissions', {params: query}),
    updatePermission: (data) => axios.put('cs/permissions' , data),
    getPermissions:(query) => axios.get('get_permissions', {params: query}),
  },

  emailLogs:{
    index:(query) => axios.get('email_logs', {params: query}),
    show:(id) => axios.get('email_logs/' + id),
  }
};
