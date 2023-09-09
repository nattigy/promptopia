'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { useRouter } from 'next/navigation'
import Profile from '@components/Profile'

function MyProfile() {
  const { data: session } = useSession()
  const router = useRouter()

  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`)
      const data = await response.json()

      setPosts(data)
    }

    if (session?.user.id)
      fetchPosts()
        .then(r => {
        })
  }, [])

  const handleEdit = async (post) => {
    router.push(`/update-prompt?id=${post._id}`)
  }

  const handleDelete = async (post) => {
    const hasConfirmed = confirm('Are you sure you want to delete this prompt?')

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: 'DELETE',
        })

        const filteredPosts = posts.filter((p) => post._id !== p._id)

        setPosts(filteredPosts)
      } catch (e) {
        console.log(e)
      }
    }
  }

  return (
    <Profile
      name='My'
      desc='Welcome to your personilized profile page'
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default MyProfile