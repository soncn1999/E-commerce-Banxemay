import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Order-Style/style.scss';
import { handleGetListOrderApi } from '../../services/product';
import { formatter } from '../../utils/helper';
import { updateOrderApi } from '../../services/product';
import Swal from 'sweetalert2';
import ModalDetailOrder from './ModalDetailOrder';
import { updateProductApi } from '../../services/product';

ListOrderIncomplete.propTypes = {

};

function ListOrderIncomplete(props) {
    const [listOrder, setListOrder] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState('');

    useEffect(() => {
        handleGetListOrder();
    }, []);

    const handleGetListOrder = async () => {
        let response = await handleGetListOrderApi();

        console.log('check list order', response);

        if (response && response.success) {
            setListOrder(response.listOrder);
        }
    }

    const handleChangeStatusOrder = async (data, id, order) => {
        if (data == 'Successed') {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: "Xác nhận?",
                text: "Đơn hàng đã được giao!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Đúng!",
                cancelButtonText: "Không!",
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { product } = order;
                    // console.log('product >>> ', product);
                    let listProduct = product.map((item) => {
                        return {
                            _id: item.product._id,
                            sold: +(item.product?.sold + item.count),
                            quantity: +(item.product.quantity - item.count),
                        }
                    });

                    // console.log('list product >>> ', listProduct);
                    const response = await updateOrderApi(id, {
                        status: data
                    });
                    if (response && response.success) {
                        swalWithBootstrapButtons.fire({
                            title: "Thành công!",
                            text: "Xác nhận đơn hàng đã giao.",
                            icon: "success"
                        });
                        const status = true;
                        listProduct?.length > 0 && listProduct.forEach(async (item) => {
                            let { _id, ...dataCopy } = item;
                            const responseSetQuantity = await updateProductApi(dataCopy, _id);
                            if (response && !responseSetQuantity.success) {
                                status = false;
                            }
                            console.log('responseSetQuantity >>>', responseSetQuantity);
                        });

                        if (!status) {
                            swalWithBootstrapButtons.fire({
                                title: "Thất bại",
                                text: "Lỗi cập nhật số lượng đơn hàng",
                                icon: "error"
                            });
                        }

                        await handleGetListOrder();
                    } else {
                        swalWithBootstrapButtons.fire({
                            title: "Thất bại",
                            text: "Chưa xác nhận được đơn hàng",
                            icon: "error"
                        });
                    }
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Đã hủy",
                        text: "Đơn hàng vẫn chưa giao.",
                        icon: "error"
                    });
                }
            });
        } else if (data == 'Cancelled') {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: "Xác nhận?",
                text: "Hủy Đơn hàng đang giao.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Đúng!",
                cancelButtonText: "Không!",
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await updateOrderApi(id, {
                        status: data
                    });
                    if (response && response.success) {
                        swalWithBootstrapButtons.fire({
                            title: "Thành công!",
                            text: "Xác nhận hủy đơn hàng đang giao.",
                            icon: "success"
                        });
                        await handleGetListOrder();
                    } else {
                        swalWithBootstrapButtons.fire({
                            title: "Thất bại",
                            text: "Chưa xác nhận hủy được đơn hàng",
                            icon: "error"
                        });
                    }
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire({
                        title: "Đã hủy",
                        text: "Đơn hàng vẫn đang giao.",
                        icon: "error"
                    });
                }
            });
        }
    }

    const handleOpenModal = (id) => {
        setIsModalOpen(true);
        setEditId(id);
    }

    const handleIsOpenned = async (data) => {
        setIsModalOpen(false);
    }

    return (
        <div className="order-container">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Mã đơn</th>
                        <th scope="col">Số lượng</th>
                        <th scope="col">Giá trị</th>
                        <th scope="col">Thanh toán</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Khách mua</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listOrder && listOrder?.length > 0 && listOrder?.map((item, index) => {
                            if (item.status == 'Processing') {
                                return (

                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <th>{item._id}</th>
                                        <td>{item.totalItem}</td>
                                        <td>{formatter.format(item.total)}</td>
                                        <td style={{ fontWeight: '550' }}>{item.isCheckOut ? <span style={{ color: '#198754' }}>Đã thanh toán</span> : <span style={{ color: '#dc3545' }}>Chưa thanh toán</span>}</td>
                                        <td style={{ fontWeight: '550' }}>{item.status}</td>
                                        <td>{item.orderBy.email}</td>
                                        <td style={{ width: '30%' }}>{item.orderBy.address}</td>
                                        <td style={{ width: '10%' }}>
                                            {
                                                item.isCheckOut ? <div className="btn btn-success disabled" style={{ fontSize: '14px', marginTop: '5px' }}>Thanh toán</div> : <div className="btn btn-success" style={{ fontSize: '14px', marginTop: '5px' }}>Thanh toán</div>
                                            }
                                            <div className="btn btn-primary" style={{ fontSize: '14px', marginTop: '5px' }} onClick={() => handleChangeStatusOrder('Successed', item._id, item)}>Nhận hàng</div>
                                            <div className="btn btn-danger" style={{ fontSize: '14px', marginTop: '5px' }} onClick={() => handleChangeStatusOrder('Cancelled', item._id)}>Hủy đơn</div>
                                            <div className="btn btn-warning" style={{ fontSize: '14px', marginTop: '5px' }} onClick={() => handleOpenModal(item._id)}>Chi tiết</div>
                                            {
                                                editId && isModalOpen && <ModalDetailOrder handleIsOpenned={handleIsOpenned} editId={editId} />
                                            }
                                        </td>
                                    </tr>
                                )
                            }
                        })
                    }

                </tbody>
            </table>
        </div>
    );
}

export default ListOrderIncomplete;