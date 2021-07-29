import axios from "axios";
import React, {useState} from "react";

const Register = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const updateFirstName = (e) => {
        setFirstName(e.target.value)
    }

    const updateLastName = (e) => {
        setLastName(e.target.value)
    }

    const updatePassword = (e) => {
        setPassword(e.target.value)
    }

    const updateEmail = (e) => {
        setEmail(e.target.value)
    }

    const submit = () => {
        axios.post('/auth/register', {firstName, lastName, password, email})
    }

	return (
		<div>
			<form className="w-full max-w-sm" onSubmit={submit}>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label
							className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
							for="inline-first-name"
						>
							First Name
						</label>
					</div>
					<div className="md:w-2/3">
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
							id="inline-first-name"
							type="text"
							placeholder="Jane"
                            value={firstName}
                            onChange={updateFirstName}
						></input>
					</div>
				</div>
                <div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label
							className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
							for="inline-last-name"
						>
							Last Name
						</label>
					</div>
					<div className="md:w-2/3">
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
							id="inline-last-name"
							type="text"
							placeholder="Doe"
                            value={lastName}
                            onChange={updateLastName}
						></input>
					</div>
				</div>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label
							className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
							for="inline-password"
						>
							Password
						</label>
					</div>
					<div className="md:w-2/3">
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
							id="inline-password"
							type="password"
							placeholder="******************"
                            value={password}
                            onChange={updatePassword}
						></input>
					</div>
				</div>
                <div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label
							className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
							for="inline-email"
						>
							Email
						</label>
					</div>
					<div className="md:w-2/3">
						<input
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
							id="inline-email"
							type="text"
							placeholder="mail@domain.com"
                            value={email}
                            onChange={updateEmail}
						></input>
					</div>
				</div>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3"></div>
					<label className="md:w-2/3 block text-gray-500 font-bold">
						<input
							className="mr-2 leading-tight"
							type="checkbox"
						></input>
						<span className="text-sm">Send me your newsletter!</span>
					</label>
				</div>
				<div className="md:flex md:items-center">
					<div className="md:w-1/3"></div>
					<div className="md:w-2/3">
						<button
							className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
							type="button"
                            onClick={submit}
						>
							Sign Up
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Register;
