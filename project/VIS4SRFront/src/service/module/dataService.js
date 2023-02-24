import axios from 'axios'

const TEST_URL_PREFIX = '/api/SR';

export function loadSRModels(param, callback) {
  const url=`${TEST_URL_PREFIX}/loadSRModels/`;
  axios.post(url, param)
    .then(response =>{
      callback(response.data)
    }, errResponse => {
      console.log(errResponse)
    })
}

export function loadSRMetrics(param, callback) {
  const url=`${TEST_URL_PREFIX}/loadSRMetrics/`;
  axios.post(url, param)
    .then(response =>{
      callback(response.data)
    }, errResponse => {
      console.log(errResponse)
    })
}

export function loadMertricNames(param, callback) {
  const url=`${TEST_URL_PREFIX}/loadMetricNames/`;
  axios.post(url, param)
    .then(response =>{
      callback(response.data)
    }, errResponse => {
      console.log(errResponse)
    })
}

export function loadSRDatasetIds(param, callback) {
  const url=`${TEST_URL_PREFIX}/loadDatasetIds/`;
  axios.post(url, param)
    .then(response =>{
      callback(response.data)
    }, errResponse => {
      console.log(errResponse)
    })
}

//
// export function loadImage(param, callback) {
//   const url=`${TEST_URL_PREFIX}/loadImageWithId/`;
//   axios.post(url, param)
//     .then(response =>{
//       callback(response.data)
//     }, errResponse => {
//       console.log(errResponse)
//     })
// }
