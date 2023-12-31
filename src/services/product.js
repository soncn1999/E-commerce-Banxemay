import axios from "../axios";

const getAllProductApi = (page) => axios({
    url: `/product/getallproduct/?page=${page}`,
    method: 'get',
});

const getListProductRelateBrandApi = (data) => axios({
    url: `/product/getallproduct/?brand=${data}`,
    method: 'get',
});

const getListProductSortByPriceApi = (data) => axios({
    url: `/product/getallproduct/?sort=${data}`,
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

const updateProductApi = (data, id) => axios({
    url: `/product/updateproduct?id=${id}`,
    method: 'put',
    data: data
});

const deleteProductApi = (id) => axios({
    url: `/product/deleteproduct?id=${id}`,
    method: 'put',
});

const createNewBrandApi = (data) => axios({
    url: '/brand/create-brand',
    method: 'post',
    data: data
});

const getListBrandApi = () => axios({
    url: '/brand/get-list-brand',
    method: 'get',
});

const getAllCategoryApi = () => axios({
    url: '/product-category/get-list-category',
    method: 'get',
});

const createCategoryApi = (data) => axios({
    url: '/product-category/create-category',
    method: 'post',
    data: data
});

const getDetailProductCategoryApi = (data) => axios({
    url: `/product-category/get-detail-category/${data}`,
    method: 'get',
});

const handleUpdateCategoryApi = (data, id) => axios({
    url: `/product-category/update-category/${id}`,
    method: 'put',
    data
});

const handleDeleteCategoryApi = (id) => axios({
    url: `/product-category/delete-category/${id}`,
    method: 'delete',
});

const handleGetDetailBrandApi = (id) => axios({
    url: `/brand/get-detail-brand/${id}`,
    method: 'get',
});

const handleUpdateBrandApi = (data, id) => axios({
    url: `/brand/update-brand/${id}`,
    method: 'put',
    data
});

const handleDeleteBrandApi = (id) => axios({
    url: `/brand/delete-brand/${id}`,
    method: 'delete',
});

const handleGetListOrderApi = () => axios({
    url: '/order/get-list-order',
    method: 'get',
});

const updateOrderApi = (id, data) => axios({
    url: `/order/update-status-order/${id}`,
    method: 'put',
    data
});

const updateOrderPaymentApi = (id, data) => axios({
    url: `/order/update-payment-order/${id}`,
    method: 'put',
    data
})

const getDetailOrderApi = (id) => axios({
    url: `/order/get-detail-order/${id}`,
    method: 'get',
});

const getProductByCategoryApi = (category) => axios({
    url: `/product/getallproduct/?category=${category}`,
    method: 'get',
});

const getAllProductForSearchApi = () => axios({
    url: `/product/getallproductforsearch`,
    method: 'get',
});

const getProductBestSeller = (operator) => axios({
    url: `/product/getallproduct/?sort=${operator}sold`,
    method: 'get',
});

export {
    getAllProductApi, getDetailProductApi, createNewProductApi, uploadImageProductApi, updateProductApi,
    deleteProductApi, createNewBrandApi, getAllCategoryApi, createCategoryApi, getListBrandApi,
    getDetailProductCategoryApi, handleUpdateCategoryApi, handleGetDetailBrandApi, handleUpdateBrandApi,
    handleDeleteBrandApi, getListProductRelateBrandApi, getListProductSortByPriceApi, handleDeleteCategoryApi,
    handleGetListOrderApi, updateOrderApi, getDetailOrderApi, getProductByCategoryApi, updateOrderPaymentApi,
    getAllProductForSearchApi, getProductBestSeller
};