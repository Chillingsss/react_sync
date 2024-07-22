import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUser, faBell, faSignOutAlt, faMessage, faBan, faArrowUp, faTimes, faCheck, faTrashAlt, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, Image, Row, } from 'react-bootstrap';
import UserPost from './UserPost';
import CreatePost from './CreatePost';
import Comment from './Comment';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';


library.add(faHome, faUser, faBell, faSignOutAlt);

function UserProfile() {
    const navigateTo = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const [userFirstname, setUserFirstname] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    const usersFirstname = localStorage.getItem('Firstname') || '';
    const userMiddlename = localStorage.getItem('Middlename') || '';
    const userLastname = localStorage.getItem('Lastname') || '';
    const userEmail = localStorage.getItem('Email') || '';
    const userCpNumber = localStorage.getItem('Cpnumber') || '';
    const userUsername = localStorage.getItem('Username') || '';
    const userPassword = localStorage.getItem('Password') || '';
    const userImage = localStorage.getItem('ProfilePic') || '';

    const UserFirstname = sessionStorage.getItem('firstname') || '';
    const UserLastname = sessionStorage.getItem('lastname') || '';
    const UserProfPic = sessionStorage.getItem('userProfile') || '';



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
            alert('Please fill in all fields.');
            return;
        }

        console.log("asdas");
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

        axios.post('http://localhost/api/user.php', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        })
            .then(function (response) {
                console.log(response.data);

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

                window.location.reload();
            })
            .catch(function (error) {
                console.error('Error updating details:', error);
            });
    };

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

    // const handleCommentModalOpen = (post) => {
    //     setIsCommentModalOpen(true);
    //     setSelectedPost(post);
    // };

    // const handleCommentModalClose = () => {
    //     setIsCommentModalOpen(false);
    //     setSelectedPost(null);
    // };

    const fetchPost = async () => {
        try {
            const userId = sessionStorage.getItem('idtopost');

            if (userId) {
                const jsonData = {
                    profID: userId
                };

                const formData = new FormData();
                formData.append("operation", "getProfile");
                formData.append("json", JSON.stringify(jsonData));

                const profileRes = await axios.post(`http://localhost/api/user.php`, formData);

                console.log(profileRes.data);

                if (profileRes.data.length === 0) {
                    setData("No posts yet");
                    console.log("No posts yet");
                } else {
                    setData(profileRes.data);
                    console.log("User's posts:", profileRes.data);
                }
            } else {
                console.log("User ID not found in sessionStorage");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const [isDropdownOpenChat, setIsDropdownOpenChat] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const userId = localStorage.getItem('id');

    const [selectedItem, setSelectedItem] = useState(null);
    const dropdownRef = useRef(null);


    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const [selectedMessage, setSelectedMessage] = useState(null);


    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedMessage, setEditedMessage] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 2) {
            try {
                const response = await axios.get(`http://localhost/api/search.php?query=${query}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleSearchResultClick = (user) => {
        console.log("Navigating to user profile with ID: " + user.id);
        sessionStorage.setItem("idtopost", user.id);
        sessionStorage.setItem("firstname", user.firstname);
        sessionStorage.setItem("lastname", user.lastname);
        sessionStorage.setItem("userProfile", user.prof_pic);

        window.location.href = `/sync/UserProfile?userId=${user.id}`;
    };



    useEffect(() => {
        fetchUsers();
        setUserFirstname(localStorage.getItem('Firstname') || '');
    }, []);


    const fetchUsers = () => {
        const apiUrl = 'http://localhost/api/userChat.php';
        const userId = localStorage.getItem('id'); // Assuming the user ID is stored in localStorage

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: parseInt(userId) }), // Send the userId in the request body
        })
            .then(response => response.json())
            .then(data => {
                setUsers(data.filter(user => user.id !== parseInt(userId)));
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };


    useEffect(() => {
        if (isDropdownOpenChat) {
            fetchUsers();
        }

        // Add event listener for mousedown to close dropdown when clicking outside
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpenChat]);

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpenChat(false);
        }
    };


    const [isCardOpen, setIsCardOpen] = useState(false);
    const searchRef = useRef(null); // Ref for the search input
    const cardRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                cardRef.current &&
                !cardRef.current.contains(event.target)
            ) {
                setIsCardOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const openModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        sessionStorage.setItem('selectedUserId', user.id);
        fetchMessages();
        setIsDropdownOpenChat(false);

    };

    const closeModal = () => {
        sessionStorage.removeItem('selectedUserId');
        setSelectedUser(null);
        setIsModalOpen(false);
        setIsDropdownOpenChat(true);
    };

    const openEditModal = (message) => {
        console.log("Message to edit:", message);
        setSelectedMessage(message);
        setIsEditModalOpen(true);
    };


    const closeEditModal = () => {
        setSelectedMessage(null);
        setIsEditModalOpen(false);
    };





    const [showBanIcon, setShowBanIcon] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async (e, message) => {
        e.preventDefault();

        if (!newMessage) {
            toast.error('Please enter a message');
            return;
        }

        const selectedUserId = sessionStorage.getItem("selectedUserId");
        const loggedInUserId = sessionStorage.getItem('id');
        // const url = localStorage.getItem("url") + "user.php";
        console.log(selectedUserId, loggedInUserId, newMessage);


        try {
            const jsonData = {
                userId: loggedInUserId,
                usersID: selectedUserId,
                chat_message: newMessage,
            };

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "chat");

            const response = await axios.post(`http://localhost/api/user.php`, formData);
            console.log('Message sent successfully:', response.data);


            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
        }
        finally {
            await fetchMessages();
            setNewMessage('');
        }
    };



    const fetchMessages = async () => {
        try {
            const loggedInUserId = sessionStorage.getItem('id');
            const selectedUserId = sessionStorage.getItem("selectedUserId");
            console.log(loggedInUserId, selectedUserId);

            if (!loggedInUserId || !selectedUserId) {
                console.error('User IDs not available');
                return;
            }

            const jsonData = {
                userId: loggedInUserId,
                usersID: selectedUserId,
            };

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "getMessages");

            const response = await axios.post(`http://localhost/api/user.php`, formData);

            if (response.data.status === 1) {
                console.log("Fetched messages:", response.data.messages);
                setMessages(response.data.messages);
            } else {
                console.error('Error fetching messages:', response.data.message);
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);



    const handleEditMessage = async (messageId) => {
        console.log("Selected Message:", selectedMessage); // Debug log

        try {
            const jsonData = {
                messageId: messageId,
                message: selectedMessage.chat_message,
            };

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "editMessage");

            const response = await axios.post(`http://localhost/api/user.php`, formData);

            if (response.data.status === 1) {
                console.log('Message edited successfully');
                setIsEditModalOpen(false);
                fetchMessages();
            } else {
                console.error('Error editing message:', response.data.message);
            }
        } catch (error) {
            console.error('Error editing message:', error);
        }
    };

    // Make sure `chat_id` is correctly set in `selectedMessage`
    const handleInputChange = (value) => {
        setSelectedMessage((prev) => ({
            ...prev,
            chat_message: value,
        }));
    };



    const deleteMessage = async (messageId) => {
        try {
            const jsonData = {
                chat_id: messageId, // Correct key to match the backend
            };

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "deleteMessage");

            const response = await axios.post(`http://localhost/api/user.php`, formData);

            if (response.data === 1) {
                console.log('Message deleted successfully');
                // Update messages state after deletion
                fetchMessages();
            } else {
                console.error('Error deleting message:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };


    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
        // setIsNameHighlighted(!isNameHighlighted);
        // If isDropdownOpen is already true, set it to false
        if (isDropdownOpen) {
            setIsDropdownOpen(false);
        }
    };

    const toggleDropdownChat = () => {
        setIsDropdownOpenChat(prevState => !prevState);

        if (isDropdownOpenChat) {
            setIsDropdownOpenChat(false);
        }
    }


    // const handleReloadPage = () => {
    //     window.location.reload();
    // }


    const messageContainerRef = useRef(null);

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);


    const modalRef = useRef(null);


    useEffect(() => {
        const handleClickOutsideMessage = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutsideMessage);
        } else {
            document.removeEventListener('mousedown', handleClickOutsideMessage);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideMessage);
        };
    }, [isModalOpen, closeModal]);

    const [searchMessage, setSearchMessage] = useState('');

    const filteredUsers = users.filter(user =>
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchMessage.toLowerCase())
    );


    const handleClearSearchMessage = () => {
        setSearchMessage(''); // Clear the search input
    };

    const handleClearSearch = () => {
        setSearchQuery(''); // Clear the search input
        setSearchResults([]);
        setIsCardOpen(false); // Optionally clear the search results
    };


    useEffect(() => {
        fetchPost();
        setUserFirstname(localStorage.getItem('Firstname') || '');

        function handleClickOutside(event) {

            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {

                setIsDropdownOpen(false);
            }
        }



        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef])

    const dashboardActive = location.pathname === '/sync/Dashboard';
    const isProfileActive = location.pathname === '/sync/Profile';



    return (
        <>
            <div className='h-screen'>
                <nav className="bg-[#242526] shadow-md position-fixed z-10 w-full h-16">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center mt-2">

                            <div className="flex items-center" style={{ position: 'absolute', left: 15 }}>
                                <Link
                                    to="/Dashboard"
                                    className="text-white font-dancing-script mt-1 cursor-pointer no-underline text-4xl"
                                >
                                    S y n c
                                </Link>
                                {/* <img src="var/www/html/crud/sync.png" alt="Sync Logo" /> */}


                                <div className="relative">
                                    <input
                                        type="text"
                                        ref={searchRef}
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        placeholder="Search Sync"
                                        className="ml-4 px-4 py-2 mt-1 text-gray-200 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 bg-[#242526]"
                                        onFocus={() => setIsCardOpen(true)} // Show card on focus
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <FontAwesomeIcon
                                            icon={searchQuery ? faTimes : faSearch} // Conditionally change the icon
                                            className="text-gray-400 cursor-pointer"
                                            onClick={searchQuery ? handleClearSearch : undefined} // Clear search if 'X' icon is clicked
                                        />
                                    </div>
                                    {isCardOpen && searchResults.length > 0 && (
                                        <div ref={cardRef} className="absolute bg-[#242526] text-gray-200 shadow-md rounded-md mt-2 ml-4 w-56 max-h-80 overflow-y-auto z-30">
                                            {searchResults.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="p-2 cursor-pointer hover:bg-gray-600 flex items-center"
                                                    onClick={() => handleSearchResultClick(user)}
                                                >
                                                    <img
                                                        src={`http://localhost/api/profPic/${user.prof_pic}`}
                                                        alt={`${user.firstname} ${user.lastname}`}
                                                        className="w-8 h-8 rounded-full mr-2"
                                                    />
                                                    <span>{user.firstname} {user.lastname}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>




                            <div className="hidden md:flex flex-grow items-center" style={{ position: 'absolute', right: 20 }}>
                                <a href="/sync/Dashboard" className="mr-4 text-gray-300 hover:text-blue-500 no-underline">
                                    <FontAwesomeIcon icon={faHome} size='xl' className="home-icon-circle" title='Home' />
                                </a>

                                {/* chat dropdown */}
                                <div className="flex items-center">
                                    <div className="relative">
                                        <button onClick={toggleDropdownChat} className="mr-4 text-gray-300 hover:text-blue-500 no-underline" title='Message'>
                                            <FontAwesomeIcon icon={faMessage} size='xl' />
                                        </button>
                                    </div>

                                    {isDropdownOpenChat && (
                                        <div ref={dropdownRef} className="absolute top-[49px] bg-slate-900 shadow-md rounded-md p-2 flex flex-col items-start right-0 w-60 max-h-[26rem] overflow-y-auto">
                                            <div className="relative mb-2">
                                                <FontAwesomeIcon
                                                    icon={searchMessage ? faTimes : faSearch}
                                                    className="absolute inset-y-0 right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                                    style={{ fontSize: '1.2rem' }}
                                                    onClick={searchMessage ? handleClearSearchMessage : undefined}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Search users..."
                                                    value={searchMessage}
                                                    onChange={(e) => setSearchMessage(e.target.value)}
                                                    className="pl-4 pr-12 p-2 w-full bg-slate-800 text-white rounded-md"
                                                />
                                            </div>

                                            {filteredUsers.map(user => (
                                                <a key={user.id} onClick={() => openModal(user)} className="flex justify-start items-start cursor-pointer no-underline mt-3">
                                                    <img src={`http://localhost/api/profPic/${user.prof_pic}`} className="rounded-full ml-1" alt="" style={{ width: '35px', height: '35px' }} />
                                                    <p className="text-white ml-2 mt-1">
                                                        <span className="hover:text-blue-400">{user.firstname} {user.lastname}</span>
                                                    </p>
                                                </a>
                                            ))}
                                            <hr style={{ width: '100%', borderTop: '1px solid #ccc', margin: '8px 0' }} />
                                        </div>
                                    )}
                                </div>

                                <a href="#" className="mr-4 text-gray-300 hover:text-blue-500 no-underline" title='Notification'>
                                    <FontAwesomeIcon icon={faBell} size='xl' />
                                </a>
                                <div className="flex items-center">
                                    <div className="relative">
                                        <button onClick={toggleDropdown} className="flex items-center text-gray-300 hover:text-green-500 focus:outline-none">
                                            <img src={"http://localhost/api/profPic/" + userImage} className="rounded-full" alt="" style={{ width: '35px', height: '35px' }} title='Profile' />
                                            {/* <span className={`mr-2 ml-1 text-lg ${isNameHighlighted ? 'text-green-500' : ''}`}>{userFirstname}</span> */}
                                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 12.586l3.707-3.707a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 12.586z" clipRule="evenodd" />
                                            </svg>
                                        </button>

                                        {isDropdownOpen && (
                                            <div ref={dropdownRef} className="absolute top-[49px] bg-slate-900 shadow-md rounded-md p-2 flex flex-col items-start right-0 w-60">
                                                <a href="/sync/Profile" className="flex justify-start items-start cursor-pointer no-underline mt-3">
                                                    <img src={"http://localhost/api/profPic/" + userImage} className="rounded-full ml-1" alt="" style={{ width: '35px', height: '35px' }} />
                                                    <p className="text-white ml-2 mt-1">
                                                        <span className="hover:text-blue-400 ">{usersFirstname} {userLastname}</span>
                                                    </p>
                                                </a>
                                                <hr style={{ width: '100%', borderTop: '1px solid #ccc', margin: '-2px 0', }} />

                                                <div className="flex items-center cursor-pointer mr-5 mt-4 text-gray-300 hover:text-blue-500" onClick={handleShowModal}>
                                                    <FontAwesomeIcon icon={faUser} size='xl' className="ml-2 hover:text-blue-500" />
                                                    <span className="mr-1 ml-4">Personal&nbsp;Details</span>
                                                </div>
                                                <div className="flex items-center cursor-pointer mt-3 mr-5 mb-3 text-gray-300 hover:text-red-500" onClick={handleLogout}>
                                                    <FontAwesomeIcon icon={faSignOutAlt} size='xl' className=" ml-2 hover:text-red-500" />
                                                    <span className=" mr-16" style={{ marginLeft: '13.5px' }}>Logout</span>
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
                                            <div ref={dropdownRef} className="absolute top-[49px] bg-slate-800 shadow-md rounded-md p-2 flex flex-col items-start right-0 w-60">
                                                <a href="/sync/Profile" className="flex justify-start items-start cursor-pointer no-underline mt-3">
                                                    <img src={"http://localhost/api/profPic/" + userImage} className="rounded-full ml-1" alt="" style={{ width: '35px', height: '35px' }} />
                                                    <p className="text-white ml-2 mt-1">
                                                        <span className="hover:text-blue-400 ">{usersFirstname} {userLastname}</span>
                                                    </p>
                                                </a>
                                                <hr style={{ width: '100%', borderTop: '1px solid #ccc', margin: '-2px 0', }} />

                                                <div className="flex items-center cursor-pointer mr-5 mt-4 text-gray-300 hover:text-blue-500" onClick={handleShowModal}>
                                                    <FontAwesomeIcon icon={faUser} size='xl' className="ml-2 hover:text-blue-500" />
                                                    <span className="mr-1 ml-4">Personal&nbsp;Details</span>
                                                </div>
                                                <div className="flex items-center cursor-pointer mt-3 mr-5 mb-3 text-gray-300 hover:text-red-500" onClick={handleLogout}>
                                                    <FontAwesomeIcon icon={faSignOutAlt} size='xl' className=" ml-2 hover:text-red-500" />
                                                    <span className=" mr-16" style={{ marginLeft: '13.5px' }}>Logout</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <a href="/sync/Dashboard" className="mt-4 ml-2 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faHome} size='xl' style={{ color: dashboardActive ? '#ffffff' : '#3766FE' }} /> Home
                                </a>

                                {/* chat dropdown */}
                                <div className="flex items-center">

                                    <button onClick={toggleDropdownChat} className="mt-4 ml-2 cursor-pointer text-gray-300 hover:text-blue-500 no-underline" title='Message'>
                                        <FontAwesomeIcon icon={faMessage} size='xl' /> Message
                                    </button>


                                    {isDropdownOpenChat && (
                                        <div ref={dropdownRef} className="absolute top-[49px] bg-slate-900 shadow-md rounded-md p-2 flex flex-col items-start right-0 w-60 max-h-60 overflow-y-auto">
                                            {users.map(user => (
                                                <a key={user.id} onClick={() => openModal(user)} className="flex justify-start items-start cursor-pointer no-underline mt-3">
                                                    <img src={`http://localhost/api/profPic/${user.prof_pic}`} className="rounded-full ml-1" alt="" style={{ width: '35px', height: '35px' }} />
                                                    <p className="text-white ml-2 mt-1">
                                                        <span className="hover:text-blue-400">{user.firstname} {user.lastname}</span>
                                                    </p>
                                                </a>
                                            ))}
                                            <hr style={{ width: '100%', borderTop: '1px solid #ccc', margin: '8px 0' }} />
                                        </div>
                                    )}
                                </div>

                                <a href="#" className="mt-4 ml-2 text-gray-300 hover:text-white no-underline">
                                    <FontAwesomeIcon icon={faBell} size='xl' /> Notification
                                </a>


                            </div>
                        )}

                    </div>
                </nav>


                {selectedUser && (
                    <div className={`fixed inset-0 z-50 overflow-y-auto ${isModalOpen ? 'block' : 'hidden'}`}>
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-800 opacity-75"></div>
                            </div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <div ref={modalRef} className="inline-block align-bottom bg-[#242526] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-10 sm:align-middle sm:max-w-xl sm:w-11/12" style={{ height: '80vh' }}>
                                {/* Top section: Selected user profile */}
                                <div className="bg-[#242526] px-4 py-4 ">
                                    <div className="flex items-center mb-2 justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <img src={`http://localhost/api/profPic/${selectedUser.prof_pic}`} className="h-12 w-12 rounded-full" alt="" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-lg leading-6 font-medium text-white">{selectedUser.firstname} {selectedUser.lastname}</h3>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center py-2 px-3 border border-transparent shadow-sm text-sm font-medium rounded-2xl text-white bg-slate-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                onClick={closeModal}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </div>
                                    </div>

                                    <hr className="my-2 border-gray-200" />

                                    {/* Message area */}
                                    <div className="h-64 overflow-y-auto" style={{ height: '55vh' }} ref={messageContainerRef}>
                                        {messages.length > 0 && messages.map((message, index) => (
                                            <div key={index} className="mb-2">
                                                <div className={`bg-slate-900 text-white p-2 rounded-lg ${message.chat_userID === userId ? 'bg-blue-100' : ''}`}>
                                                    <div className="relative">
                                                        {message.chat_userID === userId && (
                                                            <div className="flex items-center absolute top-0 right-0">
                                                                <FontAwesomeIcon
                                                                    icon={faEdit}
                                                                    className="mr-1 hover:text-blue-500"
                                                                    style={{ width: '15px', height: '15px', cursor: 'pointer', marginRight: '20px' }}
                                                                    onClick={() => openEditModal(message)}
                                                                />
                                                                <FontAwesomeIcon
                                                                    icon={faTrashAlt}
                                                                    className="mr-1 hover:text-red-500"
                                                                    style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                                                                    onClick={() => deleteMessage(message.chat_id)}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex' }} className='mt-2'>
                                                        <img src={`http://localhost/api/profPic/${message.prof_pic}`} className="rounded-full mr-2" alt="" style={{ width: '45px', height: '45px' }} />
                                                        <div>
                                                            <p style={{ fontSize: "17px", marginBottom: '5px' }}>{message.firstname}</p>
                                                            <p className="text-left text-gray-500 text-xs">{message.chat_date_created}</p>
                                                        </div>
                                                    </div>
                                                    <p>{message.chat_message}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {isEditModalOpen && (
                                            <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center">
                                                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                                </div>
                                                <div className="inline-block bg-[#242526] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-11/12">
                                                    <div className="bg-[#242526] px-4 pt-5 pb-4 sm:p-3 sm:pb-4">
                                                        <div className="sm:flex sm:items-start">
                                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                                <h3 className="text-lg leading-6 font-medium text-white">
                                                                    Edit Message
                                                                </h3>
                                                                <textarea
                                                                    value={selectedMessage.chat_message}
                                                                    onChange={(e) => handleInputChange(e.target.value)}
                                                                    className="outline-none bg-slate-900 shadow-sm rounded-2xl text-white w-full items-center p-2"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-[#242526] px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                        <button
                                                            type="button"
                                                            className="inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                                                            onClick={() => handleEditMessage(selectedMessage.chat_id)}
                                                        >
                                                            <FontAwesomeIcon icon={faCheck} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="inline-flex justify-center mr-2 py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            onClick={closeEditModal}
                                                        >
                                                            <FontAwesomeIcon icon={faTimes} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom section: Logged-in user profile and message input */}
                                <form onSubmit={sendMessage}>
                                    <div className="relative flex">
                                        <img src={`http://localhost/api/profPic/${userImage}`} className="rounded-full mt-2.5" alt="" style={{ width: '40px', height: '40px' }} />
                                        <input
                                            type="text"
                                            id="commentText"
                                            className="mt-2 ml-2 p-2 pl-10 block w-full shadow-sm rounded-2xl bg-slate-900 text-white"
                                            placeholder={`Message as ${usersFirstname || 'Guest'}`}
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="absolute inset-y-0 right-0 flex items-center justify-center rounded-full text-white cursor-pointer mr-3 mt-1"
                                            onMouseEnter={() => setShowBanIcon(!newMessage)}
                                            onMouseLeave={() => setShowBanIcon(false)}
                                        >
                                            <FontAwesomeIcon
                                                icon={showBanIcon ? faBan : faArrowUp}
                                                style={{ color: newMessage ? "#3366ff" : "gray", transition: 'color 0.3s' }}
                                                title={!newMessage ? "Prohibited" : ""}
                                            />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}


                <div className="position-fixed top-0 left-0">
                    <a href="/sync/Profile" className="flex justify-start items-start cursor-pointer no-underline">
                        <img src={"http://localhost/api/profPic/" + UserProfPic} className="rounded-full mt-24 ml-4" alt="" style={{ width: '35px', height: '35px' }} />
                        <p className="text-white mt-24 ml-2">
                            <span className="hover:text-blue-400" style={{ color: dashboardActive ? '#ffffff' : '#3084D1' }}>{UserFirstname} {UserLastname}</span>
                            <div className="h-0.5 bg-blue-500 absolute bottom-0 left-0 w-full transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></div>

                        </p>
                    </a>
                </div>




                <div className="container mx-auto px-6 py-18" style={{ marginBottom: "30px" }}>
                    <div className="flex justify-center">
                        <CreatePost />
                    </div>
                </div>





                <div className="d-flex justify-content-center align-items-center">
                    <div className="col-12 col-md-8">
                        <div className="mx-auto" style={{ maxWidth: '600px', width: '100%' }}>
                            {Array.isArray(data) && data.length > 0 ? (
                                data.map((item, index) => (
                                    <UserPost item={item} key={index} />
                                ))
                            ) : (
                                <center>
                                    <p>No posts yet</p>
                                </center>

                            )}
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
                        </form>
                    </Modal.Body>

                    <Modal.Footer style={{ backgroundColor: '#242526' }}>
                        <Button onClick={handleUpdateUserDetails}>
                            Update
                        </Button>
                        <Button variant="secondary" onClick={handleCloseUpdateDetailsModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>

        </>
    )
}

export default UserProfile
