import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getAllCategoryApi, createCategoryApi } from '../../services/product';
import Swal from 'sweetalert2';

AddNewCategory.propTypes = {

};

function AddNewCategory(props) {
    const [category, setCategory] = useState({
        title: '',
        parentCategory: ''
    });

    const [listCategory, setListCategory] = useState([]);

    useEffect(() => {
        getListCategory();
    }, []);

    const getListCategory = async () => {
        let response = await getAllCategoryApi();
        if (response && response.success) {
            const { success, productCategories } = response;
            setListCategory(productCategories);
        }
    }

    const handleSubmitForm = async () => {
        let response = await createCategoryApi(category);
        if (response && response.success) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "New Category Created Successfully!!!",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Can not create new category!!!",
                showConfirmButton: false,
                timer: 1500
            });
        }
    }

    return (
        <div id="wrapper">
            <div class="container-fluid">
                <div class="row">
                    <form>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Name: </label>
                            <input type="text" name="title" class="form-control" placeholder="Enter Category Title" onChange={(event) => setCategory({ ...category, [event.target.name]: event.target.value })} />
                        </div>
                        <div className="form-group">
                            <label for="exampleInputEmail1">Parent Category: </label>
                            <select class="form-select" aria-label="Default select example" name="parentCategory" onChange={(event) => setCategory({ ...category, [event.target.name]: event.target.value })}>
                                <option selected value=''>Open this select menu</option>
                                {
                                    listCategory && listCategory.length > 0 && listCategory.map((item) => {
                                        if (!item.isChild) {
                                            return (<option value={item._id}>{item.title}</option>)
                                        }
                                    })
                                }
                            </select>
                        </div>

                        <div class="btn btn-primary" onClick={() => handleSubmitForm()}>Submit</div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddNewCategory;