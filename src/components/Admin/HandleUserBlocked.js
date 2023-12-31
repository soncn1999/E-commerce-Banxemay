import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getListCurrentUserApi } from '../../services/user';
import Swal from 'sweetalert2';
import { handleRemoveBlockUserApi } from '../../services/user';
import { Button } from 'reactstrap';

HandleUserBlocked.propTypes = {

};

function HandleUserBlocked(props) {
    const [listUser, setListUser] = useState([]);
    const [userFindingResult, setUserFindingResult] = useState([]);

    useEffect(() => {
        getListCurrentUser();
    }, []);

    const getListCurrentUser = async () => {
        let response = await getListCurrentUserApi();
        console.log('List User Admin Page >>> ', response);
        if (response && response.success) {
            setListUser(response.data);
        }
    }

    const handleBlockUser = async (id) => {
        Swal.fire({
            title: "Do you want to remove block this user?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `Don't remove block`
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                let response = await handleRemoveBlockUserApi(id);
                if (response && response.success) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "This user has removed block",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    getListCurrentUser();
                } else {
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Oops! Something went wrong",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        });
    }

    const handleSearchUser = (data) => {
        let keyword = data.trim();
        let itemIndex = 0;
        // if (keyword.includes('@')) {
        //     itemIndex = 0;
        //     let userResult = listUser.map((user, index) => {
        //         if (user.email.includes(keyword)) {
        //             itemIndex = index;
        //             return;
        //         }
        //     });

        //     console.log('User by Email>>>> ', listUser[itemIndex]);
        //     let userArr = [];
        //     userArr.push(listUser[itemIndex])
        //     setUserFindingResult(userArr);
        // } else 
        if (keyword == '') {
            setUserFindingResult([]);
        } else {
            let userArrFinding = [];
            let userResult = listUser.map((user, index) => {
                if (user.email.includes(keyword)) {
                    userArrFinding.push(user);
                }
            });

            setUserFindingResult(userArrFinding);
        }
    }

    return (
        <>
            {/* Search Container */}
            <div className="search-wrapper">
                <div class="input-group mb-3">
                    <input type="text" class="form-control form-control--display" style={{ fontSize: '14px' }} placeholder="Tìm kiếm bằng email/số điện thoại"
                        aria-label="Search by Email/Phone Number" aria-describedby="basic-addon2" onChange={(event) => handleSearchUser(event.target.value)} />
                    &nbsp;
                    <div class="input-group-append">
                        <button class="btn btn-primary" style={{ marginTop: '0', fontSize: '14px' }} type="button">Tìm kiếm</button>
                    </div>
                </div>

                {
                    userFindingResult && userFindingResult.length > 0 && (
                        <div className="search-result-box">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Mobile</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    userFindingResult && userFindingResult.length > 0 && userFindingResult.map((item) => {
                                        if (item.isBlocked) {
                                            return (
                                                <tr key={item._id}>
                                                    <td>{item.firstname} {item.lastname}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.mobile}</td>
                                                    <td>
                                                        {item.role == 'admin' ? <strong style={{ color: 'red' }}>{item.role}</strong> : <span>{item.role}</span>}
                                                    </td>
                                                    <td>{
                                                        !item.isBlocked ? (<strong>Active</strong>) : (<Button color="success" style={{ marginTop: 0 }} onClick={() => handleBlockUser(item._id)}>
                                                            <i class="fa-solid fa-unlock"></i>
                                                        </Button>)
                                                    }
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
            {/* Search Container */}
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Tên</th>
                        <th scope="col">Email</th>
                        <th scope="col">Số điện thoại</th>
                        <th scope="col">Vai trò</th>
                        <th scope="col">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listUser && listUser.length > 0 && listUser.map((item, index) => {
                            if (item.isBlocked == true) {
                                return (
                                    <tr key={item.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{item.firstname} {item.lastname}</td>
                                        <td>{item.email}</td>
                                        <td>{item.mobile}</td>
                                        <td>{item.role}</td>
                                        <td>
                                            <Button color="primary" style={{ marginTop: 0 }} onClick={() => handleBlockUser(item._id)}>
                                                <i class="fa-solid fa-unlock"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            }
                        })
                    }
                </tbody>
            </table>
        </>
    );
}

export default HandleUserBlocked;