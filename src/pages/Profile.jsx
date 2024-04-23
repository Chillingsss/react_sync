import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUser, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Card, Image, Row } from 'react-bootstrap';
import UserPost from './UserPost';
import CreatePost from './CreatePost';
import Comment from './Comment';
import { useNavigate, useLocation } from 'react-router-dom';

library.add(faHome, faUser, faBell, faSignOutAlt);

function Profile() {
    const navigateTo = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const [userFirstname, setUserFirstname] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    // const postPoints = (points) = {

    // }

    const handleCreatePost = () => {
        navigateTo('/createPost');
    }


    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/sync';
    };

    const handleCommentModalOpen = (post) => {
        setIsCommentModalOpen(true);
        setSelectedPost(post);
    };

    const handleCommentModalClose = () => {
        setIsCommentModalOpen(false);
        setSelectedPost(null);
    };

    const fetchPost = async () => {
        try {

            const userId = sessionStorage.getItem('userId');


            if (userId) {

                const jsonData = {
                    profID: userId
                };


                const formData = new FormData();
                formData.append("operation", "getProfile");
                formData.append("json", JSON.stringify(jsonData));


                const profileRes = await axios.post(`http://localhost/api/user.php`, formData);


                console.log(profileRes.data);
            }


            const url = localStorage.getItem("url") + "fetch_images.php";
            const postRes = await axios.get(url);
            console.log(postRes.data);
            setData(postRes.data);
            console.log("Post data:", data);

        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        fetchPost();
        setUserFirstname(localStorage.getItem('Firstname') || '');
    }, [])

    const dashboardActive = location.pathname === '/sync/Dashboard';
    const isProfileActive = location.pathname === '/sync/Profile';

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            <div className="bg-[#242526] shadow-md position-fixed z-10 w-full">
                <nav>
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <svg className="h-8 w-8 text-white mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 2C5.4 2 2 5.4 2 10s3.4 8 8 8 8-3.4 8-8-3.4-8-8-8zm0 14.5c-3.6 0-6.5-2.9-6.5-6.5S6.4 3.5 10 3.5 16.5 6.4 16.5 10 13.6 16.5 10 16.5z" clipRule="evenodd" />
                                    <path fillRule="evenodd" d="M10 11.1c-1.5 0-2.8-.8-3.5-2.1l-.7 1.2c.9 1.4 2.4 2.4 4.2 2.4 2.8 0 5-2.2 5-5s-2.2-5-5-5c-1.6 0-3 .7-4 1.8V5H5v.5h1.1V7h1.3V5H8.3v-.8C9 3.6 9.8 3 10.7 3c.5 0 1 .2 1.5.5l-.9 1.1c-.4-.3-.8-.6-1.3-.6-1.1 0-2 .9-2 2s.9 2 2 2c.4 0 .8-.1 1.2-.3l.8 1.1c-.6.4-1.3.7-2 .7zm-.6 1.9c-.5 0-1-.1-1.5-.3l-.8-1.1c.7-.3 1.4-.5 2.3-.5 1.6 0 3.2.8 4 2.1l.7-1.2c-1.1-1.6-2.9-2.5-5-2.5-2.8 0-5 2.2-5 5s2.2 5 5 5c2.1 0 3.9-1 5-2.5l-.7-1.2c-.8 1.4-2.4 2.2-4 2.2z" clipRule="evenodd" />
                                </svg>
                                <h1 className="text-white text-lg font-bold">Sync</h1>
                            </div>

                            <div className="hidden md:flex flex-grow justify-end items-center">
                                <a href="/sync/Dashboard" className="mr-4 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faHome} size='xl' />
                                </a>

                                <a href="/sync/Profile" className="mr-4 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faUser} size='xl' style={{ color: isProfileActive ? 'blue' : '#3766FE' }} />
                                </a>
                                <a href="#" className="mr-4 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faBell} size='xl' />
                                </a>
                                <div className="flex items-center">
                                    <div className="relative">
                                        <button onClick={toggleDropdown} className="text-gray-300 hover:text-white focus:outline-none">
                                            <span className="mr-2 text-lg">{userFirstname}</span>
                                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 12.586l3.707-3.707a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 12.586z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {isDropdownOpen && (
                                            <div className="absolute top-15 bg-slate-800 shadow-md rounded-md p-2 flex items-center">
                                                <div className="flex items-center cursor-pointer" onClick={handleLogout}>
                                                    <FontAwesomeIcon icon={faSignOutAlt} size='xl' className="text-gray-300 ml-4  " />
                                                    <span className="text-gray-300 mr-4">Logout</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>



                            <div className="md:hidden flex items-center">
                                <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none">
                                    <svg className="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M4 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 5h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                        </div>
                        {isOpen && (
                            <div className="md:hidden flex flex-col mt-2">
                                <a href="/sync/Dashboard" className="mt-4 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faHome} size='xl' style={{ color: dashboardActive ? '#ffffff' : '#3766FE' }} />
                                </a>
                                <a href="#" className="mt-4 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faUser} size='xl' />
                                </a>
                                <a href="#" className="mt-4 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faBell} size='xl' />
                                </a>
                                <div className="flex items-center mt-4">
                                    <div className="relative">
                                        <button onClick={toggleDropdown} className="text-gray-300 hover:text-white focus:outline-none">
                                            <span className="mr-t text-lg">{userFirstname}</span>
                                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 12.586l3.707-3.707a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 12.586z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {isDropdownOpen && (
                                            <div className="absolute top-15 bg-slate-800 shadow-md rounded-md p-2 flex items-center">
                                                <div className="flex items-center cursor-pointer" onClick={handleLogout}>
                                                    <FontAwesomeIcon icon={faSignOutAlt} size='xl' className="text-gray-300 ml-4  " />
                                                    <span className="text-gray-300 mr-4">Logout</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </nav>
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


            <div className="d-flex justify-content-center align-items-center">
                <div className="col-12 col-md-8">
                    <div className="mx-auto" style={{ maxWidth: '600px', width: '100%' }}>
                        {data.map((item, index) => (
                            <UserPost item={item} key={index} toggleCommentModal={handleCommentModalOpen} />
                        ))}
                    </div>
                </div>
            </div>

            <Comment isOpen={isCommentModalOpen} onClose={handleCommentModalClose} />



        </>
    )
}

export default Profile