import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Container, Card, Modal, Button, Image, Row, Form } from 'react-bootstrap';
import { faComment, faThumbsUp, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUser, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { toast } from 'sonner';



library.add(faHome, faUser, faBell, faSignOutAlt);

const UserPost = ({ item, currentUser }) => {

    let [likes, setLikes] = useState(0);


    const [isUserLiked, setIsUserLiked] = useState(false);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const dropdownRef = useRef(null);

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
            console.error('Comment is empty');
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



                setShowCommentModal(true);
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
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

    const [updatedCaption, setEditedCaption] = useState(item.caption);

    const handleEdit = async (postId) => {
        try {
            const jsonData = {
                postId: postId,
                updatedCaption: updatedCaption
            };

            const formData = new FormData();
            formData.append("operation", "editPost");
            formData.append("json", JSON.stringify(jsonData));

            const response = await axios.post('http://localhost/api/user.php', formData);

            if (response.data.status === 1) {
                console.log('Caption updated successfully:', response.data);
                toast.success("Updated Successful");
                window.location.reload();



            } else {
                console.error('Error updating caption:', response.data);
                alert("Error updating captionss. Please try again later.");
            }
        } catch (error) {
            console.error('Error updating caption:', error);
            alert("Error updating caption. Please try again later.");
        }
    };

    const handleOpenEditModal = (itemId) => {
        setSelectedItemId(itemId);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setSelectedItemId(null);
        setShowEditModal(false);
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

        if (showCommentModal) {

            fetchComments();
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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>


            <Card className="text-white mb-3" style={{ backgroundColor: "#242526", borderRadius: "30px" }}>
                <Card.Body>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: "18px" }}>{item.firstname}</p>
                            <p className='text-start text-[16px]'>{item.caption}</p>
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

                                    {isDropdownOpen && (
                                        <div ref={dropdownRef} className="absolute mt-2 top-5 right-0 bg-slate-800 shadow-md rounded-md p-2 flex flex-col items-center">
                                            <div className="flex items-center">

                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                    className="mr-1 hover:text-blue-500"
                                                    style={{ width: '20px', height: '20px', cursor: 'pointer', marginRight: '20px' }}
                                                    onClick={() => handleOpenEditModal()}
                                                />

                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="mr-1 hover:text-red-500"
                                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                                    onClick={() => handleDelete(item.id)}
                                                />



                                            </div>
                                        </div>
                                    )}
                                </>



                            )}
                        </div>
                    </div >
                    <Image src={"http://localhost/sync/uploads/" + item.filename} className="w-full" />
                    <p className="text-right text-gray-500 text-xs">{item.upload_date}</p>

                    <div style={{ display: 'flex', alignItems: 'center', }}>
                        {likes}
                        <FontAwesomeIcon
                            className={isUserLiked ? 'text-blue-500' : ''}
                            icon={faThumbsUp}
                            style={{ width: '30px', height: '30px', cursor: 'pointer', marginLeft: '10px' }}
                            onClick={() => handleLikePost()}
                        />
                        <span style={{ lineHeight: '30px', marginLeft: '5px', color: isUserLiked ? 'blue' : 'inherit' }}>
                            {isUserLiked ? 'Liked' : 'Like'}
                        </span>
                        <FontAwesomeIcon
                            icon={faComment}
                            style={{ width: '30px', height: '30px', marginLeft: '30px', cursor: 'pointer' }}
                            className='hover:text-blue-500'
                            onClick={() => handleShowCommentModal(item.id)}
                        />

                    </div>

                </Card.Body >
            </Card >





            <Modal show={showCommentModal} onHide={handleCloseCommentModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Comments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {comments.length > 0 && comments.map((comment, index) => (
                        <div key={index}>
                            <p>{comment.firstname}</p>
                            <p>{comment.comment_message}</p>
                        </div>

                    ))}
                    <Form onSubmit={handleSubmitComment}>
                        <Form.Group controlId="commentText">
                            <Form.Label>Add a comment:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your comment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCommentModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Caption</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <input
                        type="text"
                        value={updatedCaption}
                        onChange={(e) => setEditedCaption(e.target.value)}
                        placeholder="Enter updated caption"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleEdit(item.id)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>


        </>
    )
}

export default UserPost
