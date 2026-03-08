import { useState, useEffect } from 'react'
import { collection, query, getDocs, orderBy, addDoc, serverTimestamp, getDoc, updateDoc, doc, increment, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'

export function useCommunity() {
    const [posts, setPosts] = useState([])
    const [trendingTopics, setTrendingTopics] = useState([])
    const [stats, setStats] = useState({ totalPosts: 0, activeUsers: 0, todaysPosts: 0 })
    const [isLoading, setIsLoading] = useState(true)

    const fetchPosts = async () => {
        try {
            setIsLoading(true)
            const q = query(collection(db, 'communityPosts'), orderBy('createdAt', 'desc'))
            const snapshot = await getDocs(q)

            const fetchedPosts = []
            const tagsMap = {}
            const uniqueAuthors = new Set()

            let todaysPostsCount = 0
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            snapshot.forEach(document => {
                const data = document.data()
                const createdAt = data.createdAt?.toDate()

                let timeAgo = 'Just now'
                if (createdAt) {
                    if (createdAt >= today) todaysPostsCount++

                    const seconds = Math.floor((new Date() - createdAt) / 1000)
                    let interval = seconds / 31536000
                    if (interval > 1) { timeAgo = Math.floor(interval) + 'yr ago'; }
                    else {
                        interval = seconds / 2592000
                        if (interval > 1) { timeAgo = Math.floor(interval) + 'mo ago'; }
                        else {
                            interval = seconds / 86400
                            if (interval > 1) { timeAgo = Math.floor(interval) + 'd ago'; }
                            else {
                                interval = seconds / 3600
                                if (interval > 1) { timeAgo = Math.floor(interval) + 'h ago'; }
                                else {
                                    interval = seconds / 60
                                    if (interval > 1) { timeAgo = Math.floor(interval) + 'm ago'; }
                                    else { timeAgo = Math.floor(seconds) + 's ago'; }
                                }
                            }
                        }
                    }
                }

                uniqueAuthors.add(data.author)

                // Count tags for trending
                if (Array.isArray(data.tags)) {
                    data.tags.forEach(tag => {
                        tagsMap[tag] = (tagsMap[tag] || 0) + 1
                    })
                }

                fetchedPosts.push({
                    id: document.id,
                    title: data.title || 'Untitled',
                    content: data.content || '',
                    author: data.author || 'Anonymous',
                    avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.author || 'anon'}`,
                    category: data.category || 'discussion',
                    replies: data.replies || 0,
                    views: data.views || 0,
                    likes: data.likes || 0,
                    likedBy: data.likedBy || [],
                    timeAgo: timeAgo,
                    tags: data.tags || [],
                    hasAnswer: data.hasAnswer || false,
                    flagged: data.flagged || false,
                    authorUid: data.authorUid || null,
                    acceptedReplyId: data.acceptedReplyId || null,
                    createdAt: createdAt
                })
            })

            // Sort map to array
            const trending = Object.entries(tagsMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([tag, count]) => ({ tag, count }))

            setPosts(fetchedPosts)
            setTrendingTopics(trending)
            setStats({
                totalPosts: fetchedPosts.length,
                activeUsers: uniqueAuthors.size,
                todaysPosts: todaysPostsCount
            })
            setIsLoading(false)
        } catch (error) {
            console.error("Error fetching community posts:", error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const createPost = async (postData) => {
        try {
            const docRef = await addDoc(collection(db, 'communityPosts'), {
                ...postData,
                authorUid: postData.authorUid || null,
                replies: 0,
                views: 0,
                likes: 0,
                likedBy: [],
                hasAnswer: false,
                createdAt: serverTimestamp()
            })
            await fetchPosts() // Refresh the list
            return docRef.id
        } catch (error) {
            console.error("Error creating post:", error)
            throw error
        }
    }

    const fetchPost = async (postId) => {
        try {
            const docRef = doc(db, 'communityPosts', postId)
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) return null

            const data = docSnap.data()
            const createdAt = data.createdAt?.toDate()

            // Fetch relations
            let timeAgo = 'Just now'
            if (createdAt) {
                const seconds = Math.floor((new Date() - createdAt) / 1000)
                let interval = seconds / 31536000
                if (interval > 1) { timeAgo = Math.floor(interval) + 'yr ago'; }
                else {
                    interval = seconds / 2592000
                    if (interval > 1) { timeAgo = Math.floor(interval) + 'mo ago'; }
                    else {
                        interval = seconds / 86400
                        if (interval > 1) { timeAgo = Math.floor(interval) + 'd ago'; }
                        else {
                            interval = seconds / 3600
                            if (interval > 1) { timeAgo = Math.floor(interval) + 'h ago'; }
                            else {
                                interval = seconds / 60
                                if (interval > 1) { timeAgo = Math.floor(interval) + 'm ago'; }
                                else { timeAgo = Math.floor(seconds) + 's ago'; }
                            }
                        }
                    }
                }
            }

            // Fetch Replies
            const rQ = query(collection(db, 'communityReplies'), orderBy('createdAt', 'asc'))
            const rSnap = await getDocs(rQ)
            const filteredReplies = rSnap.docs
                .filter(d => d.data().postId === postId)
                .map(d => {
                    const rData = d.data()
                    const rDate = rData.createdAt?.toDate()

                    let rt = 'Just now'
                    if (rDate) {
                        const s = Math.floor((new Date() - rDate) / 1000)
                        let i = s / 86400; if (i > 1) { rt = Math.floor(i) + 'd ago' }
                        else {
                            i = s / 3600; if (i > 1) { rt = Math.floor(i) + 'h ago' }
                            else { i = s / 60; if (i > 1) { rt = Math.floor(i) + 'm ago' } else { rt = Math.floor(s) + 's ago' } }
                        }
                    }

                    return {
                        id: d.id,
                        author: rData.author || 'Anonymous',
                        avatar: rData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rData.author}`,
                        content: rData.content || '',
                        authorUid: rData.authorUid || null,
                        timeAgo: rt,
                        likes: rData.likes || 0,
                    }
                })

            return {
                id: docSnap.id,
                title: data.title || 'Untitled',
                content: data.content || '',
                author: data.author || 'Anonymous',
                avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.author || 'anon'}`,
                category: data.category || 'discussion',
                repliesCount: data.replies || 0,
                views: data.views || 0,
                likes: data.likes || 0,
                likedBy: data.likedBy || [],
                timeAgo: timeAgo,
                tags: data.tags || [],
                hasAnswer: data.hasAnswer || false,
                flagged: data.flagged || false,
                authorUid: data.authorUid || null,
                acceptedReplyId: data.acceptedReplyId || null,
                replyList: filteredReplies
            }
        } catch (error) {
            console.error("Error fetching single post:", error)
            return null
        }
    }

    const incrementView = async (postId) => {
        try {
            await updateDoc(doc(db, 'communityPosts', postId), {
                views: increment(1)
            })
        } catch (error) {
            console.error("Error incrementing view:", error)
        }
    }

    const toggleLike = async (postId, userId, isLiking) => {
        try {
            const postRef = doc(db, 'communityPosts', postId)
            if (isLiking) {
                await updateDoc(postRef, {
                    likes: increment(1),
                    likedBy: arrayUnion(userId)
                })
            } else {
                await updateDoc(postRef, {
                    likes: increment(-1),
                    likedBy: arrayRemove(userId)
                })
            }
        } catch (error) {
            console.error("Error toggling like:", error)
        }
    }

    const addReply = async (postId, replyData) => {
        try {
            // 1. Create the reply
            const replyRef = await addDoc(collection(db, 'communityReplies'), {
                postId,
                ...replyData,
                authorUid: replyData.authorUid || null,
                likes: 0,
                createdAt: serverTimestamp()
            })
            // 2. Increment the parent counter
            const postRef = doc(db, 'communityPosts', postId)
            await updateDoc(postRef, {
                replies: increment(1)
            })
            return replyRef.id
        } catch (error) {
            console.error("Error adding reply:", error)
            throw error
        }
    }
    const deletePost = async (postId) => {
        try {
            await deleteDoc(doc(db, 'communityPosts', postId))
            await fetchPosts() // Refresh the list
        } catch (error) {
            console.error("Error deleting post:", error)
            throw error
        }
    }

    const markAsResolved = async (postId, replyId, replierUid) => {
        try {
            const postRef = doc(db, 'communityPosts', postId)
            await updateDoc(postRef, {
                hasAnswer: true,
                acceptedReplyId: replyId
            })

            // Award XP to replier
            if (replierUid) {
                const userRef = doc(db, 'users', replierUid)
                await updateDoc(userRef, {
                    totalXP: increment(50),
                })
            }

            await fetchPosts() // Refresh state
        } catch (error) {
            console.error("Error marking post as resolved:", error)
            throw error
        }
    }

    const flagPost = async (postId) => {
        try {
            await updateDoc(doc(db, 'communityPosts', postId), {
                flagged: true,
                flaggedAt: serverTimestamp()
            })
            await fetchPosts() // Refresh the list
        } catch (error) {
            console.error("Error flagging post:", error)
            throw error
        }
    }

    return {
        posts, trendingTopics, stats, isLoading, refetch: fetchPosts,
        createPost, fetchPost, incrementView, toggleLike, addReply, deletePost, flagPost, markAsResolved
    }
}
