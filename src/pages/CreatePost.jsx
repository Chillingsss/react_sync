
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'sonner';

const CreatePost = () => {
    const [showModal, setShowModal] = useState(false);
    const [postContent, setPostContent] = useState('');
    const [postImage, setPostImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const firstName = localStorage.getItem('Firstname') || '';

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleContentChange = (e) => {
        setPostContent(e.target.value);
    };

    const handleImageChange = (e) => {
        setPostImage(e.target.files[0]);
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageUrl(null);
            e.target.value = ''; // Reset the input field value to an empty string
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
            <div className="flex justify-center mt-32">
                <Button onClick={handleShow} className="bg-transparent border border-gray-600 text-gray-300" style={{ color: '#959697' }}>
                    What's on your mind, {firstName}?
                </Button>
            </div>

            <Modal
                show={showModal}
                onHide={handleClose}
            >
                <Modal.Header closeButton className="bg-[#242526] text-white">
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-[#242526] text-white">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="postContent">
                            <textarea
                                className='bg-[#242526] mt-2'
                                style={{
                                    backgroundColor: '#242526',
                                    color: 'white',
                                    width: '100%',
                                    minHeight: '40px',
                                    maxHeight: '120px',
                                    borderRadius: '8px',
                                    padding: '8px',
                                    border: '1px solid #555',
                                    resize: 'vertical',
                                }}
                                value={postContent}
                                placeholder={`What's on your mind, ${firstName}?`}
                                onChange={handleContentChange}
                            />
                        </Form.Group>

                        <br />
                        <Form.Group controlId="postImage">
                            <Form.Label style={{ color: '#959697' }}>Attach Image</Form.Label>
                            <div className="input-group">
                                <label className="custom-file-label" htmlFor="customFile">
                                    <FontAwesomeIcon icon={faImage} className=" cursor-pointer text-green-500" style={{ fontSize: '1.5em' }} />
                                </label>
                                <input
                                    type="file"
                                    className="custom-file-input"
                                    id="customFile"
                                    onChange={handleImageChange}
                                    aria-describedby="inputGroupFileAddon01"
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <br />
                            {imageUrl ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={imageUrl} alt="Preview" className="w-[500px] h-[200px] object-contain" />
                                    <button className="text-white ml-2"
                                        style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'transparent', border: 'none' }}
                                        onClick={() => {
                                            setImageUrl(null);
                                            setPostImage(null);
                                        }}>
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            style={{
                                                fontSize: '1.5em',
                                                borderRadius: '50%',
                                                padding: '0.2em',
                                                transition: 'background-color 0.3s ease',
                                                backgroundColor: 'transparent'
                                            }}
                                            onMouseOver={(e) => { e.target.style.backgroundColor = '#959697'; }}
                                            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}
                                        />

                                    </button>
                                </div>
                            ) : (
                                <p className='d-flex justify-center' style={{ color: '#959697' }}>No image selected</p>
                            )}
                        </Form.Group>


                        <div className="d-flex justify-end">
                            <Button variant="primary" type="submit" className="align-self-end">Post</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CreatePost;
