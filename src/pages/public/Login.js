import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './public-style/Login.css';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginApi } from '../../services/user';
import { loginUserRedux } from '../../store/asyncActions';
import { useNavigate, Link } from 'react-router-dom';
import path from '../../utils/path';

Login.propTypes = {

};

function Login(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const [userLogin, setUserLogin] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
        if (isLoggedIn) {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Đăng nhập thành công!',
                showConfirmButton: false,
                timer: 1500
            });
            navigate(`/${path.HOME}`);
        }
        return () => {

        }
    }, [isLoggedIn]);

    const handleSubmitLogin = async () => {
        const { email, password } = userLogin;
        if (!email || !password) {
            Swal.fire({
                title: 'Error!',
                text: 'Bạn chưa điền đủ trường thông tin !!!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } else {
            if (password.length > 3) {
                dispatch(loginUserRedux({
                    email,
                    password
                }));

                console.log('check status user after Log In >>> ', isLoggedIn);
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
                                    <h5 className="card-title text-center mb-5 fw-light fs-2">Đăng nhập</h5>
                                    <form>
                                        <div className="form-floating mb-3">
                                            <input type="email" name="email" className="form-control" id="floatingInputEmail"
                                                placeholder="name@example.com" onChange={(event) => {
                                                    setUserLogin({ ...userLogin, [event.target.name]: event.target.value },)
                                                }} />
                                            <label for="floatingInputEmail">Email của bạn</label>
                                        </div>

                                        <div className="form-floating mb-3">
                                            <input type="password" name="password" className="form-control" id="floatingPassword"
                                                placeholder="Password" onChange={(event) => {
                                                    setUserLogin({ ...userLogin, [event.target.name]: event.target.value })
                                                }} />
                                            <label for="floatingPassword">Mật khẩu</label>
                                        </div>

                                        <hr />

                                        <div className="d-grid mb-2">
                                            <div className="btn btn-lg btn-primary fw-bold text-uppercase" onClick={() => handleSubmitLogin()}>Login</div>
                                        </div>

                                        <Link className="d-block text-center mt-2 small" to={`/${path.REGISTER}`}>Bạn chưa có tài khoản? Đăng ký ngay</Link>

                                        <hr className="my-4" />

                                        <div className="d-grid mb-2">
                                            <button className="btn btn-lg btn-google fw-bold text-uppercase" type="submit">
                                                <i class="fa-brands fa-google"></i> Đăng nhập bằng Google
                                            </button>
                                        </div>

                                        <div className="d-grid">
                                            <button className="btn btn-lg btn-facebook fw-bold text-uppercase" type="submit">
                                                <i class="fa-brands fa-square-facebook"></i> Đăng nhập bằng Facebook
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;