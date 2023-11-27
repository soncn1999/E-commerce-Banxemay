import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Swal from 'sweetalert2';
import { getDetailOrderApi } from '../../services/product';
import { formatter } from '../../utils/helper';

ModalDetailOrder.propTypes = {

};

function ModalDetailOrder(props) {
    const { editId } = props;
    const [orderDetail, setOrderDetail] = useState({});

    useEffect(() => {
        if (editId) {
            handleGetDetailOrder(editId);
        }
    }, [editId]);

    const handleGetDetailOrder = async (id) => {
        const response = await getDetailOrderApi(id);
        console.log('detail order >>> ', response);
        if (response && response.success) {
            setOrderDetail(response.message);
        }
    }

    const handleIsOpenned = () => {
        props.handleIsOpenned(false);
    }

    return (
        <div>
            <Modal isOpen={true}>
                <ModalHeader>
                    Thông tin đơn hàng {orderDetail._id} &nbsp; &nbsp; Trạng thái: {orderDetail.status}
                </ModalHeader>
                <ModalBody>
                    <>
                        {
                            orderDetail && orderDetail.product?.length > 0 && orderDetail.product.map((item, index) => {
                                return (
                                    <div className="row border-top border-bottom" key={item._id}>
                                        <div className="row main align-Sản phẩm-center">
                                            <div className="col-2">
                                                {
                                                    item?.product?.image?.length > 0 ? <img className="img-fluid" src={item.product.image[0]} /> :
                                                        <img className="img-fluid" src='https://dummyimage.com/450x300/dee2e6/6c757d.jpg' />
                                                }
                                            </div>
                                            <div className="col">
                                                <div className="row text-muted">Màu sắc: {item.color}</div>
                                                <div className="row">{item?.product?.title}</div>
                                            </div>
                                            &nbsp;
                                            <div className="col">
                                                <div className="row text-muted" style={{ fontWeight: '550', fontSize: '12px' }}>Số lượng: {item?.count}</div>
                                            </div>
                                            <div className="col" style={{ fontWeight: '550', fontSize: '12px' }}>{formatter.format(item?.product?.price)}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className="row" style={{ borderTop: "1px solid rgba(0,0,0,.1)", padding: "2vh 0" }}>
                            <div className="col" style={{
                                fontSize: '15px',
                                fontWeight: '550'
                            }}>THANH TOÁN: {orderDetail.totalItem} sản phẩm</div>
                            <div className="col text-right" style={{
                                color: "red",
                                fontSize: "15px",
                                fonteight: '550'
                            }}>{formatter.format(orderDetail.total)}</div>
                        </div>
                    </>

                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => handleIsOpenned()}>
                        Đóng
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalDetailOrder;