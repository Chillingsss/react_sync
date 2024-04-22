import React, { useEffect, useState } from 'react'
import { Container, Card, Image, Row } from 'react-bootstrap';
import { faComment, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUser, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';


library.add(faHome, faUser, faBell, faSignOutAlt);

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


            <Card className="text-white mb-3" style={{ backgroundColor: "#242526", borderRadius: "30px" }}>
                <Card.Body>
                    <p style={{ fontSize: "20px" }}>{item.firstname}</p>
                    <h3 className='text-center'>{item.caption}</h3>
                    <Image src={"http://localhost/sync/uploads/" + item.filename} className="w-full" />
                    <br></br>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
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
                            style={{ width: '30px', height: '30px', marginLeft: '30px' }}
                        />
                    </div>
                </Card.Body>
            </Card>


        </>
    )
}

export default UserPost
