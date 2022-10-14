import Post from '../models/Post.js'

export async function filterByCategory (category) {
     // interface by category
     return (await Post.find({status: 'active', categories: category}))
}

export async function filterByDate (date, Posts) {
    // interface by date
    return (await Posts.find({status: 'active', createdAt: date}))
}

export async function filterByStatus (status, Posts) {
     // interface by status
     return (await Posts.find({status: status}))
}