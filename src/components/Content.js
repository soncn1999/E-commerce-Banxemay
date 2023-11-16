import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Content-style/style.css';
import { getAllProductApi, getListBrandApi, getListProductRelateBrandApi, getListProductSortByPriceApi } from '../services/product';
import { useNavigate } from 'react-router-dom';
import { formatter } from '../utils/helper';
import ReactPaginate from 'react-paginate';

Content.propTypes = {

};

function Content(props) {
    const navigate = useNavigate();
    const [listProduct, setListProduct] = useState({});
    const [pageInfo, setPageInfo] = useState({});
    const [brand, setBrand] = useState([]);

    useEffect(() => {
        getAllProduct();
        getListBrand();
    }, []);

    const getAllProduct = async (page = 1) => {
        let response = await getAllProductApi(page);
        if (response && response.success) {
            const { success, total, page, product } = response;
            setListProduct(product);
            setPageInfo({
                total, page
            })
        }
    }

    const getListBrand = async () => {
        let response = await getListBrandApi();
        if (response && response.success) {
            let { data } = response;
            setBrand(data);
        }
    }

    console.log('check page info >>> ', pageInfo);

    const handleAccessDetail = (pid) => {
        navigate(`/products/${pid}`);
    }

    const handlePageClick = async (event) => {
        await getAllProduct(event.selected + 1)
    };

    const fireSortByBrand = async (data) => {
        if (data !== '') {
            let response = await getListProductRelateBrandApi(data);
            if (response && response.success) {
                const { success, total, page, product } = response;
                setListProduct(product);
                setPageInfo({
                    total, page
                })
            }
        }
    }

    const fireSortByPrice = async (data) => {
        if (data !== '') {
            let response = await getListProductSortByPriceApi(data);
            if (response && response.success) {
                const { success, total, page, product } = response;
                setListProduct(product);
                setPageInfo({
                    total, page
                })
            }
        }
    }

    return (
        <>
            <section class="py-5">
                <div class="container px-4 px-lg-5 mt-5">
                    {/* Filter Product */}
                    <div className="filter-wrapper">
                        <span className="form-select-title">Lọc sản phẩm theo: </span>
                        &nbsp;
                        <select class="form-select form-select-brand" aria-label="Default select example" onChange={(event) => fireSortByBrand(event.target.value)}>
                            <option selected value={0}>Hãng sản xuất</option>
                            {
                                brand && brand?.length > 0 && brand.map((item) => {
                                    return (<option value={item.title}>{item.title}</option>)
                                })
                            }
                        </select>
                        &nbsp;
                        <select class="form-select form-select-price-sort" aria-label="Default select example" onChange={(event) => fireSortByPrice(event.target.value)}>
                            <option selected>Giá</option>
                            <option value="+price">Giá tăng dần</option>
                            <option value="-price">Giá giảm dần</option>
                        </select>
                    </div>
                    {/* End Filter Product */}
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
            </section >
            <section className="py-5" style={{ display: "flex" }}>
                <div style={{ margin: 'auto', fontSize: '20px' }}>
                    <ReactPaginate
                        nextLabel="next >"
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={6}
                        marginPagesDisplayed={2}
                        pageCount={pageInfo.total}
                        previousLabel="< previous"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                    />
                </div>
            </section>
        </>
    );
}

export default Content;