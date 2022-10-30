import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkIsAuth, logout } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

export const Navbar = () => {
    const isAuth = useSelector(checkIsAuth)
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const activeStyles = {
        color: 'white',
    }

    const logoutHandler = () => {
        dispatch(logout())
        window.localStorage.removeItem('token')
        toast('You signed out')
    }

    return (
        <div className='flex py-10 justify-between items-center '>
            <span className='flex justify-center items-center w-50 h-15 bg-gray-600 text-xs text-white px-4 py-4 ml-20  rounded-full'>
                USOF-FULLSTACK 🌑
            </span>

            {isAuth && (
                <div className='inline-flex items-baseline'>
                    <ul className='flex gap-8'>
                    <li>
                        <NavLink
                            to={'/'}
                            href='/'
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) =>
                                isActive ? activeStyles : undefined
                            }
                        >
                            Main
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'/users/posts'}
                            href='/'
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) =>
                                isActive ? activeStyles : undefined
                            }
                        >
                            My posts
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={'/new'}
                            href='/'
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) =>
                                isActive ? activeStyles : undefined
                            }
                        >
                            Add post
                        </NavLink>
                    </li>
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
                     <li>
                        <NavLink
                            to={'/users_all'}
                            href='/'
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) =>
                                isActive ? activeStyles : undefined
                            }
                        >
                            Users
                        </NavLink>
                    </li>
                </ul>
                    <div className='ml-12'>
                     <NavLink
                            to={`/users/${user._id}`}
                            href='/'
                            className='underline text-sm text-gray-300  hover:text-white rounded-sm'
                            style={({ isActive }) =>
                                isActive ? activeStyles : undefined
                            }
                        >
                            My account 
                        </NavLink>
                    </div>
                </div>
            )}

            <div className='rounded-full flex justify-center items-center bg-gray-600 text-xs text-white px-4 py-2  mr-20'>
                {isAuth ? (
                    <Link to={'/'} onClick={logoutHandler}>Sign out</Link>
                ) : (
                    <Link to={'/'}> Sign in </Link>
                )}
            </div>
        </div>
    )
}
