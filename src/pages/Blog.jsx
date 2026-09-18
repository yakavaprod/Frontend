import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaArrowRight, FaBookOpen, FaCalendarAlt, FaCheck, FaComment, FaCompactDisc, FaEye, FaHeart, FaPlay, FaRegBookmark, FaRegHeart, FaShare, FaTimes, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import SimpleHeader from '../components/SimpleHeader.jsx'
import api from '../api.js'
import './Blog.css'

const formatDate = (date) => date ? new Date(date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'Today'
const formatCount = (count = 0) => count > 999 ? `${(count / 1000).toFixed(1)}K` : count

function Story({ story }) {
  return <button className="story" type="button" onClick={() => story.onOpen(story)} aria-label={`View story from ${story.author}`}>
    <span className="story-ring"><span className="story-avatar">{story.authorAvatarUrl ? <img src={story.authorAvatarUrl} alt="" /> : story.postType === 'image' ? <img src={story.videoUrl} alt="" /> : <FaCompactDisc />}</span></span>
    <span className="story-name">{story.author}{story.authorVerified && <span className="blog-verified" title="Verified YA KAVA account" aria-label="Verified account"><FaCheck /></span>}</span>
  </button>
}

function StoryViewer({ story, onClose }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(Boolean(story.isLiked))
  const [likes, setLikes] = useState(story.likesCount || 0)
  const [muted, setMuted] = useState(true)
  const isImage = story.postType === 'image'
  const isText = story.postType === 'text'

  const handleLike = async () => {
    try {
      const { data } = await api.post(`/posts/${story.id}/like`)
      setLiked(data.isLiked)
      setLikes(data.likesCount)
    } catch (error) {
      if (error.response?.status === 401) navigate('/login')
    }
  }

  const handleReshare = async () => {
    try {
      await navigator.clipboard?.writeText(`${window.location.origin}/blog#post-${story.id}`)
      await api.post(`/posts/${story.id}/share`)
    } catch { /* sharing is best effort */ }
  }

  return <div className="story-viewer" role="dialog" aria-modal="true" aria-label={`Story from ${story.author}`}>
    <button type="button" className="story-viewer-close" onClick={onClose} aria-label="Close story"><FaTimes /></button>
    <div className="story-viewer-card">
      <div className="story-progress"><span /></div>
      <header className="story-viewer-header"><span className="feed-avatar">{story.authorAvatarUrl ? <img src={story.authorAvatarUrl} alt="" /> : <FaCompactDisc />}</span><strong>{story.author}{story.authorVerified && <span className="blog-verified" title="Verified account" aria-label="Verified account"><FaCheck /></span>}</strong><span>{formatDate(story.createdAt)}</span></header>
      <div className={`story-viewer-media ${isText ? 'feed-text' : ''}`}>
        {isText ? <p>{story.caption || 'YA KAVA update'}</p> : isImage ? <img src={story.videoUrl} alt={story.caption || 'YA KAVA story'} /> : <video src={story.videoUrl} autoPlay muted={muted} playsInline loop controls />}
        {!isText && !isImage && <button type="button" className="story-viewer-mute" onClick={() => setMuted((current) => !current)} aria-label={muted ? 'Unmute story' : 'Mute story'}>{muted ? <FaVolumeMute /> : <FaVolumeUp />}</button>}
      </div>
      <div className="story-viewer-footer"><p>{story.caption}</p><div><button type="button" className={liked ? 'is-liked' : ''} onClick={handleLike} aria-label={liked ? 'Unlike story' : 'Like story'}>{liked ? <FaHeart /> : <FaRegHeart />} <span>{likes}</span></button><button type="button" onClick={handleReshare} aria-label="Repost story"><FaShare /><span>Repost</span></button></div></div>
    </div>
  </div>
}

function FeedPost({ post, onFocus, onBlur }) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
    const [liked, setLiked] = useState(Boolean(post.isLiked))
    const [likesCount, setLikesCount] = useState(post.likesCount || 0)
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState('')
    const [commentsLoading, setCommentsLoading] = useState(false)
  const isImage = post.postType === 'image'
  const isText = post.postType === 'text'
    const navigate = useNavigate()
    const toggleLike = async () => {
      try {
        const { data } = await api.post(`/posts/${post.id}/like`)
        setLiked(data.isLiked)
        setLikesCount(data.likesCount)
      } catch (error) {
        if (error.response?.status === 401) navigate('/login')
      }
    }
    const toggleComments = async () => {
      const nextOpen = !commentsOpen
      setCommentsOpen(nextOpen)
      if (nextOpen) onFocus?.(post.id)
      else onBlur?.()
      if (comments.length || commentsOpen) return
      setCommentsLoading(true)
      try {
        const { data } = await api.get(`/posts/${post.id}/comments`)
        setComments(data)
      } finally { setCommentsLoading(false) }
    }
    const submitComment = async (event) => {
      event.preventDefault()
      if (!commentText.trim()) return
      try {
        const { data } = await api.post(`/posts/${post.id}/comments`, { text: commentText.trim() })
        setComments((current) => [data, ...current])
        setCommentText('')
        setCommentsOpen(false)
        onBlur?.()
      } catch (error) {
        if (error.response?.status === 401) navigate('/login')
      }
    }
    const reshare = async () => {
      try {
        await navigator.clipboard?.writeText(`${window.location.origin}/blog#post-${post.id}`)
        await api.post(`/posts/${post.id}/share`)
      } catch { /* sharing is best effort */ }
    }
    useEffect(() => {
      if (!commentsOpen) onBlur?.()
    }, [commentsOpen, onBlur])
  return <article className="feed-post">
    <header className="feed-post-header"><span className="feed-avatar">{post.authorAvatarUrl ? <img src={post.authorAvatarUrl} alt="" /> : <FaCompactDisc />}</span><div><strong>{post.author}{post.authorVerified && <span className="blog-verified" title="Verified YA KAVA account" aria-label="Verified account"><FaCheck /></span>}</strong><span>{formatDate(post.createdAt)}</span></div><button type="button" className="post-more" aria-label="Post options">•••</button></header>
    <div className={`feed-media ${isText ? 'feed-text' : ''}`}>
      {isText ? <p>{post.caption || 'YA KAVA update'}</p> : isImage ? <img src={post.videoUrl} alt={post.caption || 'YA KAVA post'} /> : <video src={post.videoUrl} autoPlay muted={muted} playsInline preload="metadata" loop controls={playing} onClick={() => setPlaying((current) => !current)} />}
      {!isText && !isImage && <button type="button" className="feed-media-control" onClick={() => setMuted((current) => !current)} aria-label={muted ? 'Unmute video' : 'Mute video'}>{muted ? <FaVolumeMute /> : <FaVolumeUp />}</button>}
      {!isText && !isImage && !playing && <button type="button" className="feed-play" onClick={() => setPlaying(true)} aria-label="Play video"><FaPlay /></button>}
    </div>
      <div className="feed-post-body"><div className="feed-actions"><button type="button" className={liked ? 'is-liked' : ''} aria-label={liked ? 'Unlike post' : 'Like post'} onClick={toggleLike}>{liked ? <FaHeart /> : <FaRegHeart />}</button><button type="button" aria-label="Show comments" onClick={toggleComments}><FaComment /></button><button type="button" aria-label="Reshare post" onClick={reshare}><FaShare /></button><button type="button" className="save-post" aria-label="Save post"><FaRegBookmark /></button></div><div className="feed-stats"><strong>{formatCount(likesCount)} likes</strong><span><FaEye /> {formatCount(post.views)} views</span></div>{post.caption && !isText && <p className="feed-caption"><strong>{post.author}{post.authorVerified && <span className="blog-verified" title="Verified account" aria-label="Verified account"><FaCheck /></span>}</strong> {post.caption}</p>}</div>
      {commentsOpen && <aside className="blog-comment-card" aria-label={`Comments for ${post.author}`}><header className="blog-comment-header"><div className="blog-comment-author"><span className="feed-avatar">{post.authorAvatarUrl ? <img src={post.authorAvatarUrl} alt="" /> : <FaCompactDisc />}</span><strong>{post.author}{post.authorVerified && <span className="blog-verified" title="Verified account" aria-label="Verified account"><FaCheck /></span>}</strong></div><button type="button" onClick={() => setCommentsOpen(false)} aria-label="Close comments"><FaTimes /></button></header><div className="blog-comment-list">{commentsLoading && <span className="comment-placeholder">Loading comments...</span>}{!commentsLoading && comments.length === 0 && <span className="comment-placeholder">No comments yet. Start the conversation.</span>}{comments.map((comment) => <article className="blog-comment" key={comment.id}><div className="comment-avatar">{comment.authorAvatarUrl ? <img src={comment.authorAvatarUrl} alt="" /> : comment.author.charAt(0).toUpperCase()}</div><div><strong>{comment.author}{comment.authorVerified && <span className="blog-verified" title="Verified account" aria-label="Verified account"><FaCheck /></span>}</strong><p>{comment.text}</p><small>{new Date(comment.createdAt).toLocaleDateString()} · Reply</small></div><button type="button" aria-label={`Like comment by ${comment.author}`}><FaRegHeart /></button></article>)}</div><form className="blog-comment-form" onSubmit={submitComment}><span className="comment-smile">☺</span><input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment..." maxLength="500" aria-label="Add a comment" /><button type="submit" aria-label="Post comment" disabled={!commentText.trim()}>Post</button></form></aside>}
  </article>
}

export default function Blog() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStory, setSelectedStory] = useState(null)
  const [focusedPostId, setFocusedPostId] = useState(null)
  const focusScrollY = useRef(0)
  const focusPost = (postId) => { focusScrollY.current = window.scrollY; setFocusedPostId(postId) }
  const clearFocusedPost = () => { setFocusedPostId(null); requestAnimationFrame(() => window.scrollTo({ top: focusScrollY.current, behavior: 'auto' })) }
  useEffect(() => {
    Promise.all([api.get('/posts'), api.get('/stories')]).then(([postsResponse, storiesResponse]) => { setPosts(postsResponse.data); setStories(storiesResponse.data) }).catch((requestError) => setError(requestError.response?.data?.error || 'Unable to load the feed right now.')).finally(() => setLoading(false))
  }, [])
  return <div className={`blog-page ${focusedPostId ? 'is-focused' : ''}`}><SimpleHeader showBack={false} /><main className="blog-shell"><div className="blog-topline"><button type="button" className="blog-back" onClick={() => navigate('/dashboard')}><FaArrowLeft /> Dashboard</button><nav className="blog-nav" aria-label="Content navigation"><Link to="/blog" className="is-current"><FaBookOpen /> Blog</Link><Link to="/products">Products</Link><Link to="/reels">Reels</Link></nav></div><header className="blog-heading"><div><p className="blog-kicker">The YA KAVA journal</p><h1>Stories from the feed.</h1><p>Follow the latest work, ideas, and updates from the creator community.</p></div><Link className="blog-reels-link" to="/reels">Open full Reels <FaArrowRight /></Link></header>{!loading && !error && stories.length > 0 && <section className="stories-panel"><div className="stories-heading"><span>Stories</span><small>Fresh from YA KAVA</small></div><div className="stories-row">{stories.map((story) => <Story key={story.id} story={{ ...story, onOpen: setSelectedStory }} />)}</div></section>}{loading && <div className="blog-state">Loading feed...</div>}{!loading && error && <div className="blog-state blog-state-error" role="alert">{error}</div>}{!loading && !error && posts.length === 0 && <div className="blog-state">No published posts yet. New stories will appear here.</div>}{!loading && !error && posts.length > 0 && <section className="feed-layout"><div className="feed-column">{posts.filter((post) => !focusedPostId || post.id === focusedPostId).map((post) => <FeedPost key={post.id} post={post} onFocus={focusPost} onBlur={clearFocusedPost} />)}</div><aside className="feed-aside"><p className="blog-kicker">Keep creating</p><h2>See the movement.</h2><p>Watch the full vertical feed for every post, interaction, and comment.</p><Link to="/reels">Explore Reels <FaArrowRight /></Link><div className="aside-note"><FaCalendarAlt /><span>New posts appear here as soon as they are published.</span></div></aside></section>}</main>{selectedStory && <StoryViewer story={selectedStory} onClose={() => setSelectedStory(null)} />}</div>
}
