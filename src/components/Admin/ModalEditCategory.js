import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getDetailProductCategoryApi, handleUpdateCategoryApi } from '../../services/product';
import Swal from 'sweetalert2';

ModalEditCategory.propTypes = {

};

function ModalEditCategory(props) {
    const { editId } = props;
    const [category, setCategory] = useState({
        title: '',
        isChild: false,
    })

    useEffect(() => {
        if (editId) {
            console.log('edit id >>> ', editId);
            handleFetchProductData(editId);
        }
    }, [editId]);

    const handleFetchProductData = async (id) => {
        const response = await getDetailProductCategoryApi(id);
        if (response && response.success) {
            console.log('check response >>>> ', response);
            let { title,
                isChild } = response.productCategories;
            setCategory({ title, isChild });
        }
    }

    const handleIsOpenned = () => {
        props.handleIsOpenned(false);
    }

    const handleSubmitUpdate = async () => {
        const response = await handleUpdateCategoryApi({
            title: category.title,
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
                        category && `Editing Category: ${category.title}`
                    }
                </ModalHeader>
                <ModalBody>
                    <form>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Title: </label>
                            <input type="text" value={category.title} name="title" class="form-control" onChange={(event) => setCategory({ ...category, [event.target.name]: event.target.value })} />
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => handleSubmitUpdate()}>
                        Update Category
                    </Button>{' '}
                    <Button color="danger" onClick={() => handleIsOpenned()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalEditCategory;