import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Container, Card, Modal, Button, Image, Row, Form } from 'react-bootstrap';
import { faTrash, faEdit, faPaperPlane, faThumbsUp, faComment, faArrowUp, faCheck, faTimes, faBan, faLaugh, faLaughWink, faLaughSquint, faGrinSquintTears, faGrinTears } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp as farThumbsUp, faComment as farComment, faPaperPlane as farPaperPlane, faEdit as farEdit, faGrinTears as farGrinTears } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUser, faBell, faSignOutAlt, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { toast } from 'sonner';



library.add(faHome, faUser, faBell, faSignOutAlt);

const UserPost = ({ item, currentUse, comment }) => {

    const [likes, setLikes] = useState(0);

    const [count_Comment, setCommentCount] = useState(0);
    const [showCommenterDetails, setShowCommenterDetails] = useState(false);

    const [likers, setLikers] = useState([]);
    console.log(likers);

    const [isHovered, setIsHovered] = useState(false);
    const [showLikersModal, setShowLikersModal] = useState(false);

    const userFirstname = localStorage.getItem('Firstname');
    const userImage = localStorage.getItem('ProfilePic') || '';


    const [isUserLiked, setIsUserLiked] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [commentss, setCommentss] = useState([]);
    const [selectedPostId, setSelectedPostId] = useState(null);


    const [showBanIcon, setShowBanIcon] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const [showEditCommentModal, setShowEditCommentModal] = useState(false);
    const [editCommentId, setEditCommentId] = useState('');


    const [editingCommentId, setEditingCommentId] = useState('');
    const [editedComment, setEditedComment] = useState('');


    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showDropdownOpen, setDropdownOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);
    const dropdownRef = useRef(null);



    const [isEditingCaptionId, setIsEditingCaptionId] = useState(null);
    const [editedCaption, setEditedCaption] = useState('');
    const [postId, setPostId] = useState(null);

    const handleOpenEditCaption = (id, caption) => {
        setIsEditingCaptionId(id);
        setEditedCaption(caption);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const isUserLike = useCallback(async () => {
        try {
            const url = localStorage.getItem("url") + "user.php";
            const userId = localStorage.getItem("id");

            const jsonData = {
                userId: userId,
                postId: item.id
            }

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "isUserLiked");

            var res = await axios.post(url, formData);
            setIsUserLiked(res.data === 1);

        } catch (error) {
            alert(error);
        }

    }, [item.id]);

    const handleLikePost = async () => {
        try {
            const url = localStorage.getItem("url") + "user.php";
            const userId = localStorage.getItem("id");

            const jsonData = {
                userId: userId,
                postId: item.id
            };

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "heartpost");

            const res = await axios.post(url, formData);

            if (res.data === -5) {
                setLikes((prev) => prev - 1);
            } else if (res.data === 1) {
                setLikes((prev) => prev + 1);
            } else {
                toast.error("There was something wrong");
                console.log(res.data);
            }

            setIsUserLiked(!isUserLiked);
            fetchLikes(); // Refresh likers list

        } catch (error) {
            alert(error);
        }
    };


    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!newComment) {
            toast.error('Please enter a comment');
            return;
        }

        const postId = sessionStorage.getItem("selectedPostId");
        const userId = sessionStorage.getItem('id');

        if (!postId || !userId) {
            console.error('No post or user selected');
            return;
        }

        try {
            const jsonData = {
                uploadId: postId,
                userId: userId,
                comment_message: newComment,
            };

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "commentPost");

            const response = await axios.post(`http://localhost/api/user.php`, formData);
            console.log('Comment added successfully:', response.data);



        } catch (error) {
            console.error('Error adding comment:', error);
        }
        finally {
            await fetchComments();

            // countComments();

            setNewComment('');
        }
    };

    const fetchComments = async () => {
        try {
            const postId = sessionStorage.getItem("selectedPostId");

            if (!postId) {
                console.error('No post selected');
                return;
            }

            const jsonData = {
                uploadId: postId,
            };

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "fetchComment");

            var res = await axios.post(`http://localhost/api/user.php`, formData);

            console.log("sd", res)

            if (res.data !== 0) {
                console.log("Comment niya to", res.data);
                const commentList = res.data;

                setComments(commentList);
                localStorage.setItem(`comments_${postId}`, JSON.stringify(commentList));

                // setShowCommenterDetails(true);

            } else {
                console.error('Error fetching comments:', res.data.message);
            }

            // axios.post(`http://localhost/api/user.php`, formData)
            //     .then(response => {
            //         console.log("natawag na", response);


            //     })
            //     .catch(error => {
            //     });
        } catch (error) {
            console.error('Error fetching comments:', error);

        }

    };

    const fetchCountComments = async () => {
        try {
            console.log("fetching count comments");
            const postId = sessionStorage.getItem("selectedPostId");

            if (!postId) {
                console.error('No post selected');
                return;
            }

            const jsonData = {
                uploadId: postId,
            };

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "fetchComment");

            const res = await axios.post(`http://localhost/api/user.php`, formData);

            console.log("response", res);

            if (res.data !== 0) {
                console.log("Comments data", res.data);
                const commentList = res.data;

                setComments(commentList);
                localStorage.setItem(`comments_${postId}`, JSON.stringify(commentList));
            } else {
                console.error('Error fetching comments:', res.data.message);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // useEffect(() => {
    //     fetchCountComments();
    // }, [fetchCountComments]);


    useEffect(() => {
        const storedPostId = sessionStorage.getItem('selectedPostId');
        if (storedPostId) {
            setSelectedPostId(storedPostId);
            fetchCountComments();
        }
    }, []);

    const handleMouseEnter = (postId) => {
        setSelectedPostId(postId);
        sessionStorage.setItem('selectedPostId', postId);
        fetchCountComments();
        setShowCommenterDetails(true);
    };

    const countComments = async () => {
        try {
            const url = localStorage.getItem("url") + "user.php";

            const jsonData = {
                uploadId: item.id
            };


            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "countComment");

            const res = await axios.post(url, formData);

            if (res.data && res.data.comments) {
                const modifiedComments = res.data.comments.map(comment => ({
                    ...comment,
                    commenterDetails: {
                        prof_pic: comment.prof_pic.split(','),
                        firstname: comment.firstname.split(',')
                    }
                }));

                setComments(modifiedComments);
                setCommentCount(res.data.comment_count);

                // fetchCountComments(item.id);

            } else {
                console.error('Unexpected response structure:', res.data);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    // useEffect(() => {
    //     countComments();
    // }, [countComments]);




    const [updatedComment, setUpdatedComment] = useState('');

    // const handleEditComment = async () => {
    //     try {
    //         const jsonData = {
    //             comment_id: editCommentId,
    //             updatedComment: updatedComment
    //         };
    //         console.log("asdas", JSON.stringify);

    //         const formData = new FormData();
    //         formData.append('json', JSON.stringify(jsonData));
    //         formData.append('operation', 'editComment');

    //         const response = await axios.post('http://localhost/api/user.php', formData);
    //         console.log('Comment edited successfully:', response.data);

    //         commentCloseEditModal();

    //         fetchComments();
    //     } catch (error) {
    //         console.error('Error editing comment:', error);
    //     }
    // };

    const handleEditComment = async (commentId) => {
        try {
            if (!editedComment.trim()) {
                toast.error("Comment cannot be empty");
                return;
            }

            const jsonData = {
                comment_id: commentId,
                updatedComment: editedComment
            };

            const formData = new FormData();
            formData.append('json', JSON.stringify(jsonData));
            formData.append('operation', 'editComment');

            const response = await axios.post('http://localhost/api/user.php', formData);
            console.log('Comment edited successfully:', response.data);

            setEditingCommentId(null);
            setEditedComment('');

            fetchComments();
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };


    const deleteComment = async (commentId) => {
        try {
            const jsonData = {
                comment_id: commentId
            };
            console.log("snaol", JSON.stringify(jsonData));

            const formData = new FormData();
            formData.append("operation", "deleteComment");
            formData.append("json", JSON.stringify(jsonData));

            if (window.confirm('Are you sure you want to delete this comment?')) {
                const res = await axios.post('http://localhost/api/user.php', formData);
                console.log("RESPONSE from delete comment:", res);

                if (res.data === 1) {
                    console.log('Comment deleted successfully:', res);
                    fetchComments();
                } else {
                    console.error('Error deleting comment:', res.data.message);
                }
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };



    const handleDelete = async (postId) => {
        try {
            const jsonData = {
                postId: postId
            };
            const formData = new FormData();
            formData.append("operation", "deletePost");
            formData.append("json", JSON.stringify(jsonData));

            if (window.confirm('Are you sure you want to delete this post?')) {


                const res = await axios.post('http://localhost/api/user.php', formData);
                console.log("RESPONSE:", res);

                if (res.data === 1) {
                    console.log('Post deleted successfully:', res);
                    toast.success("Deleted Successful");
                    window.location.reload();

                } else {
                    console.error('Error deleting post:', res.message);
                }


            }
        } catch (error) {
            console.error('Error deleting post:', error);

        }
    };

    const [updatedCaption, setUpdatedCaption] = useState(item.caption);


    const handleUpdateCaption = async (postId) => {
        try {
            if (editedCaption === item.caption) {
                setIsEditingCaptionId(null);
                return;
            }

            const jsonData = {
                postId: postId,
                updatedCaption: editedCaption
            };

            const formData = new FormData();
            formData.append("operation", "editPost");
            formData.append("json", JSON.stringify(jsonData));

            const response = await axios.post('http://localhost/api/user.php', formData);

            if (response.data.status === 1) {
                console.log('Caption updated successfully:', response.data);
                toast.success("Updated Successful");
                setIsEditingCaptionId(null);
                window.location.reload();
            } else {
                console.error('Error updating caption:', response.data);
                toast.error("Error updating caption. Please try again later.");
            }
        } catch (error) {
            console.error('Error updating caption:', error);
            toast.error("Error updating caption. Please try again later.");
        }
    };





    // const handleEdit = async (postId) => {
    //     try {
    //         const jsonData = {
    //             postId: postId,
    //             updatedCaption: updatedCaption
    //         };

    //         const formData = new FormData();
    //         formData.append("operation", "editPost");
    //         formData.append("json", JSON.stringify(jsonData));

    //         const response = await axios.post('http://localhost/api/user.php', formData);

    //         if (response.data.status === 1) {
    //             console.log('Caption updated successfully:', response.data);
    //             toast.success("Updated Successful");

    //             window.location.reload();

    //         } else {
    //             console.error('Error updating caption:', response.data);
    //             alert("Error updating captionss. Please try again later.");
    //         }
    //     } catch (error) {
    //         console.error('Error updating caption:', error);
    //         alert("Error updating caption. Please try again later.");
    //     }
    // };

    const handleOpenEditModal = (itemId) => {
        setSelectedItemId(itemId);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setSelectedItemId(null);
        setShowEditModal(false);
    };

    const commentOpenEditModal = (commentId, commentMessage) => {
        setEditCommentId(commentId);
        setUpdatedComment(commentMessage);
        // setShowEditCommentModal(true);
    };

    const commentCloseEditModal = () => {
        setShowEditCommentModal(false);
        setUpdatedComment(''); // Clear the updated comment state when modal is closed
    };


    const handleCloseCommentModal = () => {
        console.log("asdsa");
        sessionStorage.removeItem("selectedPostId");
        setShowCommentModal(false);

    }
    const handleShowCommentModal = (postId) => {
        sessionStorage.setItem("selectedPostId", postId);
        setShowCommentModal(true);
    }

    function openUserProfile(userID, liker) {
        console.log("Navigating to user profile with ID: " + userID);
        sessionStorage.setItem("idtopost", userID);
        sessionStorage.setItem("firstname", item.firstname);
        sessionStorage.setItem("lastname", item.lastname);
        sessionStorage.setItem("userProfile", item.prof_pic);

        window.location.href = `/sync/UserProfile?userId=${userID}`;
    }

    function openUserLikeProfile(userID, liker) {
        console.log("Navigating to user profile with ID: " + userID);
        sessionStorage.setItem("idtopost", userID);
        sessionStorage.setItem("firstname", liker.firstname);
        sessionStorage.setItem("lastname", liker.lastname);
        sessionStorage.setItem("userProfile", liker.profilePic);

        window.location.href = `/sync/UserProfile?userId=${userID}`;
    }





    useEffect(() => {
        setLikes(item.likes);
        isUserLike();




        const postId = item.id;
        fetchComments(postId);
        // const storedComments = localStorage.getItem(`comments_${postId}`);
        // if (storedComments) {
        //     console.log("Fetching pikas mo to", postId);

        //     setComments(JSON.parse(storedComments));
        // } else {
        //     console.log("Fetching comments mo to", postId);
        //     fetchComments(postId);
        // }

        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };


    }, [isUserLike, item.likes, showCommentModal, dropdownRef]);


    // useEffect(() => {


    // }, [setCommentCount, item.count_Comment]);


    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const formatDateTime = (dateTimeString) => {
        console.log("dateTimeString:", dateTimeString); // Log the value of dateTimeString
        if (dateTimeString) {
            const dateTimeParts = dateTimeString.split(/[- :]/);
            const year = dateTimeParts[0];
            const month = dateTimeParts[1] - 1;
            const day = dateTimeParts[2];
            const hour = dateTimeParts[3];
            const minute = dateTimeParts[4];
            const second = dateTimeParts[5];

            const dateTime = new Date(year, month, day, hour, minute, second);

            if (!isNaN(dateTime.getTime())) {
                return `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`;
            }
        }
        return "Invalid Date";
    };

    const dropdownComment = () => {
        setDropdownOpen(!showDropdownOpen);
    };


    const handleCancelEditCaption = () => {
        setIsEditingCaptionId(null);
    };




    const fetchLikes = useCallback(async () => {
        try {
            const url = localStorage.getItem("url") + "user.php";
            const userId = localStorage.getItem("id");

            const jsonData = {
                userId: userId,
                postId: item.id
            };

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "getLikes");

            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const data = response.data;


            if (data.length > 0) {
                setLikes(data[0].likes);

                // Process likers data
                let likersData = data[0].likers_firstnames.split(',').map((firstname, index) => ({
                    firstname: firstname,
                    lastname: data[0].likers_lastnames.split(',')[index],
                    profilePic: data[0].likers_profile_pics.split(',')[index],
                    userID: data[0].likers_ids.split(',')[index]
                }));

                setLikers(likersData);
            } else {
                setLikes(0);
                setLikers([]);
            }

        } catch (error) {
            console.error("Error fetching likes", error);
        }
    }, [item.id]);


    useEffect(() => {
        fetchLikes();
    }, [fetchLikes]);

    const handleClickLikes = () => {
        setShowLikersModal(true);
    };







    return (
        <>


            <Card className="text-white mb-3" style={{ backgroundColor: "#242526", borderRadius: "20px" }}>
                <Card.Body>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex' }}>
                            <a href="#" onClick={() => openUserProfile(item.userID)} className="no-underline">
                                <img src={"http://localhost/api/profPic/" + item.prof_pic} className="rounded-full" alt="" style={{ width: '45px', height: '45px' }} />
                            </a>
                            <div style={{ marginLeft: '10px' }}>
                                <a href="#" onClick={() => openUserProfile(item.userID)} className="no-underline text-gray-300 relative group">
                                    <p style={{ fontSize: "17px", marginBottom: '5px' }}>{item.firstname}</p>
                                    <div className="h-0.5 bg-blue-500 absolute bottom-0 left-0 w-full transform scale-x-0 transition-transform origin-left group-hover:scale-x-100"></div>
                                </a>



                                <p className="text-right text-gray-500 text-xs ">{item.upload_date}</p>
                            </div>
                        </div>


                        <div className="relative" style={{ marginLeft: 'auto' }}>
                            {item.userID === localStorage.getItem('id') && (
                                <>
                                    <button onClick={toggleDropdown} className="flex items-center rounded text-gray-300 hover:text-white focus:outline-none">
                                        <svg className="h-4 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <circle cx="10" cy="10" r="2" fill="#fff" />
                                            <circle cx="5" cy="10" r="2" fill="#fff" />
                                            <circle cx="15" cy="10" r="2" fill="#fff" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                        <div>
                            {isDropdownOpen && (
                                <div ref={dropdownRef} className="absolute mt-4 top-3 right-0 bg-slate-800 shadow-md rounded-2xl flex flex-col items-center p-3">
                                    <div className="flex items-center">
                                        {isEditingCaptionId === item.id ? (
                                            <>
                                                <button onClick={() => handleUpdateCaption(item.id)} className="mr-5 flex items-center text-gray-300 hover:text-green-500 focus:outline-none">
                                                    <FontAwesomeIcon icon={faCheck} className="mr-1" />
                                                </button>
                                                <button onClick={() => handleCancelEditCaption()} className="mr-5 flex items-center text-gray-300 hover:text-red-500 focus:outline-none">
                                                    <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                                </button>

                                            </>
                                        ) : (
                                            <button onClick={() => handleOpenEditCaption(item.id, item.caption)} className="flex items-center text-gray-300 hover:text-green-500 focus:outline-none">
                                                <FontAwesomeIcon icon={farEdit} className="mr-5" />
                                            </button>
                                        )}
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            className=" hover:text-red-500"
                                            style={{ width: '17px', height: '17px', cursor: 'pointer' }}
                                            onClick={() => handleDelete(item.id)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        {isEditingCaptionId === item.id ? (
                            <input
                                type="text"
                                className="text-start text-[15.5px] outline-none bg-transparent text-white mb-3"
                                value={editedCaption}
                                onChange={(e) => setEditedCaption(e.target.value)}
                                autoFocus
                            />
                        ) : (
                            <p className='text-start text-[15.5px]'>{item.caption}</p>
                        )}
                    </div>

                    {item.filename && (
                        <div className="relative" style={{ height: '400px', overflow: 'hidden' }}>
                            <Image src={"http://localhost/sync/uploads/" + item.filename} className="w-full cursor-pointer rounded-lg absolute inset-0 object-cover" onClick={() => handleShowCommentModal(item.id)} />
                        </div>
                    )}

                    <div className="flex justify-between  mt-3" style={{ fontSize: "14px" }}>
                        <p
                            className='text-start inline-block cursor-pointer'
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => handleClickLikes()}
                        >
                            <FontAwesomeIcon icon={faGrinTears} className="mr-1" />
                            {likes}
                        </p>
                        {isHovered && (
                            <div className="absolute bg-slate-600 shadow-md p-2 rounded mt-6 z-10 w-48">
                                {likers.slice(0, 5).map((liker, index) => (
                                    <div key={index} className="flex items-center ">
                                        <img
                                            src={`http://localhost/api/profPic/${liker.profilePic}`}
                                            alt={`${liker.firstname} ${liker.lastname}`}
                                            className="w-6 h-6 rounded-full mr-1"
                                        />
                                        <p className="text-sm text-white cursor-pointer mt-3" onClick={() => openUserProfile(liker.userID)}>
                                            <span>{liker.firstname} {liker.lastname}</span>
                                        </p>
                                    </div>
                                ))}
                                {likers.length > 5 && (
                                    <div className="flex items-center">
                                        <p className="text-sm text-white cursor-pointer mt-3">
                                            <span>and {likers.length - 5} more</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}


                        {/* comment count hover */}
                        <div className='text-end' key={item.id}>
                            <span
                                className="text-gray-500 cursor-pointer"
                                onMouseEnter={() => handleMouseEnter(item.id)}
                                onMouseLeave={() => setShowCommenterDetails(false)}
                                onClick={() => handleShowCommentModal(item.id)}

                            >
                                {item.countComment} {item.countComment === 1 ? 'comment' : 'comments'}
                            </span>

                            {showCommenterDetails && selectedPostId === item.id && (
                                <div
                                    className="absolute bg-slate-600 shadow-md p-2 rounded mt-2 z-10 w-48"
                                    onMouseEnter={() => setShowCommenterDetails(true)}
                                    onMouseLeave={() => setShowCommenterDetails(false)}
                                >
                                    {comments.length > 0 && (
                                        <>
                                            {comments.slice(0, 5).map((comment, index) => (
                                                <div key={index} className="flex items-center mb-2">
                                                    <img
                                                        src={`http://localhost/api/profPic/${comment.prof_pic}`}
                                                        alt={`${comment.firstname} ${comment.lastname}`}
                                                        className="w-6 h-6 rounded-full mr-2"
                                                    />
                                                    <p className="text-sm text-white cursor-pointer mt-3">
                                                        {comment.firstname} {comment.lastname}
                                                    </p>
                                                </div>
                                            ))}
                                            {comments.length > 5 && (
                                                <p className="text-sm text-white cursor-pointer mt-3 text-start">
                                                    and {comments.length - 5} more
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>

                    <hr style={{ width: '100%', borderTop: '1px solid #ccc', margin: '-2px 0', }} />

                    <div className='flex items-center mt-3'>
                        <div className="cursor-pointer text-gray-300 hover:text-yellow-300 flex items-center">
                            <FontAwesomeIcon
                                className={isUserLiked ? 'text-yellow-300' : ''}
                                icon={isUserLiked ? faGrinTears : farGrinTears}
                                style={{ width: '30px', height: '30px', cursor: 'pointer', marginLeft: '10px' }}
                                onClick={handleLikePost}
                            />
                            <span style={{ lineHeight: '30px', marginLeft: '5px', color: isUserLiked ? 'yellow' : 'inherit' }} onClick={handleLikePost}>
                                {isUserLiked ? 'haha' : 'haha'}
                            </span>
                        </div>
                        <div className="ml-12 sm:ml-36 flex items-center cursor-pointer text-gray-300 hover:text-green-500">
                            <FontAwesomeIcon
                                icon={farComment}
                                className="w-8 h-8 ml-2 cursor-pointer"
                                onClick={() => handleShowCommentModal(item.id)}
                            />
                            <span className="ml-2" style={{ lineHeight: '30px', cursor: 'pointer' }} onClick={() => handleShowCommentModal(item.id)}>Comment</span>
                        </div>
                    </div>

                </Card.Body>
            </Card>


            <Modal show={showLikersModal} onHide={() => setShowLikersModal(false)}>
                <Modal.Header closeButton className='bg-[#242526] text-white'>
                    <Modal.Title>Likers</Modal.Title>
                </Modal.Header>
                <Modal.Body className='bg-[#242526] text-white'>
                    {likers.map((liker, index) => (
                        <div key={index} className="flex items-center mt-2">
                            <img
                                src={`http://localhost/api/profPic/${liker.profilePic}`}
                                alt={`${liker.firstname} ${liker.lastname}`}
                                className="w-6 h-6 rounded-full mr-2"
                            />
                            <p
                                className="text-sm text-white cursor-pointer mt-3"
                                onClick={() => openUserLikeProfile(liker.userID, liker)}
                            >
                                {liker.firstname} {liker.lastname}
                            </p>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#242526' }}>
                    <Button variant="secondary" onClick={() => setShowLikersModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>





            <Modal show={showCommentModal} onHide={handleCloseCommentModal} dialogClassName="w-20/20 md:w-3/4 lg:w-2/3 xl:w-1/2">
                <Modal.Body className="bg-[#242526] text-white">
                    <div className="mb-4">

                        <div className="flex">
                            <img src={"http://localhost/api/profPic/" + item.prof_pic} className="rounded-full" alt="" style={{ width: '45px', height: '45px' }} />
                            <div style={{ marginLeft: '10px' }}>
                                <p style={{ fontSize: "17px", marginBottom: '5px' }}>{item.firstname}</p>
                                <p className="text-right text-gray-500 text-xs">{item.upload_date}</p>
                            </div>

                        </div>
                        <p className='text-start text-[15.5px]'>{item.caption}</p>

                        {item.filename && (
                            <img src={"http://localhost/sync/uploads/" + item.filename} className="rounded-lg mx-auto" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                        )}
                    </div>


                    <div className="flex justify-between text-gray-400" style={{ fontSize: "14px" }}>
                        <p
                            className='text-start'
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                            {likes}
                        </p>
                        {isHovered && (
                            <div className="absolute bg-slate-600 shadow-md p-2 rounded mt-6 z-10 w-48">
                                {likers.slice(0, 5).map((liker, index) => (
                                    <div key={index} className="flex items-center ">
                                        <img
                                            src={`http://localhost/api/profPic/${liker.profilePic}`}
                                            alt={`${liker.firstname} ${liker.lastname}`}
                                            className="w-6 h-6 rounded-full mr-1"
                                        />
                                        <p className="text-sm text-white cursor-pointer mt-3" onClick={() => openUserProfile(liker.userID)}>
                                            <span>{liker.firstname} {liker.lastname}</span>
                                        </p>
                                    </div>
                                ))}
                                {likers.length > 5 && (
                                    <div className="flex items-center">
                                        <p className="text-sm text-white cursor-pointer mt-3">
                                            <span>and {likers.length - 5} more</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        <p className='text-end'>
                            {comments.length} <FontAwesomeIcon icon={faComment} className="mr-1" />
                        </p>
                    </div>


                    {comments.length > 0 && comments.map((comment, index) => (
                        <div key={index} className="mb-2">
                            <div className={`bg-slate-900 text-white p-2 rounded-lg ${comment.userComment ? 'bg-blue-100' : ''}`}>

                                <div className="relative">
                                    {comment.comment_userID === localStorage.getItem('id') && (
                                        <div className="flex items-center">
                                            <button className="flex items-center text-gray-300 hover:text-white focus:outline-none absolute top-0 right-0">
                                                <FontAwesomeIcon
                                                    icon={farEdit}
                                                    className="mr-1 hover:text-blue-500"
                                                    style={{ width: '15px', height: '15px', cursor: 'pointer', marginRight: '20px' }}
                                                    onClick={() => {
                                                        setEditedComment(comment.comment_message);
                                                        setEditingCommentId(comment.comment_id);
                                                    }}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faTrashAlt}
                                                    className="mr-1 hover:text-red-500"
                                                    style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                                                    onClick={() => deleteComment(comment.comment_id)}
                                                />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {editingCommentId === comment.comment_id ? (
                                    <>
                                        <div className="flex items-center">
                                            <img src={"http://localhost/api/profPic/" + comment.prof_pic} className="rounded-full mr-2 mb-4" alt="" style={{ width: '45px', height: '45px' }} /> {/* Profile picture */}
                                            <div>
                                                <p style={{ fontSize: "17px", marginBottom: '5px' }}>{comment.firstname}</p>
                                                <p className="text-right text-gray-500 text-xs">{comment.comment_date_created}</p>
                                            </div>
                                        </div>


                                        <textarea
                                            value={editedComment}
                                            onChange={(e) => setEditedComment(e.target.value)}
                                            className="outline-none bg-slate-900 text-white w-full "

                                        />
                                        <div className="text-right mt-2">
                                            <button type="button"
                                                className="inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                                                onClick={() => handleEditComment(comment.comment_id)}>
                                                <FontAwesomeIcon icon={faCheck} className="mr-1" />
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                onClick={() => setEditingCommentId(null)}>
                                                <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                            </button>

                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex' }}>
                                            <img src={"http://localhost/api/profPic/" + comment.prof_pic} className="rounded-full mr-2" alt="" style={{ width: '45px', height: '45px' }} />
                                            <div >
                                                <p style={{ fontSize: "17px", marginBottom: '5px' }} >{comment.firstname}</p>

                                                <p className="text-left text-gray-500 text-xs">{comment.comment_date_created}</p>
                                            </div>
                                        </div>



                                        <p>{comment.comment_message}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}


                    <form onSubmit={handleSubmitComment} className="mb-4">
                        <div className="relative flex">
                            <img src={"http://localhost/api/profPic/" + userImage} className="rounded-full mt-2.5" alt="" style={{ width: '40px', height: '40px' }} />
                            <input
                                type="text"
                                id="commentText"
                                className="mt-2 ml-2 p-2 pl-10 block w-full shadow-sm rounded-2xl bg-slate-900 text-white"
                                placeholder={`Comment as ${userFirstname || 'Guest'}`}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute inset-y-0 right-0 flex items-center justify-center rounded-full text-white cursor-pointer mr-3 mt-1"
                                onMouseEnter={() => setShowBanIcon(!newComment)}
                                onMouseLeave={() => setShowBanIcon(false)}
                            >
                                <FontAwesomeIcon
                                    icon={showBanIcon ? faBan : faArrowUp}
                                    style={{ color: newComment ? "#3366ff" : "gray", transition: 'color 0.3s' }}
                                    title={!newComment ? "Prohibited" : ""}
                                />
                            </button>
                        </div>
                    </form>



                    <div className="text-right">
                        <button type="button" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-2xl text-white bg-slate-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleCloseCommentModal}>
                            Close
                        </button>
                    </div>
                </Modal.Body>
            </Modal>







            {/* <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton className='bg-[#242526] text-white'>
                    <Modal.Title>Edit Caption</Modal.Title>
                </Modal.Header>
                <Modal.Body className='bg-[#242526] text-white'>

                    <div className="mb-4">
                        <p style={{ fontSize: "18px" }}>{item.firstname}</p>
                        <input
                            type="text"
                            value={updatedCaption}
                            onChange={(e) => setUpdatedCaption(e.target.value)}
                            placeholder="Enter updated caption"
                            className="mb-3 outline-none bg-[#242526]"
                        />
                        <img src={"http://localhost/sync/uploads/" + item.filename} className="rounded-lg mx-auto" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                    </div>


                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#242526' }}>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleEdit(item.id)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal> */}


            <Modal show={showEditCommentModal} onHide={commentCloseEditModal}>
                <Modal.Header closeButton className='bg-[#242526] text-white'>
                    <Modal.Title>Edit Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body className='bg-[#242526] text-white'>
                    <textarea
                        value={updatedComment}
                        onChange={(e) => setUpdatedComment(e.target.value)}
                        placeholder="Enter updated comment"
                        className="mb-3 outline-none bg-[#242526] text-white w-full"

                    />
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#242526' }}>
                    <Button variant="secondary" onClick={commentCloseEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleEditComment()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>


        </>
    )

}

export default UserPost
