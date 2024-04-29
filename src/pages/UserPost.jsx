import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Container, Card, Modal, Button, Image, Row, Form } from 'react-bootstrap';
import { faComment, faThumbsUp, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUser, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { toast } from 'sonner';



library.add(faHome, faUser, faBell, faSignOutAlt);

const UserPost = ({ item, currentUse, comment }) => {

    let [likes, setLikes] = useState(0);
    const [count_Comment, setCommentCount] = useState(0);


    const [isUserLiked, setIsUserLiked] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);

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
            }

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "heartpost");

            var res = await axios.post(url, formData);

            if (res.data === -5) {
                setLikes(parseInt(likes) - 1);
            } else if (res.data === 1) {
                setLikes(parseInt(likes) + 1);
            } else {
                alert("there was something wrong");
                console.log(res.data);
            }

            setIsUserLiked(!isUserLiked)

        } catch (error) {
            alert(error);
        }
    }


    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!newComment) {
            alert('Please enter a comment');
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



            fetchComments();

            countComments();

            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const fetchComments = () => {
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

        axios.post(`http://localhost/api/user.php`, formData)
            .then(response => {
                console.log("natawag na", response);

                const commentList = response.data;



                setComments(commentList);
                localStorage.setItem(`comments_${postId}`, JSON.stringify(commentList));


                setShowCommentModal(true);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    };

    const countComments = async () => {
        try {
            const url = localStorage.getItem("url") + "user.php";

            const jsonData = {
                uploadId: item.id
            }

            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "countComment");

            var res = await axios.post(url, formData);

            setCommentCount(res.data);


        } catch (error) {

        }
    };


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
                alert("Error updating caption. Please try again later.");
            }
        } catch (error) {
            console.error('Error updating caption:', error);
            alert("Error updating caption. Please try again later.");
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



    useEffect(() => {
        setLikes(item.likes);
        isUserLike();




        const postId = item.id;

        const storedComments = localStorage.getItem(`comments_${postId}`);
        if (storedComments) {
            setComments(JSON.parse(storedComments));
        } else {
            fetchComments(postId);
        }

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


    useEffect(() => {


    }, [setCommentCount, item.count_Comment]);


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




    return (
        <>


            <Card className="text-white mb-3" style={{ backgroundColor: "#242526", borderRadius: "30px" }}>
                <Card.Body>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: "17.5px" }}>{item.firstname}</p>
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
                        <div className="relative">
                            {item.userID === localStorage.getItem('id') && (
                                <>

                                    <button onClick={toggleDropdown} className="flex items-center text-gray-300 hover:text-white focus:outline-none">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <circle cx="10" cy="10" r="2" fill="#fff" />
                                            <circle cx="5" cy="10" r="2" fill="#fff" />
                                            <circle cx="15" cy="10" r="2" fill="#fff" />
                                        </svg>
                                    </button>
                                </>
                            )}
                            {isDropdownOpen && (
                                <div ref={dropdownRef} className="absolute mt-2 top-3 right-0 bg-slate-800 shadow-md rounded-md p-2 flex flex-col items-center p-3">
                                    <div className="flex items-center">
                                        {isEditingCaptionId === item.id ? (
                                            <>
                                                <button onClick={() => handleUpdateCaption(item.id)} className="mr-5 flex items-center text-gray-300 hover:text-white focus:outline-none">
                                                    Save
                                                </button>
                                                <button onClick={() => handleCancelEditCaption()} className="mr-5 flex items-center text-gray-300 hover:text-white focus:outline-none">
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleOpenEditCaption(item.id, item.caption)} className="flex items-center text-gray-300 hover:text-white focus:outline-none">
                                                <FontAwesomeIcon icon={faEdit} className="mr-5" />
                                            </button>
                                        )}
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="mr-1 hover:text-red-500"
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                            onClick={() => handleDelete(item.id)}
                                        />
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                    <Image src={"http://localhost/sync/uploads/" + item.filename} className="w-full cursor-pointer rounded-lg" onClick={() => handleShowCommentModal(item.id)} />
                    <p className="text-right text-gray-500 text-xs">{item.upload_date}</p>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {likes}
                        <div className="cursor-pointer text-gray-300 hover:text-blue-500" style={{ display: 'flex', alignItems: 'center' }}>
                            <FontAwesomeIcon
                                className={isUserLiked ? 'text-blue-500' : ''}
                                icon={faThumbsUp}
                                style={{ width: '30px', height: '30px', cursor: 'pointer', marginLeft: '10px' }}
                                onClick={handleLikePost}
                            />
                            <span style={{ lineHeight: '30px', marginLeft: '5px', color: isUserLiked ? 'blue' : 'inherit' }} onClick={handleLikePost}>
                                {isUserLiked ? 'Liked' : 'Like'}
                            </span>
                        </div>
                        <div className="ml-4 sm:ml-28 flex items-center cursor-pointer text-gray-300 hover:text-green-500">
                            {item.countComment}
                            <FontAwesomeIcon
                                icon={faComment}
                                className="w-8 h-8 ml-2 cursor-pointer"
                                onClick={() => handleShowCommentModal(item.id)}
                            />
                            <span className="ml-2" style={{ lineHeight: '30px', cursor: 'pointer' }} onClick={() => handleShowCommentModal(item.id)}>Comment</span>
                        </div>
                    </div>
                </Card.Body>
            </Card>





            <Modal show={showCommentModal} onHide={handleCloseCommentModal}>
                <Modal.Body className="bg-[#242526] text-white">
                    <div className="mb-4">
                        <p style={{ fontSize: "18px" }}>{item.firstname}</p>
                        <p style={{ fontSize: "16px" }}>{item.caption}</p>
                        <img src={"http://localhost/sync/uploads/" + item.filename} className="rounded-lg mx-auto" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                    </div>
                    <div className="flex justify-between text-gray-400" style={{ fontSize: "14px" }}>
                        <p className='text-start'>
                            <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                            {likes}
                        </p>
                        <p className='text-end'>
                            {comments.length} <FontAwesomeIcon icon={faComment} className="mr-1" />
                        </p>
                    </div>
                    {comments.length > 0 && comments.map((comment, index) => (
                        <div key={index} className="mb-2 ">
                            <div className={`bg-slate-900 text-white p-2 rounded-lg ${comment.userComment ? 'bg-blue-100' : ''}`}>
                                <div className="relative">
                                    {comment.comment_userID === localStorage.getItem('id') && (
                                        <>
                                            <button className="flex items-center text-gray-300 hover:text-white focus:outline-none absolute top-0 right-0">
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                    className="mr-1 hover:text-blue-500"
                                                    style={{ width: '20px', height: '20px', cursor: 'pointer', marginRight: '20px' }}
                                                    onClick={() => {
                                                        setEditedComment(comment.comment_message);
                                                        setEditingCommentId(comment.comment_id);
                                                    }}
                                                />
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="mr-1 hover:text-red-500"
                                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                                    onClick={() => deleteComment(comment.comment_id)}
                                                />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {editingCommentId === comment.comment_id ? (
                                    <>
                                        <p className="font-bold">{comment.firstname}</p>
                                        <textarea
                                            value={editedComment}
                                            onChange={(e) => setEditedComment(e.target.value)}
                                            className="outline-none bg-slate-900 text-white w-full"

                                        />
                                        <div className="text-right mt-2">
                                            <button type="button" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2" onClick={() => handleEditComment(comment.comment_id)}>Save</button>
                                            <button type="button" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => setEditingCommentId(null)}>Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-bold">{comment.firstname}</p>
                                        <p>{comment.comment_message}</p>
                                    </>
                                )}
                                <p className="text-gray-400 text-xs">{comment.comment_date_created}</p>
                            </div>
                        </div>
                    ))}
                    <form onSubmit={handleSubmitComment}>
                        <div className="mb-4 ">
                            <label htmlFor="commentText" className="block text-sm font-medium bg-[#242526] text-white">Add a comment:</label>
                            <input
                                type="text"
                                id="commentText"
                                className="mt-1 p-2 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md bg-[#242526] text-white"
                                placeholder="Enter your comment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4">Submit</button>
                            <button type="button" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleCloseCommentModal}>
                                Close
                            </button>
                        </div>
                    </form>
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
