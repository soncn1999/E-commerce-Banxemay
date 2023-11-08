import axios from "../axios";

const getAllProductApi = (page) => axios({
    url: `/product/getallproduct/?page=${page}`,
    method: 'get',
});

const getDetailProductApi = (pid) => axios({
    url: `/product/getproduct?id=${pid}`,
    method: 'get'
});

const createNewProductApi = (data) => axios({
    url: '/product/createnewproduct',
    method: 'post',
    data: data
});

const uploadImageProductApi = (data) => axios({
    url: `/product/upload-image-product/${data.pid}`,
    method: 'put',
    data: data.files,
    config: {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    }
});

export {
    getAllProductApi, getDetailProductApi, createNewProductApi, uploadImageProductApi
};