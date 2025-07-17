import axios from "axios";

export const myAxios = axios.create({
    baseURL: 'https://dgpjdzqtmk.execute-api.us-east-1.amazonaws.com/test',
})