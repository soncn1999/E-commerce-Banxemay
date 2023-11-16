import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getDetailProductApi, updateProductApi } from '../../services/product';
import Swal from 'sweetalert2';

ModalEditProduct.propTypes = {

};

function ModalEditProduct(props) {
    const { editId } = props;
    const [product, setProduct] = useState({
        title: '',
        description: '',
        brand: '',
        price: 0
    })

    useEffect(() => {
        if (editId) {
            handleFetchProductData(editId);
        }
    }, [editId]);

    const handleFetchProductData = async (id) => {
        const response = await getDetailProductApi(id);
        if (response && response.success) {
            let { title,
                description,
                brand,
                price } = response.data;
            setProduct({ title, description, brand, price });
        }
    }

    const handleIsOpenned = () => {
        props.handleIsOpenned(false);
    }

    const handleSubmitUpdate = async () => {
        const response = await updateProductApi(product, editId);
        if (response && response.success) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Product updated successfully!",
                showConfirmButton: false,
                timer: 1500
            });
            handleIsOpenned();
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Can not update this product!",
                showConfirmButton: false,
                timer: 1500
            });
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
                            <label for="exampleInputPassword1">Description: </label>
                            <input type="text" value={product.description} name="description" class="form-control" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Brand: </label>
                            <input type="text" value={product.brand} name="brand" class="form-control" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Price: </label>
                            <input type="text" value={product.price} name="price" class="form-control" onChange={(event) => setProduct({ ...product, [event.target.name]: event.target.value })} />
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