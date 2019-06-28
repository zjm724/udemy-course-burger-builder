import axios from 'axios';

const Instance = axios.create({
    baseURL: 'https://react-my-burger-1a064.firebaseio.com/',
});

export default Instance;