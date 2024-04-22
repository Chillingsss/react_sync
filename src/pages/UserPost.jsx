import React, { useEffect, useState } from 'react'
import { Container, Card, Image, Row } from 'react-bootstrap';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

const UserPost = ({ item }) => {

    let [likes, setLikes] = useState(0);


    const [isUserLiked, setIsUserLiked] = useState(false);

    const isUserLike = async () => {
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

    }

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
                setLikes(likes -= 1);
            } else if (res.data === 1) {
                setLikes(likes += 1);
            } else {
                alert("there was something wrong");
                console.log(res.data);
            }

            setIsUserLiked(!isUserLiked)

        } catch (error) {
            alert(error);
        }
    }



    useEffect(() => {
        setLikes(item.likes);
        isUserLike();
    }, [])

    return (
        <>
            <Card className="mb-3">
                <Card.Body>
                    {item.firstname}
                    <h3 className='text-center'>{item.caption}</h3>
                    <Image src={"http://localhost/sync/uploads/" + item.filename} className="w-full" />
                    <Row>
                        {likes}
                        <FontAwesomeIcon className={isUserLiked ? 'text-blue-500' : ''}
                            icon={faThumbsUp}
                            style={{ width: '30px', height: '30px' }}
                            onClick={() => handleLikePost()}
                        />
                    </Row>

                </Card.Body>
            </Card>
        </>
    )
}

export default UserPost
