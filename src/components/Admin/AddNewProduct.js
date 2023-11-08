import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Header, Footer } from '../../pages/private';
import { createNewProductApi, uploadImageProductApi } from '../../services/product';
import Swal from 'sweetalert2';

AddNewProduct.propTypes = {

};

function AddNewProduct(props) {
    const [product, setProduct] = useState({
        title: "",
        description: "",
        brand: "",
        price: 0,
        previewImgUrl: "",
        files: "",
    });

    const handleSubmitForm = async () => {
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
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: "Ảnh chưa được !",
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
                            <div class="form-group">
                                <label for="exampleInputPassword1">Description: </label>
                                <input type="text" name="description" value={product.description} class="form-control" placeholder="Enter Product Description" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Brand: </label>
                                <input type="text" name="brand" value={product.brand} class="form-control" placeholder="Enter Product Brand" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Price: </label>
                                <input type="text" name="price" value={product.price} class="form-control" placeholder="Enter Product Price" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
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