import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getAllProductApi } from '../../services/product';

HandleProductInfo.propTypes = {

};

function HandleProductInfo(props) {
    const [listProduct, setListProduct] = useState({})
    useEffect(() => {
        getAllProduct(1);
    }, []);

    const getAllProduct = async (pageNumber) => {
        let response = await getAllProductApi(pageNumber);
        console.log('check list product >>> ', response);
        if (response && response.success) {
            let { success, ...productCopy } = response;
            setListProduct(productCopy);
        }
    }

    console.log('list product copy >>> ', listProduct);

    return (
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Title</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Price</th>
                    <th scope="col">Sold</th>
                </tr>
            </thead>
            <tbody>
                {
                    listProduct && listProduct.product?.length > 0 && listProduct.product.map((item, index) => {
                        return (
                            <tr key={item._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.title}</td>
                                <td>{item.brand}</td>
                                <td>{item.price}</td>
                                <td>{item.sold}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}

export default HandleProductInfo;