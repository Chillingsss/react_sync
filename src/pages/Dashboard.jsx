import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUser, faBell, faSignOutAlt, faMessage, faSignOut, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { MdHome } from 'react-icons/md';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, Image, Row } from 'react-bootstrap';
import UserPost from './UserPost';
import CreatePost from './CreatePost';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { Home } from 'react-feather';


import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

library.add(faHome, faUser, faBell, faSignOutAlt);

function Dashboard() {

    const navigateTo = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const [userFirstname, setUserFirstname] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);
    const dropdownRef = useRef(null);

    const [selectedPost, setSelectedPost] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const usersFirstname = localStorage.getItem('Firstname') || '';
    const userMiddlename = localStorage.getItem('Middlename') || '';
    const userLastname = localStorage.getItem('Lastname') || '';
    const userEmail = localStorage.getItem('Email') || '';
    const userCpNumber = localStorage.getItem('Cpnumber') || '';
    const userUsername = localStorage.getItem('Username') || '';
    const userPassword = localStorage.getItem('Password') || '';
    const userImage = localStorage.getItem('ProfilePic') || '';

    const [isNameHighlighted, setIsNameHighlighted] = useState(false);

    const [updatedProfilePicture, setUpdatedProfilePicture] = useState(null);

    const [showUpdateDetailsModal, setShowUpdateDetailsModal] = useState(false);
    const [updatedUserDetails, setUpdatedUserDetails] = useState({
        firstname: usersFirstname,
        middlename: userMiddlename,
        lastname: userLastname,
        email: userEmail,
        cpnumber: userCpNumber,
        username: userUsername,
        password: userPassword
    });

    const handleOpenUpdateDetailsModal = () => {
        setShowUpdateDetailsModal(true);
    };


    const handleCloseUpdateDetailsModal = () => {
        setShowUpdateDetailsModal(false);
    };

    const handleUpdateUserDetails = () => {
        const isEmptyField = Object.values(updatedUserDetails).some(value => value === '');
        if (isEmptyField) {
            toast.error('Please fill in all fields.');
            return;
        }

        const formData = new FormData();
        formData.append("operation", "updateDetails");
        formData.append("json", JSON.stringify({
            "updatedFirstname": updatedUserDetails.firstname,
            "updatedMiddlename": updatedUserDetails.middlename,
            "updatedLastname": updatedUserDetails.lastname,
            "updatedEmail": updatedUserDetails.email,
            "updatedCpnumber": updatedUserDetails.cpnumber,
            "updatedUsername": updatedUserDetails.username,
            "updatedPassword": updatedUserDetails.password,
            "userId": sessionStorage.getItem("id")
        }));


        if (updatedProfilePicture) {
            formData.append('profilePicture', updatedProfilePicture);
        }

        axios.post('http://localhost/api/user.php', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        })
            .then(function (response) {
                console.log(response.data);

                // Update local storage with new details
                localStorage.removeItem('Firstname');
                localStorage.removeItem('Middlename');
                localStorage.removeItem('Lastname');
                localStorage.removeItem('Email');
                localStorage.removeItem('Cpnumber');
                localStorage.removeItem('Username');

                localStorage.setItem('Firstname', updatedUserDetails.firstname);
                localStorage.setItem('Middlename', updatedUserDetails.middlename);
                localStorage.setItem('Lastname', updatedUserDetails.lastname);
                localStorage.setItem('Email', updatedUserDetails.email);
                localStorage.setItem('Cpnumber', updatedUserDetails.cpnumber);
                localStorage.setItem('Username', updatedUserDetails.username);

                // Reload the page
                window.location.reload();
            })
            .catch(function (error) {
                console.error('Error updating details:', error);
            });
    };



    const handleItemClick = (item) => {
        setSelectedItem(item);

    };

    const handleCreatePost = () => {
        navigateTo('/createPost');
    }


    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/sync';
    };


    const fetchPost = async (postId) => {
        try {
            const url = localStorage.getItem("url") + "fetch_images.php?";
            const res = await axios.get("http://localhost/api/fetch_images.php");
            console.log(res.data);


            setData(res.data);

            localStorage.getItem(`comments_${postId}`);


            console.log("data ko to: ", data);

        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchPost();
        setUserFirstname(localStorage.getItem('Firstname') || '');

        console.log("User Firstname:", usersFirstname);
        console.log("User Lastname:", userLastname);
        console.log("User Image:", userImage);

        function handleClickOutside(event) {

            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {

                setIsDropdownOpen(false);
                setIsNameHighlighted(isNameHighlighted);

            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef])


    const dashboardActive = location.pathname === '/sync/Dashboard';


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setIsNameHighlighted(!isNameHighlighted);
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setUpdatedProfilePicture(file);
    };


    return (
        <>
            <div className="h-screen">
                <nav className="bg-[#242526] shadow-md position-fixed z-10 w-full h-20">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center mt-3">

                            <div className="flex items-start" style={{ position: 'absolute', left: 15 }}>
                                <h1 className="text-white text-xl great-vibes">Sync</h1>
                            </div>


                            <div className="hidden md:flex flex-grow items-center" style={{ position: 'absolute', right: 20 }}>
                                <a href="/sync/Dashboard" className="mr-4 text-gray-300 hover:text-blue-500 no-underline">
                                    <FontAwesomeIcon icon={faHome} size='xl' className="home-icon-circle" style={{ color: dashboardActive ? '#ffffff' : '#3766FE' }} />
                                </a>

                                <a href="/sync/Profile" className="mr-4 text-gray-300 hover:text-blue-500 no-underline">
                                    <FontAwesomeIcon icon={faMessage} size='xl' />
                                </a>
                                <a href="#" className="mr-4 text-gray-300 hover:text-blue-500 no-underline">
                                    <FontAwesomeIcon icon={faBell} size='xl' />
                                </a>
                                <div className="flex items-center">
                                    <div className="relative">
                                        <button onClick={toggleDropdown} className="flex items-center text-gray-300 hover:text-green-500 focus:outline-none">
                                            <img src={"http://localhost/api/profPic/" + userImage} className="rounded-full" alt="" style={{ width: '35px', height: '35px' }} />
                                            <span className={`mr-2 ml-1 text-lg ${isNameHighlighted ? 'text-green-500' : ''}`}>{userFirstname}</span>
                                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 12.586l3.707-3.707a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 12.586z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {isDropdownOpen && (
                                            <div ref={dropdownRef} className="absolute top-[55px] bg-slate-800 shadow-md rounded-md p-2 flex flex-col items-center right-0">
                                                <div className="flex items-center cursor-pointer mr-5 mt-3 text-gray-300 hover:text-blue-500" onClick={handleShowModal}>
                                                    <FontAwesomeIcon icon={faUser} size='xl' className="ml-2 hover:text-blue-500" />
                                                    <span className="mr-1 ml-4">Personal&nbsp;Details</span>
                                                </div>
                                                <div className="flex items-center cursor-pointer mt-3 mr-2 mb-3 text-gray-300 hover:text-red-500" onClick={handleLogout}>
                                                    <FontAwesomeIcon icon={faSignOutAlt} size='xl' className=" ml-0 hover:text-red-500" />
                                                    <span className="ml-3 mr-16">Logout</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>



                            <div className="md:hidden fixed top-0 right-0 mr-4 mt-4">
                                <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none">
                                    <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M4 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                        </div>
                        {isOpen && (
                            <div className="md:hidden absolute top-full bg-[#242526] shadow-md rounded-md p-2 ml-60 flex flex-col items-start mt-0">
                                <a href="/sync/Dashboard" className="mt-4 ml-2 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faHome} size='xl' style={{ color: dashboardActive ? '#ffffff' : '#3766FE' }} /> Home
                                </a>
                                <a href="/sync/Profile" className="mt-4 ml-2 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faMessage} size='xl' /> Message
                                </a>
                                <a href="#" className="mt-4 ml-2 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faBell} size='xl' /> Notification
                                </a>


                                <div className="flex items-center">
                                    <div className="relative">
                                        <button onClick={toggleDropdown} className="flex items-center text-gray-300 hover:text-green-500 focus:outline-none">
                                            <img src={"http://localhost/api/profPic/" + userImage} className="rounded-full mt-3" alt="" style={{ width: '35px', height: '35px' }} />
                                            <span className="mr-2 ml-1 mt-3 text-lg">{userFirstname}</span>
                                            <svg className="h-4 w-4 mt-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 12.586l3.707-3.707a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 12.586z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {isDropdownOpen && (
                                            <div ref={dropdownRef} className="absolute top-[55px] bg-slate-800 shadow-md rounded-md p-2 flex flex-col items-center right-0">
                                                <div className="flex items-center cursor-pointer mr-5 mt-3 text-gray-300 hover:text-blue-500" onClick={handleShowModal}>
                                                    <FontAwesomeIcon icon={faUser} size='xl' className="ml-2 hover:text-blue-500" />
                                                    <span className="mr-1 ml-4">Personal&nbsp;Details</span>
                                                </div>
                                                <div className="flex items-center cursor-pointer mt-3 mr-2 mb-3 text-gray-300 hover:text-red-500" onClick={handleLogout}>
                                                    <FontAwesomeIcon icon={faSignOutAlt} size='xl' className=" ml-0 hover:text-red-500" />
                                                    <span className="ml-3 mr-16">Logout</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="position-fixed top-0 left-0">
                    <a href="/sync/Profile" className="flex justify-start items-start cursor-pointer no-underline">
                        <img src={"http://localhost/api/profPic/" + userImage} className="rounded-full mt-28 ml-4" alt="" style={{ width: '35px', height: '35px' }} />
                        <p className="text-white mt-28 ml-2">
                            <span className="hover:text-blue-400">{usersFirstname} {userLastname}</span>
                        </p>
                    </a>
                </div>


                <div className="container mx-auto px-6 py-18" style={{ marginBottom: "30px" }}>
                    <div className="flex justify-center">
                        <CreatePost />
                    </div>
                </div>

                <div className=" d-flex justify-content-center align-items-center">
                    <div className="col-12 col-md-8">
                        <div className="mx-auto" style={{ maxWidth: '600px', width: '100%' }}>
                            {data.map((item, index) => (
                                <UserPost item={item} key={index} />
                            ))}
                        </div>
                    </div>
                </div>


                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton className="bg-[#242526] text-white">
                        <Modal.Title>Personal Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-white bg-[#242526]">
                        <table className="table" style={{ backgroundColor: '#242526' }}>
                            <tbody>
                                <tr>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white"><strong>Firstname:</strong></td>
                                    <td style={{ backgroundColor: '#242526', }} className="text-white">{usersFirstname}</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white"><strong>Middlename:</strong></td>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white">{userMiddlename}</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white"><strong>Lastname:</strong></td>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white">{userLastname}</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white"><strong>Email:</strong></td>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white">{userEmail}</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white"><strong>Cp Number:</strong></td>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white">{userCpNumber}</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white"><strong>Username:</strong></td>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white">{userUsername}</td>
                                </tr>
                                <tr>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white"><strong>Profile Picture:</strong></td>
                                    <td style={{ backgroundColor: '#242526' }} className="text-white">{userImage}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Modal.Body>




                    <Modal.Footer style={{ backgroundColor: '#242526' }}>
                        <Button variant="success"
                            onClick={handleOpenUpdateDetailsModal}>
                            Update
                        </Button>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>




                <Modal show={showUpdateDetailsModal} onHide={handleCloseUpdateDetailsModal}>
                    <Modal.Header closeButton className="bg-[#242526] text-white">
                        <Modal.Title>Update Personal Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-white bg-[#242526]">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="firstname" className="form-label">First Name</label>
                                <input type="text" className="form-control" id="updatedFirstname" value={updatedUserDetails.firstname} onChange={(e) => setUpdatedUserDetails({ ...updatedUserDetails, firstname: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="middlename" className="form-label">Middle Name</label>
                                <input type="text" className="form-control" id="updatedMiddlename" value={updatedUserDetails.middlename} onChange={(e) => setUpdatedUserDetails({ ...updatedUserDetails, middlename: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastname" className="form-label">Last Name</label>
                                <input type="text" className="form-control" id="updatedLastname" value={updatedUserDetails.lastname} onChange={(e) => setUpdatedUserDetails({ ...updatedUserDetails, lastname: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="updatedEmail" value={updatedUserDetails.email} onChange={(e) => setUpdatedUserDetails({ ...updatedUserDetails, email: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="cpnumber" className="form-label">Contact Number</label>
                                <input type="text" className="form-control" id="updatedCpnumber" value={updatedUserDetails.cpnumber} onChange={(e) => setUpdatedUserDetails({ ...updatedUserDetails, cpnumber: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input type="text" className="form-control" id="updatedUsername" value={updatedUserDetails.username} onChange={(e) => setUpdatedUserDetails({ ...updatedUserDetails, username: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input type="text" className="form-control" id="updatedPassword" required value={updatedUserDetails.password} onChange={(e) => setUpdatedUserDetails({ ...updatedUserDetails, password: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
                                <input type="file" className="form-control" id="profilePicture" onChange={handleProfilePictureChange} accept="image/*" />
                            </div>
                        </form>
                    </Modal.Body>

                    <Modal.Footer style={{ backgroundColor: '#242526' }}>
                        <Button variant='success' onClick={handleUpdateUserDetails}>
                            Save
                        </Button>
                        <Button variant="secondary" onClick={handleCloseUpdateDetailsModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>



            </div >

        </>
    );
}

export default Dashboard;
