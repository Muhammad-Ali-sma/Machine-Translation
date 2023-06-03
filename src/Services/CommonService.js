import { API } from '../utils/config'
import RestClient from '../utils/RestClient'

const LoginUser = (name, pass) => {
  const data = {
    userName: name,
    password: pass,
  }
  return RestClient.Post(API + '/user', data, false, {})
}

const getSoruceLang = () => {
  return RestClient.PostAuth(API + '/static/sourceLanguages', {}, false)
}

const getTargetLang = () => {
  return RestClient.PostAuth(API + '/static/targetLanguages', {}, false)
}

const getTaskStatus = () => {
  return RestClient.PostAuth(API + '/static/taskStatus', {}, false)
}

const translateCustomTerm = (sourceLanguageCode, sourceLanguageContent, targetLanguageCode) => {
  const data = {
    sourceLanguageCode: sourceLanguageCode,
    sourceLanguageContent: sourceLanguageContent,
    targetLanguageCode: targetLanguageCode,
    taskType: 'text'
  }
  return RestClient.PostAuth(API + '/customterm/translateCustomTerminology', data)
}

const uploadCustomTerm = (customTermId, targetLanguageContent) => {
  const data = {
    customTermId: customTermId,
    targetLanguageText: targetLanguageContent,
    taskType: 'text'
  }
  return RestClient.PostAuth(API + '/customterm/transmitCustomTerminology', data)
}

const setHistory = (taskId) => {
  return RestClient.PostAuth(API + `/task/history/${taskId}`)
}

const getHistory = (filterData, pageSize, pageIndex) => {
  const data = {
    ...filterData,
    paginationRequest: {
      itemsPerPage: pageSize,
      pageNo: pageIndex
    }
  }
  return RestClient.PostAuth(API + `/task/history`, data, true)
}

const setTask = (pageSize, pageIndex) => {
  const data = {
    itemsPerPage: pageSize,
    pageNo: pageIndex,
  }
  return RestClient.PostAuth(API + `/task/tasks`, data, true)
}

const getTranslation = (sourceLanguageCode, sourceLanguageContent, targetLanguageCode, taskId) => {
  const data = {
    taskId: taskId,
    sourceLanguageCode: sourceLanguageCode,
    sourceLanguageContent: sourceLanguageContent,
    targetLanguageCode: targetLanguageCode
  }
  return RestClient.PostAuth(API + '/translation/translateText', data)
}

const postSendText4Review = (taskId, targetLanguageCode, targetLanguageContent) => {
  const data = {
    taskId: taskId,
    targetLanguageCode: targetLanguageCode,
    targetLanguageContent: targetLanguageContent
  }
  return RestClient.PostAuth(API + '/translation/sendText4review', data)
}

const postSendDoc4Review = (taskId, type) => {
  const data = {
    taskId: taskId,
    taskType: type
  }
  return RestClient.PostAuth(API + '/translation/sendDoc4review', data)
}

const approveTask = (taskId) => {
  const data = {
    taskId: taskId
  }
  return RestClient.PostAuth(API + '/review/approve', data)
}

const rejectTask = (taskId) => {
  const data = {
    taskId: taskId
  }
  return RestClient.PostAuth(API + '/review/reject', data)
}

const deleteTask = (taskId) => {
  const data = {
    taskId: taskId
  }
  return RestClient.PostAuth(API + '/task/deleteTask/'+taskId, data)
}

const closeTask = (taskId) => {
  const data = {
    taskId: taskId
  }
  return RestClient.PostAuth(API + '/review/close', data)
}

const retrieveCustomTerms = (filterData, pageSize, pageIndex) => {
  const data = {
    ...filterData,
    paginationRequest: {
      itemsPerPage: pageSize,
      pageNo: pageIndex
    }
  }
  return RestClient.PostAuth(API + '/customterm/retrieveCustomTerminologies', data)
}

const translateDoc = (file, type, sourceCode, targetCode, taskId, onUploadProgress) => {
  let formData = new FormData()
  formData.append('file', file)
  formData.append('sourceLanguageCode', sourceCode)
  formData.append('targetLanguageCode', targetCode)
  formData.append('taskType', type)
  if (taskId) {
    formData.append('taskId', taskId)
  }

  return RestClient.PostAuth(API + '/translation/translateDoc', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
    },
    onUploadProgress,
  })
}

const uploadDoc = (file, taskId, onUploadProgress) => {
  let formData = new FormData()
  formData.append('file', file)
  formData.append('taskId', taskId)

  return RestClient.PostAuth(API + '/translation/uploadDoc', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
    },
    onUploadProgress
  })
}

const uploadCustomDoc = (file, onUploadProgress) => {
  let formData = new FormData()
  formData.append('file', file)

  return RestClient.PostAuth(API + '/customterm/uploadCustomTerminology', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`,
    },
    onUploadProgress
  })
}


const getReworkData = (taskId) => {
  return RestClient.PostAuth(API + '/task/history/' + taskId, {})
}

const downloadDoc = (fileName) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${localStorage.getItem('ACCESS_TOKEN')}`);
  var requestOptions = {
    headers: myHeaders,
    method: 'POST'
  };

  return fetch(`${API}/translation/downloadDoc/${fileName}`, requestOptions).then(resp => resp.blob()).then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    // the filename you want
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }).catch(() => alert('Download Failed!'));

}

export { closeTask, deleteTask, rejectTask, approveTask, getReworkData, LoginUser, getSoruceLang, getTargetLang, getTaskStatus, translateCustomTerm, uploadCustomTerm, uploadCustomDoc, setHistory, getHistory, setTask, getTranslation, postSendText4Review, postSendDoc4Review, retrieveCustomTerms, translateDoc, uploadDoc, downloadDoc }
