import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Header, Footer } from '../../pages/private';
import { createNewProductApi, uploadImageProductApi, getListBrandApi, getAllCategoryApi } from '../../services/product';
import Swal from 'sweetalert2';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

AddNewProduct.propTypes = {

};

function AddNewProduct(props) {
    useEffect(() => {
        handleGetListBrand();
        getListCategory();
    }, [])

    const [product, setProduct] = useState({
        title: "",
        description: "",
        brand: "",
        price: 0,
        previewImgUrl: "",
        files: "",
        quantity: 0,
        category: "",
    });

    const [brand, setBrand] = useState([]);

    const [listCategory, setListCategory] = useState([]);

    const handleGetListBrand = async () => {
        let response = await getListBrandApi();
        if (response && response.success) {
            const { data, success } = response;
            setBrand(data);
        }
    }

    const getListCategory = async () => {
        let response = await getAllCategoryApi();
        if (response && response.success) {
            const { productCategories } = response;
            setListCategory(productCategories);
        }
    }

    const handleSubmitForm = async () => {
        console.log('Product >>> ', product);
        let { previewImgUrl, files, ...dataCopy } = product;

        const response = await createNewProductApi(dataCopy);
        if (response && response.success) {
            let responseImage = await uploadImageProductApi({
                pid: response.data._id,
                files: files,
            });
            if (responseImage && responseImage.success) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Sản phẩm đã được thêm mới!",
                    showConfirmButton: false,
                    timer: 1500
                });
                setProduct({
                    title: "",
                    description: "",
                    brand: "",
                    price: 0,
                    previewImgUrl: "",
                    files: "",
                    category: "",

                });
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: "Ảnh chưa được tải lên!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            setProduct({
                title: "",
                description: "",
                brand: "",
                price: 0,
                previewImgUrl: "",
                files: "",
                quantity: 0,
                category: "",

            });
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Sản phẩm chưa được thêm mới!",
                showConfirmButton: false,
                timer: 1500
            });
        }
    }

    const handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];

        if (file) {
            let productCopy = { ...product };
            const objectUrl = URL.createObjectURL(file);

            let formData = new FormData();
            formData.append('images', file);

            productCopy.previewImgUrl = objectUrl;
            productCopy.files = formData;
            setProduct(productCopy);
        }
    }

    // Finish!
    function handleEditorChange({ html, text }) {
        console.log('handleEditorChange >>>', html);
        let productCopy = { ...product };
        productCopy.description = html;
        setProduct(productCopy);
    }

    return (
        <div>
            <div id="wrapper">
                <div class="container-fluid">
                    <div class="row">
                        <form>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Tiêu đề: </label>
                                <input type="text" name="title" value={product.title} class="form-control" placeholder="Nhập tiêu đề" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                            </div>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Nhãn hiệu: </label>
                                <select class="form-select" aria-label="Default select example" name="brand" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })}>
                                    <option selected value=''>Chọn nhãn hiệu</option>
                                    {
                                        brand && brand.length > 0 && brand.map((item) => {
                                            return (<option value={item.title}>{item.title}</option>)
                                        })
                                    }
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Giá bán: </label>
                                <input type="text" name="price" value={product.price} class="form-control" placeholder="Enter Product Price" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Số lượng: </label>
                                <input type="text" name="quantity" value={product.quantity} class="form-control" placeholder="Enter Product Quantity" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Thể loại: </label>
                                <select class="form-select form-select-price-sort" aria-label="Default select example" value={product.category} name="category" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })}>
                                    <option selected>Thể loại</option>
                                    {
                                        listCategory && listCategory?.length > 0 && listCategory.map((item) => {
                                            if (!item.isChild) {
                                                return (
                                                    <>
                                                        <option value={item.title}>{item.title}</option>
                                                        <>
                                                            {item && item?.childCategory.length > 0 && item.childCategory.map((element) => {
                                                                return <option value={element.title}>{element.title}</option>
                                                            })}
                                                        </>
                                                    </>
                                                )

                                            }

                                        })
                                    }
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Mô tả sản phẩm: </label>
                                <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
                            </div>
                            <div class="form-group">
                                <label for="image-product-upload">Ảnh minh họa: </label>
                                <input type="file" id="image-product-upload" name="img" accept="image/*" onChange={(event) => handleOnChangeImage(event)} />
                            </div>
                            <div className="preview-image"
                                style={{
                                    backgroundImage: `url(${product.previewImgUrl})`,
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    height: '210px',
                                    width: '210px',
                                }}>
                            </div>
                            <div class="btn btn-primary" onClick={() => handleSubmitForm()}>Tạo mới sản phẩm</div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddNewProduct;