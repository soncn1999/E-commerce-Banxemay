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

Detail.propTypes = {

};

function Detail(props) {
    let { pid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userCart = useSelector((state) => state.user.current);
    const [detailProduct, setDetailProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState()
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

    const handleAddAProduct = async (product) => {
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

    const handleAccessDetail = async (pid) => {
        navigate(`/products/${pid}`);
        await getDetailProduct(pid);
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

                            {/* <div className="lead">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Comment</span>
                                    </div>
                                    <textarea class="form-control" aria-label="With textarea"></textarea>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- Related items section--> */}
            <section class="py-5 bg-light">
                <div class="container px-4 px-lg-5 mt-5">
                    <h2 class="fw-bolder mb-4">Sản phẩm liên quan</h2>
                    <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                        {
                            relatedProduct && relatedProduct?.length > 0 && relatedProduct.map((item) => {
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
                                                    {item.price}
                                                </div>
                                            </div>
                                            {/* <!-- Product actions--> */}
                                            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                                <div class="text-center"><a class="btn btn-outline-dark mt-auto" onClick={() => handleAccessDetail(item._id)}>Xem sản phẩm</a></div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default Detail;