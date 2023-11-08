import axios from "../axios";

const getAllCategories = () => axios({
    url: '/user/getallusers',
    method: 'get',
});

export {
    getAllCategories
};