import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5199',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
})

export default axiosInstance
