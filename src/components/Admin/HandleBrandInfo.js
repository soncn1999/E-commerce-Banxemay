import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getListBrandApi, handleDeleteBrandApi } from '../../services/product';
import ModalEditBrand from './ModalEditBrand';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Swal from 'sweetalert2';


HandleBrandInfo.propTypes = {

};

function HandleBrandInfo(props) {
    const [brand, setBrand] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState('');

    useEffect(() => {
        getListBrand();
    }, []);

    const getListBrand = async () => {
        let response = await getListBrandApi();
        if (response && response.success) {
            let { data } = response;
            setBrand(data);
        }
    }

    const handleOpenModal = (id) => {
        setIsModalOpen(true);
        setEditId(id);
    }

    const handleIsOpenned = async (data) => {
        setIsModalOpen(false);
        await getListBrand();
    }

    const handleDeleteBrand = async (id) => {
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
                    const response = await handleDeleteBrandApi(id);
                    if (response && response.success) {
                        swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        await getListBrand();
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
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    brand && brand?.length > 0 && brand.map((item, index) => {
                        return (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.title}</td>
                                <td scope="row">
                                    <Button color="info" style={{ marginTop: 0 }} onClick={() => handleOpenModal(item._id)}>
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </Button>
                                    {
                                        editId && isModalOpen && <ModalEditBrand handleIsOpenned={handleIsOpenned} editId={editId} />
                                    }
                                    <button style={{ marginTop: '5px' }} type="button" class="btn btn-danger" onClick={() => handleDeleteBrand(item._id)}>
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </table>
    );
}

export default HandleBrandInfo;