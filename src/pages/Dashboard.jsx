import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUser, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Card, Image, Row } from 'react-bootstrap';
import UserPost from './UserPost';
import CreatePost from './CreatePost';
import { useNavigate, useLocation } from 'react-router-dom';

library.add(faHome, faUser, faBell, faSignOutAlt);

function Dashboard() {

    const navigateTo = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const [userFirstname, setUserFirstname] = useState('');

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

    const fetchPost = async () => {
        try {
            const url = localStorage.getItem("url") + "fetch_images.php?";
            const res = await axios.get("http://localhost/api/fetch_images.php");
            console.log(res.data);


            setData(res.data);



            console.log("data ko to: ", data);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPost();
        setUserFirstname(localStorage.getItem('Firstname') || '');
    }, [])

    const dashboardActive = location.pathname === '/sync/Dashboard';

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
                                    <FontAwesomeIcon icon={faHome} size='xl' style={{ color: dashboardActive ? '#ffffff' : '#3766FE' }} />
                                </a>

                                <a href="#" className="mr-4 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faUser} size='xl' />
                                </a>
                                <a href="#" className="mr-4 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faBell} size='xl' />
                                </a>
                                <a href="#" className="text-gray-300 hover:text-white no-underline" onClick={handleLogout}>
                                    <FontAwesomeIcon icon={faSignOutAlt} size='xl' />
                                </a>
                                <span className="text-gray-300 text-[24px] ml-4">{userFirstname}</span>
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
                                <a href="#" className="text-gray-300 hover:text-white mb-2 no-underline">Home</a>
                                <a href="#" className="text-gray-300 hover:text-white mb-2 no-underline">Profile</a>
                                <a href="#" className="text-gray-300 hover:text-white mb-2 no-underline">Notifications</a>
                                <a href="#" className="text-gray-300 hover:text-white no-underline" onClick={handleLogout}>Logout</a>
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






        </>
    );
}

export default Dashboard;
