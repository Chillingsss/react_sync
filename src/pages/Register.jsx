import axios from 'axios';
import React, { useState } from 'react'
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner';


function Register() {
    const [firstname, setFirstname] = useState("");
    const [middlename, setMiddlename] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [cpnumber, setCpnumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigateTo = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        e.stopPropagation();

        try {
            const url = localStorage.getItem("url") + "/user.php";
            const jsonData = {
                firstname: firstname,
                middlename: middlename,
                lastname: lastname,
                email: email,
                cpnumber: cpnumber,
                username: username,
                password: password
            }

            console.log("jsondata: ", JSON.stringify(jsonData));
            const formData = new FormData();
            formData.append("json", JSON.stringify(jsonData));
            formData.append("operation", "signup");

            const res = await axios.post(url, formData);
            console.log("Res ni Signup", res.data);

            if (res.data === 1) {
                toast.success("Signup Successful");
                navigateTo("/");
            }
            else {
                toast.error("Invalid Credential");
            }

        } catch (error) {

            toast.error("Invalid Credential");
        }
    }

    return (
        <>

            <Container>
                <div className='flex flex-col justify-center items-center min-h-screen'>
                    <div className="flex justify-center items-center">
                        <div className="w-full max-w-md">
                            <form className="bg-white shadow-md rounded px-6 pt-2 pb-2 mb-1">
                                <h1 className='text-3xl text-black text-center'>Register</h1>
                            </form>
                            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-2" onSubmit={handleRegister}>
                                <div className="mb-4 md:flex md:justify-between">
                                    <div className="mb-4 md:mr-2 md:mb-0 md:w-1/3">
                                        <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-first-name">
                                            First Name
                                        </label>
                                        <input value={firstname} onChange={e => setFirstname(e.target.value)} className="appearance-none block w-full bg-gray-200 text-black border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Firstname" />
                                    </div>
                                    <div className="mb-4 md:mr-2 md:mb-0 md:w-1/3">
                                        <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-first-name">
                                            Middle Name
                                        </label>
                                        <input value={middlename} onChange={e => setMiddlename(e.target.value)} className="appearance-none block w-full bg-gray-200 text-black border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Middlename" />
                                    </div>
                                    <div className="md:w-1/3">
                                        <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-last-name">
                                            Last Name
                                        </label>
                                        <input value={lastname} onChange={e => setLastname(e.target.value)} className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Lastname" />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-email">
                                        Email Address
                                    </label>
                                    <input value={email} onChange={e => setEmail(e.target.value)} className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-email" type="email" placeholder="Email Address" />
                                </div>
                                <div className="mb-4">
                                    <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-cpnumber">
                                        Contact Number
                                    </label>
                                    <input value={cpnumber} onChange={e => setCpnumber(e.target.value)} className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-cpnumber" type="tel" placeholder="Contact Number" />
                                </div>
                                <div className="mb-4">
                                    <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-username">
                                        Username
                                    </label>
                                    <input value={username} onChange={e => setUsername(e.target.value)} className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-username" type="text" placeholder="Username" />
                                </div>
                                <div className="mb-6">
                                    <label className="block uppercase tracking-wide text-black text-xs font-bold mb-2" htmlFor="grid-password">
                                        Password
                                    </label>
                                    <input value={password} onChange={e => setPassword(e.target.value)} className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************" />
                                    <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                                </div>
                                <button className="bg-cyan-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Register</button>
                            </form>
                            <form className="bg-white shadow-md rounded px-3 pt-6 pb-2 mt-1">
                                <div class="flex items-center justify-center ">
                                    <p className='text-black'>have an account? </p><span className='ms-2'><p className='cursor-pointer text-sm text-blue-600 hover:text-blue-800' onClick={() => navigateTo('/')}>Login</p></span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Container>


        </>



    )
}

export default Register
