import React from 'react'
import { AiFillLike } from 'react-icons/ai'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'
import { Grid } from '@mui/material';


export const UserItem = ({ user, idx }) => {

    if (!user) {
        return (
            <div className='text-xl text-center text-white py-10'>
                Loading...
            </div>
        )
    }

    return (
        <Grid key={idx}  item sx={{height: 100, width: 180,}}>
             <Link to={`/users/${user._id}`}>
            <div className='flex flex-col basis-1/4 flex-grow mt-10'>
                 <div className='flex flex-col basis-1/4 flex-grow'>
                        <div
                            className={
                                user?.avatar
                                    ? 'flex rounded-sm h-20 w-20'
                                    : 'flex rounded-sm h-20 w-20'
                            }
                        >
                            {user?.avatar ? (
                                <img
                                    src={`http://localhost:3002/${user.avatar}`}
                                    alt='img'
                                    className='object-cover w-full'
                                />
                            ) : (
                                <img
                                    src={`data:image/jpeg;base64,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`}
                                    alt='img'
                                    className='object-cover w-full'
                                />
                            )}
                        </div>
                    </div>
                <div className='flex justify-between items-center pt-2 text-sm text-white opacity-19'>
                    <div className='text-xs text-white opacity-50'>
                        {user.username}
                    </div>
                    <div className='text-xs text-white opacity-50'>
                        <Moment date={user.createdAt} format='D MMM YYYY' />
                    </div>
                </div>
                <div>
                    <p className='text-white opacity-60 text-xs pt-2 line-clamp-4'>
                        {user.full_name}
                    </p>
                    <p className='text-white opacity-60 text-xs line-clamp-4'>
                        {user.role}
                    </p>
                </div>
                <div className='flex gap-3 items-center mt-2'>
                    <button className='flex items-center justify-center gap-2 text-xs text-white opacity-50'>
                        <AiFillLike />{' '}
                        <span>{user.rating || 0} </span>
                    </button>
                </div>
                <div className='text-xs text-white opacity-50'>
                </div>
            </div>
        </Link>                 

        </Grid>
    )
}
