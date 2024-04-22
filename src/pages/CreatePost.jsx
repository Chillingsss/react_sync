import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const CreatePost = () => {
    const [showModal, setShowModal] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState(null);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleContentChange = (e) => {
        setPostContent(e.target.value);
    };

    const handleImageChange = (e) => {
        setPostImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', postImage);
        formData.append('caption', postContent);
        formData.append('userID', localStorage.getItem('id')); // Replace '123' with the actual user ID

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
            <Button variant="primary" onClick={handleShow} className="mt-5">
                Whats on your mind?
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="postContent">
                            <Form.Label>Post Content</Form.Label>
                            <Form.Control as="textarea" rows={3} value={postContent} onChange={handleContentChange} />
                        </Form.Group>
                        <Form.Group controlId="postImage">
                            <Form.Label>Upload Image</Form.Label>
                            <Form.Control type="file" onChange={handleImageChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="flex justify-center">
                            Post
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CreatePost;
