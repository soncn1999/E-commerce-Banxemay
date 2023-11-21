import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Order-Style/style.scss';
import { handleGetListOrderApi } from '../../services/product';
import { formatter } from '../../utils/helper';
import { updateOrderApi } from '../../services/product';
import Swal from 'sweetalert2';

ListOrderComplete.propTypes = {

};

function ListOrderComplete(props) {
    const [listOrder, setListOrder] = useState({});

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
            text: "Đơn hàng đang được giao!",
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
                    text: "Đơn hàng đang được giao.",
                    icon: "error"
                });
            }
        });
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
                        {/* <th scope="col">Thao tác</th> */}
                    </tr>
                </thead>
                <tbody>
                    {
                        listOrder && listOrder?.length > 0 && listOrder?.map((item, index) => {
                            if (item.status == 'Successed') {
                                return (
                                    <tr>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item._id}</td>
                                        <td>{item.totalItem}</td>
                                        <td>{formatter.format(item.total)}</td>
                                        <td style={{ fontWeight: '550' }}>{item.isCheckOut ? <span style={{ color: '#198754' }}>Đã thanh toán</span> : <span style={{ color: '#dc3545' }}>Chưa thanh toán</span>}</td>
                                        <td style={{ fontWeight: '550' }}>{item.status}</td>
                                        <td>{item.orderBy.email}</td>
                                        <td style={{ width: '30%' }}>{item.orderBy.address}</td>
                                        {/* <td style={{ width: '10%' }}>
                                            <div className="btn btn-primary" style={{ fontSize: '14px', marginTop: '5px' }} onClick={() => handleChangeStatusOrder('Processing', item._id)}>Hàng đang giao</div>
                                        </td> */}
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

export default ListOrderComplete;