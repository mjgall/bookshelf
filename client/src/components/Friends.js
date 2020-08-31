import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    CheckSquare,
    XSquare,
    PlusSquare,
    ChevronDownSquare,
} from '@styled-icons/boxicons-solid';
import {
    MailSend
} from '@styled-icons/boxicons-regular';
import Tip from '../common/Tip';


const Friends = (props) => {

    const [friends, setFriends] = useState([])
    const [friendMenuOpen, setFriendMenuOpen] = useState(false)
    const [values, setValues] = useState({ email: '', quantity: 0, unitCost: 0 })

    const handleValueChange = e => {
        const { name, value } = e.target
        setValues({ ...values, [name]: value })
    }

    const sendInvite = async (e) => {
        e.preventDefault()
        if (values.email) {
            const response = await axios.post('/api/friends', { userEmail: values.email })
            setValues({ ...values, email: '' })
            setFriendMenuOpen(!friendMenuOpen)
        } else {
            console.log('Please include an actaul email')
        }

    }

    useEffect(() => {
        const fetchFriends = async () => {
            const result = await axios.get(
                '/api/friends',
            );

            setFriends(result.data);
        };

        fetchFriends();
    }, [])

    return (
        <div className="md:w-full w-5/6 container">
            <div className='flex items-center w-full justify-between'>
                <div className='text-2xl font-bold'>Friends</div>
                {friendMenuOpen ? (

                    <ChevronDownSquare
                        onClick={() => setFriendMenuOpen(!friendMenuOpen)}
                        size='2em'
                        className='cursor-pointer text-green-400'>
                    </ChevronDownSquare>

                ) : (
                        <Tip renderChildren content='Add friend' placement='left'>
                            <PlusSquare
                                onClick={() => setFriendMenuOpen(!friendMenuOpen)}
                                size='2em'
                                className='cursor-pointer text-green-400'>
                            </PlusSquare>
                        </Tip>)}

            </div>
            {friendMenuOpen ? (<form onSubmit={sendInvite} className='w-full'>
                <div className='flex items-center border-b border-b-1 border-blue-500 '>
                    <input
                        name="email"
                        className='appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 pr-2 leading-tight focus:outline-none'
                        type='text'
                        placeholder='Email'
                        value={values.email}
                        onChange={handleValueChange}
                        aria-label='Friend email'></input>
                    <Tip renderChildren content='Send invite' placement="left">
                        <MailSend
                            onClick={sendInvite}
                            size='2em'
                            className='cursor-pointer text-green-400'>
                        </MailSend>
                    </Tip>

                </div>
            </form>) : null}
            <div>{friends.map((friend, index) => {

                return (
                    <div key={index} className="flex items-center my-2">
                        <img
                            alt={friend.full}
                            src={friend.picture}
                            class='rounded-full h-12 w-12 mr-4'></img>
                        <div>{friend.full}</div>
                    </div>
                )

            })}</div>
        </div>
    )
}

export default Friends