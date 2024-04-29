import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigateTo = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            const url = localStorage.getItem("url") + "user.php";
            const jsonData = {
                loginUsername: username,
                loginPassword: password
            }
            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "loginUser");

            const res = await axios.post(url, formData);
            console.log("Res ni login", res.data.data)
            if (res.data.status === 1) {
                const { id, firstname, middlename, lastname, email, cpnumber, prof_pic } = res.data.data[0];

                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('id', id);
                sessionStorage.setItem('id', id);
                localStorage.setItem('Firstname', firstname);
                localStorage.setItem('Middlename', middlename);
                localStorage.setItem('Lastname', lastname);
                localStorage.setItem('Email', email);
                localStorage.setItem('Cpnumber', cpnumber);
                localStorage.setItem('Username', username);
                localStorage.setItem('ProfilePic', prof_pic);

                navigateTo("/dashboard");
                toast.success("Login Successful");
            } else {
                toast.error("Invalid Credential");
            }
        } catch (error) {
            console.log("error ni login", error);
            toast.error("Something went wrong");
        }
    }


    return (
        <>

            <div className='flex flex-col justify-center items-center h-screen'>
                <div className='flex justify-center items-center mb-1'>
                    <h1 className='text-3xl text-white'>Login</h1>
                </div>

                <div className="w-full max-w-xs">
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-2" onSubmit={handleLogin}>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************" />

                        </div>

                        <div className="flex items-center justify-center">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                Login
                            </button>
                        </div>

                        <div className="flex items-center justify-center mt-2">
                            <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                                Forgot Password?
                            </a>
                        </div>



                    </form>

                    <form className="bg-white shadow-md rounded px-3 pt-6 pb-2 mb-1 mt-1">
                        <div className="flex items-center justify-center ">
                            <p className='text-black'>Don't have an account? </p><span className='ms-2'><p className='cursor-pointer text-sm text-blue-600 hover:text-blue-800' onClick={() => navigateTo('/register')}>Register</p></span>

                        </div>

                    </form>

                    <p className="text-center text-gray-500 text-xs">
                        &copy;2020 Acme Corp. All rights reserved.
                    </p>

                </div >


            </div >

        </>
    )
}

export default Login
