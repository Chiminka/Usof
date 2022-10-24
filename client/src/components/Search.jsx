import React from 'react'
import { useSelector } from 'react-redux'
import { checkIsAuth } from '../redux/features/auth/authSlice'

export const Search = (searching) => {
    const isAuth = useSelector(checkIsAuth)

    return (
        <div className='flex py-10 justify-between items-center'>
            {isAuth && (
                <div>
                    <input  className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                    onChange={(e)=>searching(e.target.value)} placeholder='Search...'></input>
                </div>
            )}
        </div>
    )
}
