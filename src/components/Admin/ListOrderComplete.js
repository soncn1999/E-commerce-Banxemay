import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Order-Style/style.scss';
import { handleGetListOrderApi } from '../../services/product';
import ModalDetailOrder from './ModalDetailOrder';
import { formatter } from '../../utils/helper';
import { updateOrderApi } from '../../services/product';
import Swal from 'sweetalert2';
import { CSVLink, CSVDownload } from "react-csv";
import './Search-Style/style.scss';

ListOrderComplete.propTypes = {

};

function ListOrderComplete(props) {
    const [listOrder, setListOrder] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState('');
    const [listCSV, setListCSV] = useState(
        [
            ["STT", "Mã đơn", "Tên sản phẩm", "Giá", "Số lượng", "Tổng số lượng", "Thanh toán", "Tên khách hàng", "Số điện thoại", "Địa chỉ", "Thời gian đặt hàng"]
        ]
    );

    const [listDetailCSV, setListDetailCSV] = useState(
        [
            ["STT", "Mã đơn", "Tên sản phẩm", "Giá", "Số lượng", "Tổng số lượng", "Thanh toán", "Tên khách hàng", "Số điện thoại", "Địa chỉ", "Thời gian đặt hàng"]
        ]
    );
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

    // const handleChangeStatusOrder = (data, id) => {
    //     const swalWithBootstrapButtons = Swal.mixin({
    //         customClass: {
    //             confirmButton: btn btn-success",
    //             cancelButton: "btn btn-danger"
    //         },
    //         buttonsStyling: false
    //     });
    //     swalWithBootstrapButtons.fire({
    //         title: "Xác nhận?",
    //         text: "Đơn hàng đang được giao!",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonText: "Đúng!",
    //         cancelButtonText: "Không!",
    //         reverseButtons: true
    //     }).then(async (result) => {
    //         if (result.isConfirmed) {
    //             const response = await updateOrderApi(id, {
    //                 status: data
    //             });
    //             if (response && response.success) {
    //                 swalWithBootstrapButtons.fire({
    //                     title: "Thành công!",
    //                     text: "Xác nhận đơn hàng đang giao.",
    //                     icon: "success"
    //                 });
    //                 await handleGetListOrder();
    //             } else {
    //                 swalWithBootstrapButtons.fire({
    //                     title: "Thất bại",
    //                     text: "Chưa xác nhận được đơn hàng",
    //                     icon: "error"
    //                 });
    //             }
    //         } else if (
    //             /* Read more about handling dismissals below */
    //             result.dismiss === Swal.DismissReason.cancel
    //         ) {
    //             swalWithBootstrapButtons.fire({
    //                 title: "Đã hủy",
    //                 text: "Đơn hàng đang được giao.",
    //                 icon: "error"
    //             });
    //         }
    //     });
    // }

    const handleOpenModal = (id) => {
        setIsModalOpen(true);
        setEditId(id);
    }

    const handleIsOpenned = async (data) => {
        setIsModalOpen(false);
    }

    const handleExportListData = () => {
        setListCSV(
            [
                ["STT", "Mã đơn", "Tên sản phẩm", "Giá", "Số lượng", "Tổng số lượng", "Thanh toán", "Tên khách hàng", "Số điện thoại", "Địa chỉ", "Thời gian đặt hàng"]
            ]
        )
        let listOrderFilter = listOrder.filter((item) => {
            return item.status == 'Successed';
        });

        let listOrderConvertCSV = [];

        listOrderFilter.forEach((item) => {
            item.product.forEach((itemChild, index) => {
                listOrderConvertCSV.push([`${index + 1}`, `${item._id}`, `${itemChild.product?.title}`, `${itemChild.product?.price}`, `${itemChild.count}`, `${item.totalItem}`, `${item.total}`, `${item.orderBy.firstname} ${item.orderBy.lastname}`, `${item.orderBy.mobile}`, `${item.orderBy.address}`, `${item.createdAt}`]);
            });
        });

        let listCSVCopy = [...listCSV];
        if (listOrderConvertCSV.length > 0) {
            listCSVCopy = [...listCSVCopy, ...listOrderConvertCSV];

            setListCSV(listCSVCopy);
        }
    }

    const handleExportDetailData = (id) => {
        setListCSV(
            [
                ["STT", "Mã đơn", "Tên sản phẩm", "Giá", "Số lượng", "Tổng số lượng", "Thanh toán", "Tên khách hàng", "Số điện thoại", "Địa chỉ", "Thời gian đặt hàng"]
            ]
        )

        let detailOrder = listOrder.find((item) => {
            return item._id === id;
        });

        console.log('Detail Order >>> ', detailOrder);

        let detailConvertCSV = [];

        detailOrder.product?.forEach((item, index) => {
            detailConvertCSV.push([`${index + 1}`, `${detailOrder._id}`, `${item.product?.title}`, `${item.product?.price}`, `${item.count}`, `${detailOrder.totalItem}`, `${detailOrder.total}`, `${detailOrder.orderBy.firstname} ${detailOrder.orderBy.lastname}`, `${detailOrder.orderBy.mobile}`, `${detailOrder.orderBy.address}`, `${detailOrder.createdAt}`]);
        });

        let listDetailCSVCopy = [...listDetailCSV];
        if (detailConvertCSV.length > 0) {
            listDetailCSVCopy = [...listDetailCSVCopy, ...detailConvertCSV];
            setListDetailCSV(listDetailCSVCopy);
        }
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
                                    <tr style={{ fontSize: '12px' }}>
                                        <th scope="col">STT</th>
                                        <th scope="col">Mã đơn</th>
                                        <th scope="col">Số lượng</th>
                                        <th scope="col">Giá trị</th>
                                        <th scope="col">Thanh toán</th>
                                        <th scope="col">Trạng thái</th>
                                        <th scope="col">Khách mua</th>
                                        <th scope="col">Số điện thoại</th>
                                        <th scope="col">Địa chỉ</th>
                                        <th scope="col">Chi tiết</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orderFindingResult && orderFindingResult.length > 0 && orderFindingResult.map((item, index) => {
                                            if (item.status == 'Successed') {
                                                return (
                                                    <tr style={{ fontSize: '11px' }}>
                                                        <th scope="row">{index + 1}</th>
                                                        <td>{item._id}</td>
                                                        <td>{item.totalItem}</td>
                                                        <td>{formatter.format(item.total)}</td>
                                                        <td style={{ fontWeight: '550' }}>{item.isCheckOut ? <span style={{ color: '#198754' }}>Đã thanh toán</span> : <span style={{ color: '#dc3545' }}>Chưa thanh toán</span>}</td>
                                                        <td style={{ fontWeight: '550' }}>{item.status}</td>
                                                        <td>{item.orderBy.firstname} {item.orderBy.lastname}</td>
                                                        <td>{item.orderBy.mobile}</td>
                                                        <td style={{ width: '30%' }}>{item.orderBy.address}</td>
                                                        <td style={{ width: '15%' }}>
                                                            <div className="btn btn-warning" style={{ fontSize: '14px', marginTop: '5px' }} onClick={() => handleOpenModal(item._id)}>Chi tiết</div>
                                                            {
                                                                editId && isModalOpen && <ModalDetailOrder handleIsOpenned={handleIsOpenned} editId={editId} />
                                                            }
                                                            <div class="btn btn-success" style={{ fontSize: '14px', marginTop: '5px' }} onClick={() => handleExportDetailData(item._id)}>
                                                                <CSVLink data={listDetailCSV} style={{ textDecoration: 'none', color: '#fff' }} filename={`ChiTietDonHang-${item._id}-${item.orderBy.firstname} ${item.orderBy.lastname}`}>Xuất file Excel</CSVLink>
                                                            </div>
                                                        </td>
                                                        <hr />
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

                <div class="btn btn-success" style={{ fontSize: '14px', marginTop: '5px', width: '15%', marginBottom: '10px' }} onClick={() => handleExportListData()}>
                    <CSVLink data={listCSV}
                        style={{ textDecoration: 'none', color: '#fff' }}
                        filename={`DSDonHang`}>Xuất DS Excel</CSVLink>
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
                        <th scope="col">Số điện thoại</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">Chi tiết</th>
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
                                        <td>{item.orderBy.firstname} {item.orderBy.lastname}</td>
                                        <td>{item.orderBy.mobile}</td>
                                        <td style={{ width: '30%' }}>{item.orderBy.address}</td>
                                        <td style={{ width: '15%' }}>
                                            <div className="btn btn-warning" style={{ fontSize: '14px', marginTop: '5px' }} onClick={() => handleOpenModal(item._id)}>Chi tiết</div>
                                            {
                                                editId && isModalOpen && <ModalDetailOrder handleIsOpenned={handleIsOpenned} editId={editId} />
                                            }
                                            <div class="btn btn-success" style={{ fontSize: '14px', marginTop: '5px' }} onClick={() => handleExportDetailData(item._id)}>
                                                <CSVLink data={listDetailCSV} style={{ textDecoration: 'none', color: '#fff' }} filename={`ChiTietDonHang-${item._id}-${item.orderBy.firstname} ${item.orderBy.lastname}`}>Xuất file Excel</CSVLink>
                                            </div>
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

export default ListOrderComplete;