import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getAllCategoryApi, handleDeleteCategoryApi } from '../../services/product';
import { Button } from 'reactstrap';
import './Category-Style/style.scss';
import ModalEditCategory from './ModalEditCategory';
import Swal from 'sweetalert2';

HandleCategoryInfo.propTypes = {

};

function HandleCategoryInfo(props) {
    const [category, setCategory] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState('');

    useEffect(() => {
        getListCategory();
    }, []);

    const getListCategory = async () => {
        let response = await getAllCategoryApi();
        if (response && response.success) {
            const { success, productCategories } = response;
            setCategory(productCategories);
        }
    }

    const handleOpenModal = (id) => {
        setIsModalOpen(true);
        setEditId(id);
    }

    const handleIsOpenned = async (data) => {
        setIsModalOpen(false);
        await getListCategory();
    }

    const handleDeleteCategory = async (id) => {
        if (id) {
            Swal.fire({
                title: "Do you want to delete this category?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Yes",
                denyButtonText: `No`
            }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    const response = await handleDeleteCategoryApi(id);
                    if (response && response.success) {
                        await getListCategory();
                        Swal.fire("Deleted!", "", "success");
                    } else {
                        Swal.fire("Oops! Something went wrong, try again.", "", "info");
                    }
                } else if (result.isDenied) {
                    Swal.fire("Changes are not saved", "", "info");
                }
            });
        }
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {
                category && category.length > 0 && category.map((item) => {
                    if (!item.isChild) {
                        return (
                            <div className="category-wrapper">
                                <div className="category-parent">
                                    <i class="fa-solid fa-folder-open parent-icon--justify">
                                    </i> &nbsp;{item.title}

                                    <div className="category-parent__action-wrapper category-parent__action--justify">
                                        <div className="category-parent__action">
                                            <Button className="category__btn" color="warning" onClick={() => handleOpenModal(item._id)}>
                                                <i class="fa-solid fa-pen"></i>
                                            </Button>
                                            &nbsp;
                                            <Button className="category__btn" color="danger">
                                                <i class="fa-solid fa-trash"></i>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <ul className="category-child__list">
                                    {
                                        item && item.childCategory?.length > 0 && item.childCategory.map((category) => {
                                            return (
                                                <li className="category-child__item">
                                                    <div className="category-child__relation"></div>
                                                    <i class="fa-solid fa-file icon--justify"></i> &nbsp; {category.title}

                                                    <div className="category-child__action-wrapper">
                                                        <div className="category-child__action category-child__action--justify">
                                                            <Button className="category__btn" color="warning" onClick={() => handleOpenModal(category._id)}>
                                                                <i class="fa-solid fa-pen"></i>
                                                            </Button>
                                                            &nbsp;
                                                            <Button className="category__btn" color="danger" onClick={() => handleDeleteCategory(category._id)}>
                                                                <i class="fa-solid fa-trash"></i>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                                {
                                    editId && isModalOpen && <ModalEditCategory handleIsOpenned={handleIsOpenned} editId={editId} />
                                }
                            </div>
                        )
                    }
                })
            }

        </div>

    );
}

export default HandleCategoryInfo;