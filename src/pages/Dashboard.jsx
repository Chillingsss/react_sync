import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Card, Image, Row } from 'react-bootstrap';
import UserPost from './UserPost';


function Dashboard() {
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);

    // const postPoints = (points) = {

    // }




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
    }, [])

    // const handleLikePost = async (postId) => {
    //     try {
    //         const url = localStorage.getItem("url") + "user.php";
    //         const userId = localStorage.getItem("id");
    //         const jsonData = {
    //             postId: postId,
    //             userId: userId
    //         }

    //         const formData = new FormData();
    //         formData.append("operation", "heartPost");
    //         formData.append("json", JSON.stringify(jsonData));
    //         const res = await axios.post(url, formData);

    //         if (res.data === 5) {
    //             setPostpoints(postPoints - 1);
    //         } else if (res.data === 1) {
    //             setPostpoints(postPoints + 1);
    //         } else {
    //             toast.error("Something wrong");
    //             console.log("error: ", res.data);
    //         }
    //         setIsUserLiked(!isUserLiked);
    //     } catch (error) {
    //         alert("Network Error");
    //         console.log(error);
    //     }
    // }

    // const isUserLike = useCallback(async () => {
    //     try {
    //         const url = localStorage.getItem("url") + "user.php";
    //         const userId = localStorage.getItem("id");
    //         const jsonData = {
    //             postId: userPost.post_id,
    //             userId: userId
    //         }

    //         const formData = new FormData();
    //         formData.append("operation", "isUserLiked");
    //         formData.append("json", JSON.stringify(jsonData));

    //         const res = await axios.post(url, formData);
    //         // console.log("res.data userLike", res.data);
    //         setIsUserLiked(res.data === 1);
    //     } catch (error) {
    //         alert("Network error")
    //         console.log(error);
    //     }
    // }, [userPost.post_id])

    // useEffect(() => {
    //     console.log("post mo to", userPost);
    //     setPostpoints(userPost.likes);
    //     isUserLike();
    //     setIsUserPost(userPost.post_userId === secureLocalStorage.getItem("userId"));
    // }, [isUserLike, userPost, userPost.likes])

    return (
        <>
            <nav className="bg-gray-800 shadow-md">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <svg className="h-8 w-8 text-white mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 2C5.4 2 2 5.4 2 10s3.4 8 8 8 8-3.4 8-8-3.4-8-8-8zm0 14.5c-3.6 0-6.5-2.9-6.5-6.5S6.4 3.5 10 3.5 16.5 6.4 16.5 10 13.6 16.5 10 16.5z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M10 11.1c-1.5 0-2.8-.8-3.5-2.1l-.7 1.2c.9 1.4 2.4 2.4 4.2 2.4 2.8 0 5-2.2 5-5s-2.2-5-5-5c-1.6 0-3 .7-4 1.8V5H5v.5h1.1V7h1.3V5H8.3v-.8C9 3.6 9.8 3 10.7 3c.5 0 1 .2 1.5.5l-.9 1.1c-.4-.3-.8-.6-1.3-.6-1.1 0-2 .9-2 2s.9 2 2 2c.4 0 .8-.1 1.2-.3l.8 1.1c-.6.4-1.3.7-2 .7zm-.6 1.9c-.5 0-1-.1-1.5-.3l-.8-1.1c.7-.3 1.4-.5 2.3-.5 1.6 0 3.2.8 4 2.1l.7-1.2c-1.1-1.6-2.9-2.5-5-2.5-2.8 0-5 2.2-5 5s2.2 5 5 5c2.1 0 3.9-1 5-2.5l-.7-1.2c-.8 1.4-2.4 2.2-4 2.2z" clipRule="evenodd" />
                            </svg>
                            <h1 className="text-white text-lg font-bold">Sync</h1>
                        </div>
                        <div className="hidden md:flex flex-grow justify-end">
                            <a href="#" className="text-gray-300 hover:text-white mr-4 no-underline">Home</a>
                            <a href="#" className="text-gray-300 hover:text-white mr-4 no-underline">Profile</a>
                            <a href="#" className="text-gray-300 hover:text-white mr-4 no-underline">Notifications</a>
                            <a href="#" className="text-gray-300 hover:text-white no-underline" onClick={handleLogout}>Logout</a>
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

            <div className="d-flex justify-content-center align-items-center ">
                <div className="w-50">
                    {data.map((item, index) => (
                        <UserPost item={item} key={index} />
                    ))}
                </div>
            </div>


        </>
    );
}

export default Dashboard;
