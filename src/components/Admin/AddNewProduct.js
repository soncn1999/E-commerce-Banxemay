import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Header, Footer } from '../../pages/private';
import { createNewProductApi, uploadImageProductApi, getListBrandApi } from '../../services/product';
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
    }, [])

    const [product, setProduct] = useState({
        title: "",
        description: "",
        brand: "",
        price: 0,
        previewImgUrl: "",
        files: "",
        quantity: 0,
    });

    const [brand, setBrand] = useState([]);

    const handleGetListBrand = async () => {
        let response = await getListBrandApi();
        if (response && response.success) {
            const { data, success } = response;
            setBrand(data);
        }
    }

    const handleSubmitForm = async () => {
        let { previewImgUrl, files, ...dataCopy } = product;

        console.log('Check data copy >>> ', dataCopy);

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
                quantity: 0
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
                                <label for="exampleInputEmail1">Title: </label>
                                <input type="text" name="title" value={product.title} class="form-control" placeholder="Enter Product Title" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                            </div>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Brand: </label>
                                <select class="form-select" aria-label="Default select example" name="brand" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })}>
                                    <option selected value=''>Open this select menu</option>
                                    {
                                        brand && brand.length > 0 && brand.map((item) => {
                                            return (<option value={item.title}>{item.title}</option>)
                                        })
                                    }
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Price: </label>
                                <input type="text" name="price" value={product.price} class="form-control" placeholder="Enter Product Price" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Quantity: </label>
                                <input type="text" name="quantity" value={product.quantity} class="form-control" placeholder="Enter Product Quantity" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Description: </label>
                                <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
                            </div>
                            <div class="form-group">
                                <label for="image-product-upload">Image Illustration: </label>
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
                            <div class="btn btn-primary" onClick={() => handleSubmitForm()}>Submit</div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddNewProduct;