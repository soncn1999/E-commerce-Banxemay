import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Header, Footer } from '../../pages/private';
import Swal from 'sweetalert2';
import { userRegisterApi, changeUserRoleApi } from '../../services/user';


AddSysUserByAdmin.propTypes = {

};

function AddSysUserByAdmin(props) {
    const [userRegister, setUserRegister] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        mobile: ""
    });

    const handleSubmitForm = async () => {
        let data = { ...userRegister };
        console.log('check data >>>> ', data);
        let responseRegister = await userRegisterApi(data);
        if (responseRegister && responseRegister.success) {
            let responseChangeRole = await changeUserRoleApi(responseRegister.data._id, { role: 'admin' });
            if (responseChangeRole && responseChangeRole.success) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `Đã thêm mới Admin ${userRegister.firstname} ${userRegister.lastname} !`,
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: `Chưa thêm mới Admin ${userRegister.firstname} ${userRegister.lastname} !`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: `Không tạo mới được tài khoản ${userRegister.firstname} ${userRegister.lastname} !`,
                showConfirmButton: false,
                timer: 1500
            });
        }
    }

    return (
        <div>
            <div id="wrapper">
                <div class="container-fluid">
                    <div class="row">
                        <form>
                            <div class="form-group">
                                <label for="exampleInputEmail1">Firstname: </label>
                                <input type="text" name="firstname" value={userRegister.firstname} class="form-control" placeholder="Enter User Firstname" onChange={(event) => setUserRegister({ ...userRegister, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Lastname: </label>
                                <input type="text" name="lastname" value={userRegister.lastname} class="form-control" placeholder="Enter User Lastname" onChange={(event) => setUserRegister({ ...userRegister, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Email: </label>
                                <input type="email" name="email" value={userRegister.email} class="form-control" placeholder="Enter User Email" onChange={(event) => setUserRegister({ ...userRegister, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Password: </label>
                                <input type="password" name="password" value={userRegister.password} class="form-control" placeholder="Enter User Password" onChange={(event) => setUserRegister({ ...userRegister, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Mobile: </label>
                                <input type="text" name="mobile" value={userRegister.mobile} class="form-control" placeholder="Enter User Mobile" onChange={(event) => setUserRegister({ ...userRegister, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="btn btn-primary" onClick={() => handleSubmitForm()}>Submit</div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddSysUserByAdmin;