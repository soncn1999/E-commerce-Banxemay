import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getAllProductApi, getAllProductForSearchApi } from '../../services/product';
import ModalEditProduct from './ModalEditProduct';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { deleteProductApi } from '../../services/product';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import './Search-Style/style.scss';
import { formatter } from '../../utils/helper';

HandleProductRevoked.propTypes = {

};

function HandleProductRevoked(props) {
    const [listProduct, setListProduct] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listProductSearch, setListProductSearch] = useState([]);
    const [editId, setEditId] = useState('');
    const [pageInfo, setPageInfo] = useState({});
    const [productFindingResult, setProductFindingResult] = useState([]);
    const [isOpenSearch, setIsOpenSearch] = useState(false);

    useEffect(() => {
        getAllProduct(1);
        getAllProductForSearch();
    }, []);

    const getAllProduct = async (pageNumber) => {
        let response = await getAllProductApi(pageNumber);
        console.log('check list product >>> ', response);
        if (response && response.success) {
            let { success, ...productCopy } = response;
            const { total, page } = response;
            setListProduct(productCopy);
            setPageInfo({
                total, page
            })
        }
    }
    const getAllProductForSearch = async () => {
        let response = await getAllProductForSearchApi();

        if (response && response.success) {
            setListProductSearch(response.message);
        }
    }

    const handleOpenModal = (id) => {
        setIsModalOpen(true);
        setEditId(id);
    }

    const handleIsOpenned = async (data) => {
        setIsModalOpen(false);
        await getAllProduct();
    }

    const handleDeleteProduct = async (id) => {
        if (id) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await deleteProductApi(id);
                    if (response && response.success) {
                        await getAllProduct();
                        swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                    } else {
                        swalWithBootstrapButtons.fire({
                            title: "Oops",
                            text: "Something went wrong :)",
                            icon: "error"
                        });
                    }
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Cancelled",
                        text: "Your imaginary file is safe :)",
                        icon: "error"
                    });
                }
            });
        }
    }

    const handlePageClick = async (event) => {
        await getAllProduct(event.selected + 1)
    };

    const handleSearchProduct = (data) => {
        const keyword = data.trim().toLowerCase();

        let productResult = [];
        let productFilter = listProductSearch.map((item) => {
            if (item.title.toLowerCase().includes(keyword)) {
                productResult.push(item);
            }
        });

        if (productResult.length == listProductSearch.length) {
            setIsOpenSearch(false);
            setProductFindingResult([]);
        } else {
            setIsOpenSearch(true);
            setProductFindingResult(productResult);
        }
    }

    return (
        <>
            <div className="search-wrapper">
                <div class="input-group mb-3">
                    <input type="text" class="form-control form-control--display" style={{ fontSize: '14px' }} placeholder="Tìm kiếm theo tên sản phẩm"
                        aria-label="Tìm kiếm theo tên sản phẩm" aria-describedby="basic-addon2" onChange={(event) => handleSearchProduct(event.target.value)} />
                    &nbsp;
                    <div class="input-group-append">
                        <button class="btn btn-primary" style={{ marginTop: '0', fontSize: '14px' }} type="button">Tìm sản phẩm</button>
                    </div>
                </div>

                {
                    isOpenSearch && productFindingResult && productFindingResult.length > 0 && (
                        <div className="search-result-box">
                            <thead>
                                <tr>
                                    <th scope="col">Tên</th>
                                    <th scope="col">Giá bán</th>
                                    <th scope="col">Số lượng</th>
                                    <th scope="col">Đã bán</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    productFindingResult && productFindingResult.length > 0 && productFindingResult.map((item) => {
                                        if (item.isRevoked) {
                                            return (
                                                <tr key={item._id}>
                                                    <td>{item.title}</td>
                                                    <td>{formatter.format(item.price)}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.sold}</td>
                                                    <td scope="row" style={{ fontWeight: '550' }}>{item.isRevoked ? `Thu hồi` : `Đang kinh doanh`}</td>
                                                    <td>
                                                        <Button color="info" style={{ marginTop: 0 }} onClick={() => handleOpenModal(item._id)}>
                                                            <i class="fa-solid fa-pen-to-square"></i>
                                                        </Button>
                                                        {
                                                            editId && isModalOpen && <ModalEditProduct handleIsOpenned={handleIsOpenned} editId={editId} />
                                                        }
                                                        <button style={{ marginTop: '5px' }} type="button" class="btn btn-danger" onClick={() => handleDeleteProduct(item._id)}>
                                                            <i class="fa-solid fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }

                                    })
                                }
                            </tbody>

                        </div>
                    )
                }
            </div>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Tiêu đề</th>
                        <th scope="col">Nhãn hiệu</th>
                        <th scope="col">Giá</th>
                        <th scope="col">Số lượng</th>
                        <th scope="col">Đã bán</th>
                        <th scope="col">Trạng thái</th>
                        {/* <th scope="col">Thao tác</th> */}
                    </tr>
                </thead>
                <tbody>
                    {
                        listProduct && listProduct.product?.length > 0 && listProduct.product.map((item, index) => {
                            if (item.isRevoked) {
                                return (
                                    <Fragment>
                                        <tr key={item._id}>
                                            <th scope="row">{index + 1}</th>
                                            <td scope="row">{item.title}</td>
                                            <td scope="row">{item.brand}</td>
                                            <td scope="row">{formatter.format(item.price)}</td>
                                            <td scope="row">{item.quantity}</td>
                                            <td scope="row">{item.sold}</td>
                                            <td scope="row" style={{ fontWeight: '550' }}>{item.isRevoked ? `Thu hồi` : `Đang kinh doanh`}</td>
                                            {/* <td scope="row">
                                            <Button color="info" style={{ marginTop: 0 }} onClick={() => handleOpenModal(item._id)}>
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </Button>
                                            {
                                                editId && isModalOpen && <ModalEditProduct handleIsOpenned={handleIsOpenned} editId={editId} />
                                            }
                                            <button style={{ marginTop: '5px' }} type="button" class="btn btn-danger" onClick={() => handleDeleteProduct(item._id)}>
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </td> */}
                                        </tr>
                                    </Fragment>
                                )
                            }
                        })
                    }
                </tbody>
            </table>
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

export default HandleProductRevoked;