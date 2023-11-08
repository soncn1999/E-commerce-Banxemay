import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './public-style/Login.css';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { registerUserRedux } from '../../store/asyncActions';
import { useNavigate, Link } from 'react-router-dom';
import path from '../../utils/path';

Register.propTypes = {

};

function Register(props) {
    const [userRegister, setUserRegister] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        mobile: "",
        passwordConfirm: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const email = useSelector((state) => state.user.email);

    useEffect(() => {
        if (email == userRegister.email) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Đăng ký thành công!',
                showConfirmButton: false,
                timer: 1500
            });
            navigate(`/${path.HOME}`);
        }
        return () => {

        }
    }, [email]);

    const handleSubmitRegister = async () => {
        const { email,
            password,
            firstname,
            lastname,
            mobile,
            passwordConfirm } = userRegister;
        if (!email || !password || !firstname || !lastname || !mobile || !passwordConfirm) {
            Swal.fire({
                title: 'Error!',
                text: 'Bạn chưa điền đủ trường thông tin !!!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } else {
            if (password.length > 3 && password == passwordConfirm) {
                let timerInterval
                Swal.fire({
                    title: 'Thông tin hợp lệ!',
                    html: 'Đang xử lý yêu cầu trong <b></b> (giây).',
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading()
                        const b = Swal.getHtmlContainer().querySelector('b')
                        timerInterval = setInterval(() => {
                            b.textContent = Swal.getTimerLeft()
                        }, 100)
                    },
                    willClose: () => {
                        clearInterval(timerInterval)
                    }
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        console.log('I was closed by the timer')
                    }
                });

                dispatch(registerUserRedux({
                    email,
                    password,
                    firstname,
                    lastname,
                    mobile,
                }));
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Mật khẩu quá ngắn hoặc không trùng khớp!!!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    }

    return (
        <div className="login-component">
            <div className="container">
                <div className="form-login">
                    <div className="row">
                        <div className="col-lg-10 col-xl-9 mx-auto">
                            <div className="card flex-row my-5 border-0 shadow rounded-3 overflow-hidden">
                                <div className="card-img-left d-none d-md-flex">
                                </div>
                                <div className="card-body p-4 p-sm-5">
                                    <h5 className="card-title text-center mb-5 fw-light fs-2">Đăng ký tài khoản</h5>
                                    <form>
                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" name="firstname"
                                                placeholder="myusername" required autofocus onChange={(event) => { setUserRegister({ ...userRegister, [event.target.name]: event.target.value }) }} />
                                            <label for="floatingInputUsername">Họ </label>
                                        </div>

                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" name="lastname"
                                                placeholder="myusername" required autofocus onChange={(event) => { setUserRegister({ ...userRegister, [event.target.name]: event.target.value }) }} />
                                            <label for="floatingInputUsername">Tên </label>
                                        </div>

                                        <div className="form-floating mb-3">
                                            <input type="email" className="form-control" name="email"
                                                placeholder="name@example.com" onChange={(event) => { setUserRegister({ ...userRegister, [event.target.name]: event.target.value }) }} />
                                            <label for="floatingInputEmail">Địa chỉ Email </label>
                                        </div>

                                        <div className="form-floating mb-3">
                                            <input type="text" className="form-control" name="mobile"
                                                placeholder="name@example.com" onChange={(event) => { setUserRegister({ ...userRegister, [event.target.name]: event.target.value }) }} />
                                            <label for="floatingInputEmail">Số điện thoại </label>
                                        </div>

                                        <hr />

                                        <div className="form-floating mb-3">
                                            <input type="password" className="form-control" name="password"
                                                placeholder="Password" onChange={(event) => { setUserRegister({ ...userRegister, [event.target.name]: event.target.value }) }} />
                                            <label for="floatingPassword">Mật khẩu</label>
                                        </div>

                                        <div className="form-floating mb-3">
                                            <input type="password" className="form-control" name="passwordConfirm"
                                                placeholder="Confirm Password" onChange={(event) => { setUserRegister({ ...userRegister, [event.target.name]: event.target.value }) }} />
                                            <label for="floatingPasswordConfirm">Xác nhận mật khẩu</label>
                                        </div>

                                        <div className="d-grid mb-2">
                                            <div className="btn btn-lg btn-primary btn-login fw-bold text-uppercase" onClick={() => handleSubmitRegister()}>Đăng ký</div>
                                        </div>

                                        <Link className="d-block text-center mt-2 small" to={`/${path.LOGIN}`}>Bạn đã có tài khoản? Đăng nhập</Link>

                                        <hr className="my-4" />

                                        <div className="d-grid mb-2">
                                            <div className="btn btn-lg btn-google btn-login fw-bold text-uppercase">
                                                <i class="fa-brands fa-google"></i> Đăng ký bằng Google
                                            </div>
                                        </div>

                                        <div className="d-grid">
                                            <div className="btn btn-lg btn-facebook btn-login fw-bold text-uppercase">
                                                <i class="fa-brands fa-square-facebook"></i> Đăng ký bằng Facebook
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default Register;