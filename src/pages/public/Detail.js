import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Header, Footer } from '../../components';
import { useParams } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import './public-style/Detail.css';
import { getDetailProductApi, getListProductRelateBrandApi } from '../../services/product';
import { updateCartApi } from '../../services/user';
import { useSelector, useDispatch } from 'react-redux';
import { changeUserCart } from '../../store/userSlice';
import Swal from 'sweetalert2';
import { formatter } from '../../utils/helper';
import path from '../../utils/path';
import { handlePostCommentApi } from '../../services/user';

Detail.propTypes = {

};

function Detail(props) {
    let { pid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userCart = useSelector((state) => state.user.current);
    const user_id = useSelector((state) => state.user.id);
    const userCurrent = useSelector((state) => state.user);
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const [detailProduct, setDetailProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState();
    const [comment, setComment] = useState('');
    useEffect(() => {
        getDetailProduct(pid);
    }, []);

    const getDetailProduct = async (pid) => {
        let response = await getDetailProductApi(pid);
        if (response && response.success) {
            setDetailProduct(response.data);
        }
        console.log(response.data);
        await getListProductRelatedBrand(response.data.brand);
    }

    const getListProductRelatedBrand = async (brand) => {
        let response = await getListProductRelateBrandApi(brand);
        const { product } = response;
        setRelatedProduct(product);
    }

    console.log('Người dùng hiện tại >>> ', userCurrent);

    const handleAddAProduct = async (product) => {
        if (!isLoggedIn && !user_id) {
            Swal.fire({
                title: "Bạn chưa đăng nhập",
                text: "Đăng nhập để vào giỏ hàng",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đăng nhập"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/${path.LOGIN}`);
                }
            });
        } else {
            let cartCopy = [...userCart?.cart];

            let productItem = {};

            const { createdAt, description, rating, slug, sold, totalRatings, updatedAt, ...productCopy } = product;

            productItem['product'] = productCopy;
            productItem['color'] = 'black';
            productItem['quantity'] = 1;

            cartCopy.push(productItem);

            let response = await updateCartApi({
                pid: productCopy._id,
                quantity: productItem['quantity'],
                color: productItem['color']
            });

            if (response && response.success) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Đã thêm mặt hàng vào Giỏ hàng',
                    showConfirmButton: false,
                    timer: 1500
                })
                dispatch(changeUserCart(cartCopy));
            }
        }
    }

    const handleAccessDetail = async (pid) => {
        navigate(`/products/${pid}`);
        await getDetailProduct(pid);
    }

    const handlePostComment = async () => {
        if (!isLoggedIn && !user_id) {
            Swal.fire({
                title: "Bạn chưa đăng nhập",
                text: "Đăng nhập để đánh giá",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đăng nhập"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(`/${path.LOGIN}`);
                }
            });
        } else {
            let data = {
                pid: pid,
                star: 5,
                comment: comment
            }

            const response = await handlePostCommentApi(data);

            if (response && response.success) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Đã tạo đánh giá cho sản phẩm",
                    showConfirmButton: false,
                    timer: 1500
                });
                setComment("");
                await getDetailProduct(pid);
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: "Chưa tạo đánh giá cho sản phẩm",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    }

    return (
        <div>
            <Header />
            {/* <!-- Product section--> */}
            <section class="" style={{ paddingTop: '150px' }}>
                <div class="container px-4 px-lg-5 my-5">
                    <div class="row gx-4 gx-lg-5 align-items-center">
                        <div class="col-md-6">
                            <img class="card-img-top"
                                src={detailProduct?.image?.length > 0 ? detailProduct?.image[0] : `https://dummyimage.com/450x300/dee2e6/6c757d.jpg`} alt="..." />
                        </div>
                        <div class="col-md-6">
                            <div class="small mb-1">{detailProduct && detailProduct.brand}</div>
                            <h1 class="display-5 fw-bolder">{detailProduct && detailProduct.title}</h1>
                            <div class="fs-5 mb-5">
                                <span class="text-decoration-line-through">{detailProduct && formatter.format(detailProduct.price - 100)}</span>
                                &nbsp;
                                <span>{detailProduct && formatter.format(detailProduct.price)}</span>
                            </div>
                            <p class="lead">
                                <div dangerouslySetInnerHTML={{ __html: detailProduct.description }} />
                            </p>
                            <div class="d-flex">
                                {/* <input class="form-control text-center me-3" id="inputQuantity" type="num" value="1" style={{ maxWidth: "3rem" }} /> */}
                                <div class="btn btn-outline-dark flex-shrink-0" onClick={() => handleAddAProduct(detailProduct)}>
                                    <i class="fa-solid fa-cart-shopping"></i>
                                    &nbsp;
                                    Thêm vào giỏ hàng
                                </div>
                            </div>

                            <div className="lead">
                                <div class="container mt-5 mb-5">
                                    <div class="d-flex justify-content-center row">
                                        <div class="d-flex flex-column col-md-8">
                                            <div class="coment-bottom bg-white p-2 px-4">
                                                <div class="d-flex flex-row add-comment-section mt-4 mb-4">
                                                    <div class="col-auto">
                                                        <label class="sr-only" for="inlineFormInputGroup">Username</label>
                                                        <div class="input-group mb-2">
                                                            <div class="input-group-prepend">
                                                                <div class="input-group-text">@ {userCurrent && userCurrent?.current ? `${userCurrent.current.firstname} ${userCurrent.current.lastname}` : `Username`}</div>
                                                            </div>
                                                            <input type="text" class="form-control" value={comment} id="inlineFormInputGroup" placeholder="Nội dung bình luận" name="comment" onChange={(event) => setComment(event.target.value)} />
                                                        </div>
                                                    </div>

                                                    <button class="btn btn-primary" type="button" style={{ marginTop: '0' }} onClick={() => handlePostComment()}>Bình luận</button>
                                                </div>
                                                <div style={{ height: '250px', overflow: 'scroll' }}>
                                                    {
                                                        detailProduct && detailProduct?.rating?.length > 0 && detailProduct.rating.map((item) => {
                                                            return (
                                                                <div class="commented-section mt-2">
                                                                    <div class="d-flex flex-row align-items-center commented-user">
                                                                        <h5 class="mr-2">{item.postedBy.firstname} {item.postedBy.lastname}</h5>
                                                                        {/* <span class="dot mb-1"></span>
                                                                    <span class="mb-1 ml-2">4 hours ago</span> */}
                                                                    </div>
                                                                    <div class="comment-text-sm"><span>{item.comment}</span></div>
                                                                    <div
                                                                        class="reply-section">
                                                                        <div class="d-flex flex-row align-items-center voting-icons"><i class="fa fa-sort-up fa-2x mt-3 hit-voting"></i><i class="fa fa-sort-down fa-2x mb-3 hit-voting"></i><span class="ml-2">10</span><span class="dot ml-2"></span>
                                                                            <h6 class="ml-2 mt-1">Reply</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
            {/* <!-- Related items section--> */}
            < section class="py-5 bg-light" >
                <div class="container px-4 px-lg-5 mt-5">
                    <h2 class="fw-bolder mb-4">Sản phẩm liên quan</h2>
                    <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                        {
                            relatedProduct && relatedProduct?.length > 0 && relatedProduct.map((item) => {
                                if (!item.isRevoked && item.quantity > 0) {
                                    return (
                                        <div class="col mb-5" key={item._id}>
                                            <div class="card h-100">
                                                {/* <!-- Product image--> */}
                                                <img class="card-img-top"
                                                    src={item?.image?.length > 0 ? item?.image[0] : `https://dummyimage.com/450x300/dee2e6/6c757d.jpg`} alt="..." />
                                                {/* <!-- Product details--> */}
                                                <div class="card-body p-4">
                                                    <div class="text-center">
                                                        {/* <!-- Product name--> */}
                                                        <h5 class="fw-bolder" style={{ cursor: 'pointer' }} onClick={() => handleAccessDetail(item._id)}>{item.title}</h5>
                                                        {/* <!-- Product price--> */}
                                                        {formatter.format(item.price)}
                                                    </div>
                                                </div>
                                                {/* <!-- Product actions--> */}
                                                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                                    <div class="text-center"><a class="btn btn-outline-dark mt-auto" onClick={() => handleAccessDetail(item._id)}>Xem sản phẩm</a></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
            </section >
            <Footer />
        </div >
    );
}

export default Detail;