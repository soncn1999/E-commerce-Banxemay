import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Order-Style/style.scss';
import { handleGetListOrderApi } from '../../services/product';
import { formatter } from '../../utils/helper';
import { updateOrderApi } from '../../services/product';
import Swal from 'sweetalert2';

ListOrderCancel.propTypes = {

};

function ListOrderCancel(props) {
    const [listOrder, setListOrder] = useState({});
    const [orderFindingResult, setOrderFindingResult] = useState([]);


    useEffect(() => {
        handleGetListOrder();
    }, []);

    const handleGetListOrder = async () => {
        let response = await handleGetListOrderApi();
        if (response && response.success) {
            setListOrder(response.listOrder);
        }
    }

    const handleChangeStatusOrder = (data, id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Xác nhận?",
            text: "Đơn hàng sẽ tiếp tục giao!",
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
                        text: "Xác nhận đơn hàng đang giao.",
                        icon: "success"
                    });
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
                    text: "Đơn hàng vẫn đang hủy.",
                    icon: "error"
                });
            }
        });
    }

    const handleSearchOrder = (data) => {
        let keyword = data.trim();
        if (keyword == '') {
            setOrderFindingResult([]);
        } else {
            let orderArrFinding = [];
            let orderResult = listOrder?.map((order, index) => {
                if (order?.orderBy?.email.includes(keyword)) {
                    orderArrFinding.push(order);
                }
            });

            setOrderFindingResult(orderArrFinding);
        }
    }

    return (
        <div className="order-container">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="search-wrapper">
                    <div class="input-group mb-3">
                        <input type="text" class="form-control form-control--display" style={{ fontSize: '14px' }} placeholder="Tìm kiếm đơn hàng"
                            aria-label="Search by Email/Phone Number" aria-describedby="basic-addon2" onChange={(event) => handleSearchOrder(event.target.value)} />
                        &nbsp;
                        <div class="input-group-append">
                            <button class="btn btn-primary" style={{ marginTop: '0', fontSize: '14px' }} type="button">Tìm kiếm</button>
                        </div>
                    </div>

                    {
                        orderFindingResult && orderFindingResult.length > 0 && (
                            <div className="search-result-box">
                                <thead>
                                    <tr style={{ fontSize: '11px' }}>
                                        <th scope="col">STT</th>
                                        <th scope="col">Mã đơn</th>
                                        <th scope="col">Số lượng</th>
                                        <th scope="col">Giá trị</th>
                                        <th scope="col">Thanh toán</th>
                                        <th scope="col">Trạng thái</th>
                                        <th scope="col">Khách mua</th>
                                        <th scope="col">Số điện thoại</th>
                                        <th scope="col">Địa chỉ</th>
                                        <th scope="col">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody style={{ fontSize: '11px' }}>
                                    {
                                        orderFindingResult && orderFindingResult.length > 0 && orderFindingResult.map((item, index) => {
                                            if (item.status == 'Cancelled') {
                                                return (
                                                    <tr>
                                                        <th scope="row">{index + 1}</th>
                                                        <th>{item._id}</th>
                                                        <td>{item.totalItem}</td>
                                                        <td>{formatter.format(item.total)}</td>
                                                        <td style={{ fontWeight: '550' }}>{item.isCheckOut ? <span style={{ color: '#198754' }}>Đã thanh toán</span> : <span style={{ color: '#dc3545' }}>Chưa thanh toán</span>}</td>
                                                        <td style={{ fontWeight: '550' }}>{item.status}</td>
                                                        <td>{item.orderBy.firstname} {item.orderBy.lastname}</td>
                                                        <td>{item.orderBy.mobile}</td>
                                                        <td style={{ width: '30%' }}>{item.orderBy.address}</td>
                                                        <td style={{ width: '10%' }}>
                                                            <div className="btn btn-primary" style={{ fontSize: '14px', marginTop: '5px' }} onClick={() => handleChangeStatusOrder('Processing', item._id)}>Tiếp tục giao hàng</div>
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
            </div>
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
                            if (item.status == 'Cancelled') {
                                return (
                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item._id}</td>
                                        <td>{item.totalItem}</td>
                                        <td>{formatter.format(item.total)}</td>
                                        <td style={{ fontWeight: '550' }}>{item.isCheckOut ? <span style={{ color: '#198754' }}>Đã thanh toán</span> : <span style={{ color: '#dc3545' }}>Chưa thanh toán</span>}</td>
                                        <td style={{ fontWeight: '550' }}>{item.status}</td>
                                        <td>{item.orderBy.firstname} {item.orderBy.lastname}</td>
                                        <td style={{ width: '30%' }}>{item.orderBy.address}</td>
                                        <td style={{ width: '10%' }}>
                                            <div className="btn btn-primary" style={{ fontSize: '14px', marginTop: '5px' }} onClick={() => handleChangeStatusOrder('Processing', item._id)}>Tiếp tục giao hàng</div>
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

export default ListOrderCancel;