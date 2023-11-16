import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getAllProductApi } from '../../services/product';
import ModalEditProduct from './ModalEditProduct';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { deleteProductApi } from '../../services/product';
import Swal from 'sweetalert2';

HandleProductInfo.propTypes = {

};

function HandleProductInfo(props) {
    const [listProduct, setListProduct] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState('');
    useEffect(() => {
        getAllProduct(1);
    }, []);

    const getAllProduct = async (pageNumber) => {
        let response = await getAllProductApi(pageNumber);
        console.log('check list product >>> ', response);
        if (response && response.success) {
            let { success, ...productCopy } = response;
            setListProduct(productCopy);
        }
    }

    const handleOpenModal = (id) => {
        setIsModalOpen(true);
        setEditId(id);
    }

    const handleIsOpenned = async (data) => {
        setIsModalOpen(false);
    }

    const handleDeleteProduct = async (id) => {
        if (id) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await deleteProductApi(id);
                    if (response && response.success) {
                        swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                    } else {
                        swalWithBootstrapButtons.fire({
                            title: "Oops",
                            text: "Something went wrong :)",
                            icon: "error"
                        });
                    }
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelled",
                        text: "Your imaginary file is safe :)",
                        icon: "error"
                    });
                }
            });
        }
    }

    return (
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Title</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Price</th>
                    <th scope="col">Sold</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    listProduct && listProduct.product?.length > 0 && listProduct.product.map((item, index) => {
                        return (
                            <Fragment>
                                <tr key={item._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td scope="row">{item.title}</td>
                                    <td scope="row">{item.brand}</td>
                                    <td scope="row">{item.price}</td>
                                    <td scope="row">{item.sold}</td>
                                    <td scope="row">
                                        <Button color="info" style={{ marginTop: 0 }} onClick={() => handleOpenModal(item._id)}>
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </Button>
                                        {
                                            editId && isModalOpen && <ModalEditProduct handleIsOpenned={handleIsOpenned} editId={editId} />
                                        }
                                        <button style={{ marginTop: '5px' }} type="button" class="btn btn-danger" onClick={() => handleDeleteProduct(item._id)}>
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            </Fragment>
                        )
                    })
                }
            </tbody>
        </table>
    );
}

export default HandleProductInfo;