import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Swal from 'sweetalert2';
import { handleGetDetailBrandApi, handleUpdateBrandApi } from '../../services/product';

ModalEditBrand.propTypes = {

};

function ModalEditBrand(props) {
    const { editId } = props;
    const [brand, setBrand] = useState({
        title: '',
    })

    useEffect(() => {
        if (editId) {
            handleGetDetailBrand(editId);
        }
    }, [editId]);

    const handleGetDetailBrand = async (id) => {
        const response = await handleGetDetailBrandApi(id);

        if (response && response.success) {
            console.log('check response >>>> ', response);
            let { title } = response.data;
            setBrand({ title });
        }
    }

    const handleIsOpenned = () => {
        props.handleIsOpenned(false);
    }

    const handleSubmitUpdate = async () => {
        const response = await handleUpdateBrandApi({
            title: brand.title,
        }, editId);
        if (response && response.success) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Category updated successfully!",
                showConfirmButton: false,
                timer: 1500
            });
            handleIsOpenned();
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Can not update this category!",
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
                        brand && `Editing Brand: ${brand.title}`
                    }
                </ModalHeader>
                <ModalBody>
                    <form>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Title: </label>
                            <input type="text" value={brand.title} name="title" class="form-control" onChange={(event) => setBrand({ ...brand, [event.target.name]: event.target.value })} />
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => handleSubmitUpdate()}>
                        Update Brand
                    </Button>{' '}
                    <Button color="danger" onClick={() => handleIsOpenned()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalEditBrand;