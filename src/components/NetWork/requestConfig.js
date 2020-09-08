import axios from "axios";
axios.defaults.withCredentials = true;
function requestConfig(path) {
  let instance = axios.create({
    baseURL: " http://192.168.137.136:3006", 
    timeout: 10000,
  });
  return instance({
    url: path,
  });
}
function PageConfig(path, parmas) {
  let instance = axios.create({
    baseURL: " http://192.168.137.136:3006", 
    timeout: 10000,
  });
  return instance({
    url: path,
    params: parmas,
  });
}
function PublishMessage(path, data) {
  let instance = axios.create({
    baseURL: " http://192.168.137.136:3006",
  });
  return instance({
    url: path,
    method: "post",
    data: data,
  });
}
export { requestConfig, PublishMessage, PageConfig };
