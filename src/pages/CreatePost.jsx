import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'sonner';

const CreatePost = () => {
    const [showModal, setShowModal] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState(null);
    // const imagePreview = document.getElementById('imagePreview');
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [imageUrl, setImageUrl] = useState(null);
    const handleContentChange = (e) => {
        setPostContent(e.target.value);
    };

    const handleImageChange = (e) => {
        setPostImage(e.target.files[0]);
        // console.log(e.target.files[0]);
        // imagePreview.src = 'C:/Users/ACER/Pictures/' + e.target.files[0].name;
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!postImage && !postContent) {
            toast.error('Image or caption is required.');
            return;
        }

        const formData = new FormData();
        formData.append('file', postImage);
        formData.append('caption', postContent);
        formData.append('userID', localStorage.getItem('id'));

        try {
            const response = await axios.post('http://localhost/api/upload.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            window.location.reload();
            handleClose();
        } catch (error) {
            console.error('Error:', error);
        }
    };



    return (
        <>
            <div className="flex justify-center">
                <Button onClick={handleShow} className=" bg-transparent border border-gray-600 text-gray-600">
                    Whats on your mind?
                </Button>
            </div>


            <Modal
                show={showModal}
                onHide={handleClose}>
                <Modal.Header
                    closeButton
                    className="bg-[#242526] text-white">
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-[#242526] text-white">
                    <Form
                        onSubmit={handleSubmit}>
                        <Form.Group
                            controlId="postContent">
                            <Form.Label>Post Content</Form.Label>
                            <Form.Control
                                className='bg-[#242526'
                                style={{ backgroundColor: '#242526', color: 'white' }}
                                as="textarea"
                                rows={3}
                                value={postContent}
                                onChange={handleContentChange} />
                        </Form.Group>
                        <Form.Group
                            controlId="postImage">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleImageChange}
                                style={{ backgroundColor: '#242526', color: 'white' }}
                            />
                            {imageUrl ? (
                                <>
                                    <h2>Preview:</h2>
                                    <div className=''>
                                        <div className=''>
                                            <img src={imageUrl} alt="Preview" className='w-[500px] h-[200px] object-contain' />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p>No image selected</p>
                            )}
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            className="flex justify-center">
                            Post
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CreatePost;
