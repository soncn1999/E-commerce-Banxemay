import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getDetailProductApi, updateProductApi } from '../../services/product';
import Swal from 'sweetalert2';
import MarkdownIt from 'markdown-it';
import ReactMarkdown from "react-markdown";
import MdEditor from 'react-markdown-editor-lite';
import Editor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { uploadImageProductApi, getAllCategoryApi } from '../../services/product';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

ModalEditProduct.propTypes = {

};

function ModalEditProduct(props) {
    const { editId } = props;
    const mdEditor = React.useRef(null);
    const [product, setProduct] = useState({
        title: '',
        description: '',
        brand: '',
        price: 0,
        previewImgUrl: "",
        files: "",
        quantity: 0,
        category: "",
    });
    const [description, setDescription] = useState('');
    const [listCategory, setListCategory] = useState([]);

    useEffect(() => {
        if (editId) {
            handleFetchProductData(editId);
            getListCategory();
        }
    }, [editId]);

    const handleFetchProductData = async (id) => {
        const response = await getDetailProductApi(id);
        if (response && response.success) {
            let { title,
                description,
                brand,
                price, quantity, category } = response.data;
            setProduct({ title, description, brand, price, quantity, category });
            setDescription(description);
        }
    }

    const handleIsOpenned = () => {
        props.handleIsOpenned(false);
    }

    const handleSubmitUpdate = async () => {
        let { previewImgUrl, files, ...dataCopy } = product;
        const response = await updateProductApi(dataCopy, editId);
        if (response && response.success) {
            let responseImage = await uploadImageProductApi({
                pid: editId,
                files: files,
            });
            if (responseImage && responseImage.success) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Sản phẩm đã được update!",
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

    // function handleEditorChange({ html, text }) {
    //     console.log('handleEditorChange >>>', html);
    //     let productCopy = { ...product };
    //     productCopy.description = html;
    //     setProduct(productCopy);
    // }

    const handleEditorChange = ({ html, text }) => {
        const newValue = text.replace(/\d/g, "");
        setDescription(newValue);
        let productCopy = { ...product };
        productCopy.description = html;
        setProduct(productCopy);
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

    const getListCategory = async () => {
        let response = await getAllCategoryApi();
        if (response && response.success) {
            const { productCategories } = response;
            setListCategory(productCategories);
        }
    }

    return (
        <div>
            <Modal isOpen={true}>
                <ModalHeader>
                    {
                        product && `Editing product: ${product.title}`
                    }
                </ModalHeader>
                <ModalBody>
                    <form>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Title: </label>
                            <input type="text" value={product.title} name="title" class="form-control" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Brand: </label>
                            <input type="text" value={product.brand} name="brand" class="form-control" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Price: </label>
                            <input type="text" value={product.price} name="price" class="form-control" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Quantity: </label>
                            <input type="text" value={product.quantity} name="quantity" class="form-control" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
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
                        <div class="form-group">
                            <label for="exampleInputPassword1">Description: </label>
                            <Editor
                                ref={mdEditor}
                                value={description}
                                style={{
                                    height: "500px"
                                }}
                                onChange={handleEditorChange}
                                renderHTML={text => <ReactMarkdown children={text} />}
                            />
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => handleSubmitUpdate()}>
                        Update Product
                    </Button>{' '}
                    <Button color="danger" onClick={() => handleIsOpenned()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalEditProduct;