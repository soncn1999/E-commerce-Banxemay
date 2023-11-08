import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Content-style/style.css';
import { getAllProductApi } from '../services/product';
import { useNavigate } from 'react-router-dom';
import { formatter } from '../utils/helper';

Content.propTypes = {

};

function Content(props) {
    const navigate = useNavigate();
    const [listProduct, setListProduct] = useState({});

    useEffect(() => {
        getAllProduct(3);
    }, []);

    const getAllProduct = async (page = 1) => {
        let response = await getAllProductApi(page);
        if (response && response.success) {
            const { success, total, page, product } = response;
            setListProduct(product);
        }
    }
    console.log('check all products >>> ', listProduct);

    const handleAccessDetail = (pid) => {
        navigate(`/products/${pid}`);
    }

    return (
        <section class="py-5">
            <div class="container px-4 px-lg-5 mt-5">
                <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                    {
                        listProduct && listProduct?.length > 0 && listProduct.map((item) => {
                            return (
                                <div class="col mb-5">
                                    <div class="card h-100">
                                        {/* <!-- Sale badge--> */}
                                        <div class="badge bg-dark text-white position-absolute" style={{ top: "0.5rem", right: "0.5rem" }}>Sale</div>
                                        {/* <!-- Product image--> */}
                                        <img class="card-img-top"
                                            src={item?.image?.length > 0 ? item?.image[0] : `https://dummyimage.com/450x300/dee2e6/6c757d.jpg`} alt="..." />
                                        {/* <!-- Product details--> */}
                                        <div class="card-body p-4">
                                            <div class="text-center">
                                                {/* <!-- Product name--> */}
                                                <h5 class="fw-bolder" style={{ cursor: 'pointer' }} onClick={() => handleAccessDetail(item._id)}>{item.title}</h5>
                                                {/* <!-- Product reviews--> */}
                                                <div class="d-flex justify-content-center small text-warning mb-2">
                                                    <div class=""><i class="fa-regular fa-star"></i></div>
                                                    <div class=""><i class="fa-regular fa-star"></i></div>
                                                    <div class=""><i class="fa-regular fa-star"></i></div>
                                                    <div class=""><i class="fa-regular fa-star"></i></div>
                                                    <div class=""><i class="fa-regular fa-star"></i></div>
                                                </div>
                                                {/* <!-- Product price--> */}
                                                <span class="text-muted text-decoration-line-through">{formatter.format(item.price - 10)}</span>
                                                &nbsp;
                                                {formatter.format(item.price)}
                                            </div>
                                        </div>
                                        {/* <!-- Product actions--> */}
                                        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                            <div class="text-center">
                                                <span class="btn btn-outline-dark mt-auto" onClick={() => handleAccessDetail(item._id)}>
                                                    <i class="fa-solid fa-cart-shopping"></i>
                                                    &nbsp;
                                                    Mua ngay
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    );
}

export default Content;