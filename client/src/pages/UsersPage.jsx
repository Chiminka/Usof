import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { UserItem} from '../components/UserItem'
import axios from '../utils/axios'
import {Pagination} from '../components/Pagination'
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux'
import {useNavigate } from 'react-router-dom'

export const UsersPage = () => {
    const [users, setUsers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [usersPerPage] = useState(5)
    const [search, setSearch] = useState([])
    const { user } = useSelector((state) => state.auth)
    
    const navigate = useNavigate()

    const submitHandler = () => {
        try {
            navigate('/create_users')
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/users')
            setUsers(data.users)
 
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

 
    const filteredUsers =  users.filter(user =>{
        if (user.full_name !== '') {
             if (user.username.toLowerCase().includes(search.toString().toLowerCase()) 
            || user.role.toLowerCase().includes(search.toString().toLowerCase())
            || user.full_name.toLowerCase().includes(search.toString().toLowerCase()))
                return user
        } else {
            if (user.username.toLowerCase().includes(search.toString().toLowerCase()) 
            || user.role.toLowerCase().includes(search.toString().toLowerCase()))
                return user
        }
    })

    const numDescending = [...filteredUsers].sort((a, b) => b.rating - a.rating)
    const new_filted_users = numDescending
    
    // Get current posts
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = new_filted_users.slice(indexOfFirstUser, indexOfLastUser)

    const admin = () => {
        if(!user) 
            <div>Loading...</div>
        else if (user.role === 'admin') {
             return(
                <div className='flex gap-3 mt-4'>
                    <div className='flex items-center justify-center gap-2 text-white opacity-50'>
                        <button className='underline' onClick={submitHandler}>
                            Create new user
                        </button>
                    </div> 
                </div>
            )
        }
    }

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    
    return (
        <div className='w-1/2 mx-auto py-10 flex flex-col gap-10'>
            {admin()}
            <div>
                <input  className='mb-5 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                    onChange={(e)=>setSearch(e.target.value)} placeholder='Search...'/>
            </div>
             <Grid className='grid' item xs={12}>
                <Grid container justifyContent="center" spacing={5}>
                    {currentUsers?.map((user, idx) => (
                        <UserItem user={user} key={idx} />
                    ))}
                </Grid>
            </Grid>
            <div className='max-w-[900px] mx-auto py-10'>
                <Pagination usersPerPage={usersPerPage} totalUsers={users.length} paginate={paginate}/>
            </div>
        </div>
    )
}