import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkIsAuth, verifyPassword } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

export const VerificationPage = () => {
    const [confirm_password, setRepeatPassword] = useState('')
    const [new_password, setPassword] = useState('')

    const dispatch = useDispatch()
    const { status } = useSelector((state) => state.auth)
    const isAuth = useSelector(checkIsAuth)
    const params = useParams()
    const navigate = useNavigate()
    const token = params.token

    useEffect(() => {
        if (status) {
            toast(status)
            if (status === "Your password was changed") navigate('/')
        }
        if (isAuth) navigate(`/recover/:token`)
    }, [status, isAuth, navigate])

    const handleSubmit = () => {
        try {
            if (new_password && confirm_password) {
                dispatch(verifyPassword({ new_password, confirm_password, token }))
                setPassword('')
                setRepeatPassword('')
            } else {
                setPassword('')
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
            <h1 className='text-lg text-white text-center'>Password change</h1>
            <label className='text-xs text-gray-400'>
                Password:
                <input
                    type='password'
                    value={new_password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-3 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>

            <label className='text-xs text-gray-400'>
                Repeat Password:
                <input
                    type='password'
                    value={confirm_password}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    placeholder='Password'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-3 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>

            <div className='flex gap-8 justify-center mt-4'>
                <button
                    type='submit'
                    onClick={handleSubmit}
                    className='flex justify-center items-center text-xs bg-gray-600 text-white rounded-sm py-2 px-4'
                >
                    Confirm
                </button>
                <Link
                    to='/login'
                    className='flex justify-center items-center text-xs text-white'
                >
                    I remember my password
                </Link>
            </div>
        </form>
    )
}
