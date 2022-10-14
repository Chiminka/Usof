import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkIsAuth, EmailUser } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

export const VerifiedEmail = () => {

    const dispatch = useDispatch()
    const { status } = useSelector((state) => state.auth)
    const isAuth = useSelector(checkIsAuth)
    const params = useParams()
    const navigate = useNavigate()
    const token = params.token

    useEffect(() => {
        if (status) {
            toast(status)
            if (status === "Your email is verified") navigate('/')
        }
        if (isAuth) navigate(`/verify/:token`)
    }, [status, isAuth, navigate])

    const handleSubmit = () => {
        try {
            dispatch(EmailUser({ token }))
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className='w-1/4 h-60 mx-auto mt-40'
        >
            <h1 onClick={handleSubmit} className='text-lg text-white text-center'><b><u>Click here to verified!</u></b></h1>
            
        </form>
    )
}
