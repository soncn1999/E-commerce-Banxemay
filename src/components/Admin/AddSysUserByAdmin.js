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
        mobile: "",
        role: ""
    });

    const handleSubmitForm = async () => {
        let data = { ...userRegister };
        console.log('data người dùng >>> ', data);
        let responseRegister = await userRegisterApi(data);
        if (responseRegister && responseRegister.success) {
            let responseChangeRole = await changeUserRoleApi(responseRegister.data._id, { role: data.role });
            if (responseChangeRole && responseChangeRole.success) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: `Đã thêm mới ${data.role} ${userRegister.firstname} ${userRegister.lastname} !`,
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
                                <label for="exampleInputEmail1">Họ, tên đệm: </label>
                                <input type="text" name="firstname" value={userRegister.firstname} class="form-control" placeholder="Nhập họ tên đệm" onChange={(event) => setUserRegister({ ...userRegister, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Tên: </label>
                                <input type="text" name="lastname" value={userRegister.lastname} class="form-control" placeholder="Nhập tên" onChange={(event) => setUserRegister({ ...userRegister, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Email: </label>
                                <input type="email" name="email" value={userRegister.email} class="form-control" placeholder="Nhập email của bạn" onChange={(event) => setUserRegister({ ...userRegister, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Mật khẩu: </label>
                                <input type="password" name="password" value={userRegister.password} class="form-control" placeholder="Nhập mật khẩu của bạn" onChange={(event) => setUserRegister({ ...userRegister, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Số điện thoại: </label>
                                <input type="text" name="mobile" value={userRegister.mobile} class="form-control" placeholder="Nhập số điện thoại của bạn" onChange={(event) => setUserRegister({ ...userRegister, [event.target.name]: event.target.value })} />
                            </div>
                            <div class="form-group">
                                <label for="exampleInputPassword1">Vai trò: </label>
                                <select class="form-select" aria-label="Default select example" name="role" onChange={(event) => setUserRegister({ ...userRegister, [event.target.name]: event.target.value })}>
                                    <option selected>CHỌN VAI TRÒ</option>
                                    <option value="admin">admin</option>
                                    <option value="staff">staff</option>
                                </select>
                            </div>
                            <div class="btn btn-success" onClick={() => handleSubmitForm()}>Tạo mới và cấp quyền người dùng</div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddSysUserByAdmin;