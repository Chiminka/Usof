import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, checkIsAuth } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

export const RegisterPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')

    const { status } = useSelector((state) => state.auth)
    const isAuth = useSelector(checkIsAuth)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (status) {
            toast(status)
            if(status === 'An Email sent to your account please verify')
                navigate('/')
        }
        if (isAuth) navigate('/register')
    }, [status, isAuth, navigate])

    const handleSubmit = () => {
        try {
            if (username !== '' && password !== '' && email !== '' && repeatPassword !== '') { 
                dispatch(registerUser({ username, password, email, repeatPassword }))
                setPassword('')
                setEmail('')
                setUsername('')
                setRepeatPassword('')
            } else {
                setPassword('')
                setEmail('')
                setUsername('')
                setRepeatPassword('')     
            }  
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className='w-1/4 h-60 mx-auto mt-40'
        >
            <h1 className='text-lg text-white text-center'>Registration</h1>
            <label className='text-xs text-gray-400'>
                *Username:
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Username'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-3 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>

            <label className='text-xs text-gray-400'>
                *Password:
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-3 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>

            <label className='text-xs text-gray-400'>
                *Repeat password:
                <input
                    type='password'
                    value = {repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    placeholder = "Password"
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-3 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>

            <label className='text-xs text-gray-400'>
                *Email:
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='michel@gmail.com'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-3 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>

            <div className='flex gap-8 justify-center mt-4'>
                <button
                    type='submit'
                    onClick={handleSubmit}
                    // to='/login'
                    className='flex justify-center items-center text-xs bg-gray-600 text-white rounded-sm py-2 px-4'
                >
                    Submit
                </button>
                <Link
                    to='/'
                    className='flex justify-center items-center text-xs text-white'
                >
                    Already have an account 
                </Link>
            </div>
        </form>
    )
}
