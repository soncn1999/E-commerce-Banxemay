import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getListCurrentUserApi } from '../../services/user';

HandleUserInfo.propTypes = {

};

function HandleUserInfo(props) {
    const [listUser, setListUser] = useState([]);
    useEffect(() => {
        getListCurrentUser();
    }, []);

    const getListCurrentUser = async () => {
        let response = await getListCurrentUserApi();
        console.log('List User >>> ', response);
        if (response && response.success) {
            setListUser(response.data);
        }
    }

    return (
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Mobile</th>
                    <th scope="col">Role</th>
                </tr>
            </thead>
            <tbody>
                {
                    listUser && listUser.length > 0 && listUser.map((item, index) => {
                        return (
                            <tr key={item.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.firstname} {item.lastname}</td>
                                <td>{item.email}</td>
                                <td>{item.mobile}</td>
                                <td>{item.role}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}

export default HandleUserInfo;