import moment from 'moment';


export const removeTagsFromString= (string)=>{
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = string;
    var firstChild = tempDiv.firstChild;
    var textContent = firstChild ? firstChild.textContent : '';
    return textContent ? textContent : null;
}

export const formatDateString = (dateString, format) => {
    if (dateString === 'Invalid date') {
      return '';
    }
    let moment_result = moment(dateString).format(format ? format : 'YYYY-MM-DD')
    return moment_result== 'Invalid date' ? '' : moment(dateString).format(format ? format : 'YYYY-MM-DD');
  };
  
  // Common function to format time or return an empty string if it's invalid
  export const formatTimeString = (timeString, format) => {
    if (timeString === 'Invalid date' || timeString == '' || timeString == null) {
      return '';
    }
    // return moment(timeString.toLocaleString('en-US', { timeZone: (localStorage.getItem("time_zone") || "Europe/Oslo") }), "HH:mm").format(format ? format : 'HH:mm')
    let moment_result = typeof(timeString)!="string" ? moment(timeString.toISOString()).format(format ? format : 'HH:mm') : moment(timeString.toLocaleString('en-US', { timeZone: (localStorage.getItem("time_zone") || "Europe/Oslo") }), "HH:mm").format(format ? format : 'HH:mm')
    return moment_result=='Invalid date' ? '' : moment_result;
  };

export const getDateBasedOnFrequency = (startDate,frequency)=>{
  let deadlineDate;
    if(frequency == "Monthly"){
        deadlineDate=moment(startDate).add(1, 'M').format('YYYY-MM-DD');
    }
    else if(frequency == "Yearly"){
        deadlineDate=moment(startDate).add(1, 'Y').format('YYYY-MM-DD');
    }
    else if(frequency == "Weekly"){
        deadlineDate=moment(startDate).add(7, 'days').format('YYYY-MM-DD');
    }
    else if(frequency == "Daily"){
        deadlineDate=moment(startDate).add(1, 'days').format('YYYY-MM-DD');
    }
    else if(frequency == "Quarter"){
        deadlineDate=moment(startDate).add(3, 'M').format('YYYY-MM-DD');
    }
    else if(frequency == "Bi-Weekly"){
      deadlineDate=moment(startDate).add(14, 'days').format('YYYY-MM-DD');
    }
    else if(frequency == "Half-Yearly"){
      deadlineDate=moment(startDate).add(6, 'M').format('YYYY-MM-DD');
    }
    return deadlineDate;
}

