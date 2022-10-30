import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../redux/features/user/userSlice'
import '../../src/add_post.css';
import { toast } from 'react-toastify';

export const CreateUserPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [role, setRole] = useState('')
    const [full_name, setFull_name] = useState('')
    const [image, setImage] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const submitHandler = () => {
        try {
            if (username !== '' && password !== '' && email !== '' && repeatPassword !== '') {
                let formData = new FormData()
                formData.append('username', username)
                formData.append('password', password)
                formData.append('email', email)
                formData.append('repeatPassword', repeatPassword)
                if (role != '')
                    formData.append('role', role)
                formData.append('full_name', full_name)
                formData.append('image', image)
                dispatch(createUser(formData))
                navigate('/users_all')
            } else {
                setPassword('')
                setEmail('')
                setUsername('')
                setRepeatPassword('')
                toast('Fill all of important blanks')
            }  
        } catch (error) {
            console.log(error)
        }
    }
    const clearFormHandler = () => {
        setPassword('')
        setEmail('')
        setUsername('')
        setRepeatPassword('')     
        setRole('')
        setFull_name('')
        setImage('')
        navigate('/users_all')
    }

    return (
        <form className='w-1/3 mx-auto py-10'>
            <label className='text-gray-300 py-2 bg-gray-600 text-xs mt-2 flex items-center justify-center border-2 border-dotted cursor-pointer'>
                Attach picture:
                <input
                    type='file'
                    className='hidden'
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </label>
            <div className='flex object-cover py-2'>
                {image && (
                    <img src={URL.createObjectURL(image)} alt={image.name} />
                )}
            </div>

            <label className='text-xs text-white opacity-70'>
                *Username:
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Username'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            <label className='text-xs text-white opacity-70'>
                *Email:
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='michel@gmail.com'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            <label className='text-xs text-white opacity-70'>
                *Password:
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            <label className='text-xs text-white opacity-70'>
                *Repeat password:
                <input
                    type='password'
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    placeholder='Password'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            <label className='text-xs text-white opacity-70'>
                Full name:
                <input
                    type='text'
                    value={full_name}
                    onChange={(e) => setFull_name(e.target.value)}
                    placeholder='Michel Jobs'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            <label className='text-xs text-white opacity-70'>
                Role:
                <input
                    type='text'
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder='admin / user (default)'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            <div className='flex gap-8 items-center justify-center mt-4'>
                <button
                    onClick={submitHandler}
                    className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4'
                >
                    Add
                </button>

                <button
                    onClick={clearFormHandler}
                    className='flex justify-center items-center bg-red-500 text-xs text-white rounded-sm py-2 px-4'
                >
                    Cancel
                </button>
            </div>
        </form>
    )
}
