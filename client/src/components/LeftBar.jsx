import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkIsAuth, logout } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

export const LeftBar = () => {
    const isAuth = useSelector(checkIsAuth)
    // const dispatch = useDispatch()

    const activeStyles = {
        color: 'white',
    }

    // const logoutHandler = () => {
    //     dispatch(logout())
    //     window.localStorage.removeItem('token')
    //     toast('You signed out')
    // }

    return (
        <div className='flex py-10 justify-between items-center'>
            {isAuth && (
                <ul className='flex gap-8'>
                     <li>
                        <NavLink
                            to={'/categories'}
                            href='/'
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) =>
                                isActive ? activeStyles : undefined
                            }
                        >
                            Categories
                        </NavLink>
                    </li>
                </ul>
            )}
        </div>
    )
}
