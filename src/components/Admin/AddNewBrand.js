import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createNewBrandApi } from '../../services/product';
import Swal from 'sweetalert2';

AddNewBrand.propTypes = {

};

function AddNewBrand(props) {
    const [brand, setBrand] = useState({
        title: '',
    });

    const handleSubmitForm = async () => {
        let response = await createNewBrandApi(brand);
        if (response && response.success) {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "New Brand Created Successfully!!!",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Can not create new brand!!!",
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
                            <input type="text" name="title" class="form-control" placeholder="Enter Brand Title" onChange={(event) => setBrand({ ...brand, [event.target.name]: event.target.value })} />
                        </div>
                        <div class="btn btn-primary" onClick={() => handleSubmitForm()}>Submit</div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddNewBrand;