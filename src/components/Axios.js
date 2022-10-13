import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://tengerapi.com/api/',
    // baseURL: 'http://192.168.1.108:8000/api/',
});
//coocke ilgeegden
//instance.defaults.withCredentials = true;
export default instance;