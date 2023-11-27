import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import { getAllProductForSearchApi, getProductBestSeller, handleGetListOrderApi } from '../../services/product';
import {
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './chart-style/style.scss';
import ModalDetailOrder from '../../components/Admin/ModalDetailOrder';
import { formatter } from '../../utils/helper';

ChartComponent.propTypes = {

};

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: '',
        },
    },
};



function ChartComponent(props) {
    const [listProduct, setListProduct] = useState([]);
    // Lượng sp tồn kho
    const [inventory, setInventory] = useState(0);
    // Lượng sp đã bán
    const [sold, setSold] = useState(0);

    const [productLabelBar, setProductLabelBar] = useState(
        ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September']
    );

    const [productInventoryBar, setProductInventoryBar] = useState([200, 102, 103, 104, 105, 106, 107, 108, 109]);
    const [productSoldBar, setProductSoldBar] = useState([200, 102, 103, 104, 105, 106, 107, 108, 109]);

    const [order, setOrder] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editId, setEditId] = useState('');

    const data = {
        labels: ['Tồn kho', 'Đã bán'],
        datasets: [
            {
                label: '# Số lượng sản phẩm',
                data: [inventory, sold],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const labels = productLabelBar;

    const dataBar = {
        labels,
        datasets: [
            {
                label: 'Tồn kho',
                data: productInventoryBar,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Bán ra',
                data: productSoldBar,
                backgroundColor: 'rgba(153, 102, 255, 1)',
            },
        ],
    };

    useEffect(() => {
        handleGetListProduct();
        handleGetListBestSeller('-');
        hanldeGetListOrder();
    }, []);

    const handleGetListProduct = async () => {
        let response = await getAllProductForSearchApi();
        if (response && response.success) {
            let productAll = response.message;

            let product = handleFilterNotRevokedProduct(productAll);

            setListProduct(product);

            let productInventory = product.reduce((total, item) => {
                return total + item.quantity;
            }, 0);

            if (productInventory > 0) {
                setInventory(productInventory);
            }

            let productSold = product.reduce((total, item) => {
                return total + item.sold;
            }, 0);

            if (productSold > 0) {
                setSold(productSold);
            }
        }
    }

    const handleGetListBestSeller = async (operator) => {
        let response = await getProductBestSeller(operator);
        if (response && response.success) {
            let productAll = response.product;
            let product = handleFilterNotRevokedProduct(productAll);

            console.log('List bestseller after filtering >>> ', product);
            let productLabelBarFilter = product.map((item) => {
                return item.title;
            });

            setProductLabelBar(productLabelBarFilter);

            let productInventoryBarFilter = product.map((item) => {
                return item.quantity;
            });

            setProductInventoryBar(productInventoryBarFilter);

            let productSoldBarFilter = product.map((item) => {
                return item.sold;
            });

            setProductSoldBar(productSoldBarFilter);
        }
    }

    const handleFilterNotRevokedProduct = (listProduct) => {
        let productArrFilter = [];

        let productArrFiltering = listProduct.map((item) => {
            if (!item.isRevoked) {
                productArrFilter.push(item);
            }
            return;
        });

        return productArrFilter;
    }

    const hanldeGetListOrder = async () => {
        let response = await handleGetListOrderApi();
        if (response && response.success) {
            let orders = response.listOrder;

            let orderArr = [];

            let orderFilter = orders.map((item) => {
                if (item.status == "Successed") {
                    orderArr.push(item);
                }
                return;
            });

            orderArr.sort(function (a, b) { return a.total - b.total }).reverse();

            setOrder(orderArr);
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
        <div>
            <div className="chart-container">
                <div className="chart-left">
                    <div className="chart-item"><Pie data={data} /></div>
                    <div className="chart-desc">Thống kê số lượng bán ra/tồn kho</div>
                </div>
                <div className="chart-right">
                    <div className="chart-item"><Bar options={options} data={dataBar} /></div>
                    <div className="chart-desc">Thống kê sản phẩm bán chạy nhất</div>
                </div>
            </div>
            <div className="statistical-container">
                <div className="statistical-container__title">
                    Thống kê đơn hàng có giá trị cao nhất
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
                            order && order?.length > 0 && order?.map((item, index) => {
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
                                            </td>
                                        </tr>
                                    )
                                }
                            })
                        }

                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ChartComponent;