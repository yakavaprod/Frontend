import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaShareAlt, FaDownload,
  FaEye, FaVolumeMute, FaVolumeUp, FaArrowLeft, FaCompactDisc, FaCheck,
  FaComment, FaPaperPlane, FaTimes, FaTh, FaPlay, FaShoppingBag, FaLink,
  FaUserPlus, FaUserCheck, FaMapMarkerAlt,
} from 'react-icons/fa'
import api from '../api.js'
import './Reels.css'

const getMediaKind = (url = '', postType = '') => {
  if (postType === 'text') return 'text'
  if (postType === 'image') return 'image'
  const clean = url.split('?')[0].toLowerCase()
  if (/(youtube\.com|youtu\.be)/.test(url)) return 'youtube'
  if (/\.(mp4|webm|ogg|mov)$/.test(clean)) return 'video'
  if (/\.(png|jpg|jpeg|gif|webp)$/.test(clean)) return 'image'
  return 'video'
}

const toYouTubeEmbed = (url) => {
  if (url.includes('/embed/')) return `${url}${url.includes('?') ? '&' : '?'}autoplay=1&mute=1&loop=1&playlist=${url.split('/embed/')[1].split('?')[0]}&playsinline=1&controls=0`
  const idMatch = url.match(/(?:v=|youtu\.be\/)([\w-]+)/)
  const id = idMatch ? idMatch[1] : ''
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1&controls=0`
}

const formatCount = (n = 0) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return `${n}`
}

const formatRelativeTime = (date) => {
  const hours = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 3600000))
  return hours < 24 ? `${hours}h` : `${Math.floor(hours / 24)}d`
}

/* Instagram-style Creator Profile Modal */
function InstagramProfileModal({ profile, posts, onClose, onSelectPost, onNavigateProducts }) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [followers, setFollowers] = useState(14820)
  const [activeTab, setActiveTab] = useState('grid')

  const authorName = profile?.author || 'YA KAVA PROD'
  const handle = authorName.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'yakavaprod'

  const authorPosts = posts.filter((p) => {
    if (profile.authorId && p.authorId) return p.authorId === profile.authorId
    return (p.author || '').trim().toLowerCase() === authorName.trim().toLowerCase()
  })
  const displayPosts = authorPosts.length > 0 ? authorPosts : posts

  const handleFollowToggle = () => {
    setIsFollowing((prev) => {
      const next = !prev
      setFollowers((count) => (next ? count + 1 : count - 1))
      return next
    })
  }

  const HIGHLIGHTS = [
    { title: 'Masterclass', icon: '🎓' },
    { title: 'Beat Kits', icon: '🎧' },
    { title: 'Studio', icon: '🎛️' },
    { title: 'MoMo Pay', icon: '⚡' },
    { title: 'Reviews', icon: '⭐' },
  ]

  return (
    <div className="insta-modal-overlay" onClick={onClose}>
      <div className="insta-profile-sheet" onClick={(e) => e.stopPropagation()}>
        <header className="insta-topbar">
          <button className="insta-back-btn" onClick={onClose} aria-label="Close profile">
            <FaArrowLeft />
          </button>
          <div className="insta-top-handle">
            <span className="insta-handle-text">{handle}</span>
            <span className="verified-badge" title="Verified Account">
              <FaCheck />
            </span>
          </div>
          <button className="insta-options-btn" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </header>

        <div className="insta-scroll-content">
          <div className="insta-header-row">
            <div className="insta-avatar-wrapper">
              <div className="insta-story-ring">
                <div className="insta-avatar-inner">
                  {profile.authorAvatarUrl ? (
                    <img src={profile.authorAvatarUrl} alt={authorName} />
                  ) : (
                    <FaCompactDisc className="insta-default-avatar" />
                  )}
                </div>
              </div>
            </div>

            <div className="insta-stats-cluster">
              <div className="insta-stat">
                <strong>{displayPosts.length}</strong>
                <span>Posts</span>
              </div>
              <div className="insta-stat">
                <strong>{followers.toLocaleString()}</strong>
                <span>Followers</span>
              </div>
              <div className="insta-stat">
                <strong>238</strong>
                <span>Following</span>
              </div>
            </div>
          </div>

          <div className="insta-bio-section">
            <div className="insta-name-row">
              <h2 className="insta-display-name">{authorName}</h2>
              {profile.authorVerified && (
                <span className="verified-badge" title="Verified Account">
                  <FaCheck />
                </span>
              )}
            </div>

            <span className="insta-category-tag">
              Music Production • Creative Studio & Academy
            </span>

            <div className="insta-bio-lines">
              <p>🎵 Official {authorName} Digital Marketplace & Audio Hub</p>
              <p>🎧 FL Studio Masterclasses, Presets, Sound Kits & Stems</p>
              <p>⚡ Instant automated delivery via Rwandan MTN MoMo (*182*...)</p>
              <p className="insta-location">
                <FaMapMarkerAlt /> Kigali, Rwanda 🇷🇼 • East Africa
              </p>
            </div>

            <a
              href="https://yakava.prod"
              target="_blank"
              rel="noreferrer"
              className="insta-link-row"
            >
              <FaLink className="insta-link-icon" />
              <span>yakava.prod</span>
            </a>
          </div>

          <div className="insta-actions-row">
            <button
              onClick={handleFollowToggle}
              className={`insta-btn ${isFollowing ? 'insta-btn--following' : 'insta-btn--primary'}`}
            >
              {isFollowing ? (
                <>
                  <FaUserCheck /> Following
                </>
              ) : (
                <>
                  <FaUserPlus /> Follow
                </>
              )}
            </button>
            <a
              href="mailto:book.yakava@gmail.com"
              className="insta-btn insta-btn--secondary"
            >
              Message
            </a>
            <button
              onClick={onNavigateProducts}
              className="insta-btn insta-btn--secondary"
            >
              <FaShoppingBag /> Shop Assets
            </button>
          </div>

          <div className="insta-highlights-row">
            {HIGHLIGHTS.map((item, idx) => (
              <div key={idx} className="insta-highlight-item">
                <div className="insta-highlight-bubble">
                  <span>{item.icon}</span>
                </div>
                <span className="insta-highlight-title">{item.title}</span>
              </div>
            ))}
          </div>

          <div className="insta-tabs">
            <button
              className={`insta-tab ${activeTab === 'grid' ? 'insta-tab--active' : ''}`}
              onClick={() => setActiveTab('grid')}
            >
              <FaTh /> <span>POSTS</span>
            </button>
            <button
              className={`insta-tab ${activeTab === 'reels' ? 'insta-tab--active' : ''}`}
              onClick={() => setActiveTab('reels')}
            >
              <FaPlay /> <span>REELS</span>
            </button>
          </div>

          <div className="insta-posts-grid">
            {displayPosts.map((p) => {
              const kind = getMediaKind(p.videoUrl, p.postType)
              return (
                <div
                  key={p.id}
                  className="insta-grid-item"
                  onClick={() => onSelectPost(p.id)}
                  title={p.caption || 'View post'}
                >
                  {kind === 'text' && <div className="insta-grid-text"><p>{p.caption || 'YA KAVA'}</p></div>}
                  {kind === 'video' && <video src={p.videoUrl} className="insta-grid-media" muted preload="metadata" />}
                  {kind === 'youtube' && <div className="insta-grid-youtube-thumb"><FaPlay className="yt-icon" /></div>}
                  {kind === 'image' && <img src={p.videoUrl} alt={p.caption || 'Post preview'} className="insta-grid-media" />}
                  <span className="insta-grid-badge"><FaPlay /></span>
                  <div className="insta-grid-overlay">
                    <div className="overlay-stat"><FaHeart /> {formatCount(p.likesCount)}</div>
                    <div className="overlay-stat"><FaEye /> {formatCount(p.views)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function ReelCard({ post, isActive, muted, onToggleMute, onViewed, onLike, onSave, onShare, onDownload, onComments, onAuthorClick }) {
  const videoRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const viewedRef = useRef(false)
  const kind = getMediaKind(post.videoUrl, post.postType)

  useEffect(() => {
    const el = videoRef.current
    if (!el || kind !== 'video') return
    if (isActive) {
      el.play().catch(() => {})
    } else {
      el.pause()
      el.currentTime = 0
      setProgress(0)
      viewedRef.current = false
    }
  }, [isActive, kind])

  useEffect(() => {
    if (isActive && !viewedRef.current) {
      viewedRef.current = true
      onViewed(post.id)
    }
  }, [isActive, onViewed, post.id])

  const handleTimeUpdate = () => {
    const el = videoRef.current
    if (!el || !el.duration) return
    setProgress(el.currentTime / el.duration)
  }

  const ringCircumference = 2 * Math.PI * 20
  const ringOffset = ringCircumference * (1 - progress)

  return (
    <section className="reel-card">
      <div className="reel-media">
        {kind === 'text' && <div className="reel-text-post">{post.caption || 'YA KAVA update'}</div>}
        {kind === 'video' && (
          <video
            ref={videoRef}
            src={post.videoUrl}
            className="reel-video"
            loop
            muted={muted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onClick={() => isActive && videoRef.current.paused ? videoRef.current.play() : videoRef.current?.pause()}
          />
        )}
        {kind === 'youtube' && isActive && (
          <iframe className="reel-video reel-iframe" src={toYouTubeEmbed(post.videoUrl)} title={post.caption || 'Reel'} allow="autoplay; encrypted-media" frameBorder="0" />
        )}
        {kind === 'image' && <img className="reel-video reel-image" src={post.videoUrl} alt={post.caption || 'Post'} />}
        <div className="reel-gradient" />
      </div>

      <button className="reel-mute" onClick={onToggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
        {muted ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>

      <div className="reel-info">
        <button
          type="button"
          className="reel-author"
          onClick={(e) => { e.stopPropagation(); onAuthorClick(post) }}
          title={`View ${post.author}'s Instagram profile`}
          aria-label={`View ${post.author}'s profile`}
        >
          <span className="reel-author-badge">{post.authorAvatarUrl ? <img src={post.authorAvatarUrl} alt="" /> : <FaCompactDisc />}</span>
          <span className="reel-author-name">{post.author}</span>
          {post.authorVerified && <span className="verified-badge" title="Verified YA KAVA account" aria-label="Verified account"><FaCheck /></span>}
        </button>
        {post.caption && <p className="reel-caption">{post.caption}</p>}
        <div className="reel-views"><FaEye /> {formatCount(post.views)} views</div>
      </div>

      <div className="reel-actions">
        <button
          type="button"
          className="reel-action-avatar"
          onClick={() => onAuthorClick(post)}
          title={`View ${post.author}'s profile`}
        >
          <svg viewBox="0 0 44 44" className="reel-progress-ring">
            <circle cx="22" cy="22" r="20" className="ring-track" />
            <circle cx="22" cy="22" r="20" className="ring-fill" strokeDasharray={ringCircumference} strokeDashoffset={ringOffset} />
          </svg>
          <span className="reel-action-avatar-inner"><FaCompactDisc /></span>
        </button>

        <button className={`reel-action ${post.isLiked ? 'is-active liked' : ''}`} onClick={() => onLike(post)}>
          {post.isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>{formatCount(post.likesCount)}</span>
        </button>

        <button className="reel-action" onClick={() => onShare(post)}>
          <FaShareAlt />
          <span>{formatCount(post.shares)}</span>
        </button>

        <button className="reel-action" onClick={() => onDownload(post)}>
          <FaDownload />
          <span>{formatCount(post.downloads)}</span>
        </button>

        <button className={`reel-action ${post.isSaved ? 'is-active saved' : ''}`} onClick={() => onSave(post)}>
          {post.isSaved ? <FaBookmark /> : <FaRegBookmark />}
          <span>Save</span>
        </button>

        <button className="reel-action" onClick={() => onComments(post)} aria-label="View comments">
          <FaComment />
          <span>Comments</span>
        </button>
      </div>
    </section>
  )
}

export default function Reels() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeId, setActiveId] = useState(null)
  const [muted, setMuted] = useState(true)
  const [toast, setToast] = useState('')
  const [comments, setComments] = useState([])
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsError, setCommentsError] = useState('')
  const [selectedProfile, setSelectedProfile] = useState(null)
  const containerRef = useRef(null)
  const cardRefs = useRef({})

  useEffect(() => {
    api.get('/posts')
      .then(({ data }) => setPosts(data))
      .catch((requestError) => setError(requestError.response?.data?.error || 'Unable to load reels.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!posts.length) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) setActiveId(entry.target.dataset.postId)
      })
    }, { root: containerRef.current, threshold: [0.6] })
    Object.values(cardRefs.current).forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [posts])

  useEffect(() => {
    if (!activeId) return
    setCommentsLoading(true)
    api.get(`/posts/${activeId}/comments`)
      .then(({ data }) => setComments(data))
      .catch(() => setCommentsError('Unable to load comments.'))
      .finally(() => setCommentsLoading(false))
  }, [activeId])

  const showToast = (message) => { setToast(message); setTimeout(() => setToast(''), 1600) }
  const handleViewed = useCallback((id) => { api.post(`/posts/${id}/view`).catch(() => {}) }, [])

  const handleLike = async (post) => {
    try {
      const { data } = await api.post(`/posts/${post.id}/like`)
      setPosts((current) => current.map((p) => (p.id === post.id ? { ...p, isLiked: data.isLiked, likesCount: data.likesCount } : p)))
    } catch (e) { if (e.response?.status === 401) navigate('/login') }
  }

  const handleSave = async (post) => {
    try {
      const { data } = await api.post(`/posts/${post.id}/save`)
      setPosts((current) => current.map((p) => (p.id === post.id ? { ...p, isSaved: data.isSaved } : p)))
      showToast(data.isSaved ? 'Saved to bookmarks' : 'Removed from bookmarks')
    } catch (e) { if (e.response?.status === 401) navigate('/login') }
  }

  const handleShare = (post) => {
    const url = `${window.location.origin}/reels#${post.id}`
    if (navigator.share) navigator.share({ title: post.caption || 'YA KAVA', url }).catch(() => {})
    else { navigator.clipboard.writeText(url); showToast('Link copied') }
    api.post(`/posts/${post.id}/share`).catch(() => {})
  }

  const handleDownload = async (post) => {
    window.open(post.videoUrl, '_blank', 'noopener')
    showToast('Opening to download')
    api.post(`/posts/${post.id}/download`).catch(() => {})
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim() || !activeId) return
    try {
      const { data } = await api.post(`/posts/${activeId}/comments`, { text: commentText })
      setComments((current) => [data, ...current])
      setCommentText('')
    } catch (e) { if (e.response?.status === 401) navigate('/login') }
  }

  const handleCommentLike = async (comment) => {
    try {
      const { data } = await api.post(`/comments/${comment.id}/like`)
      setComments((current) => current.map((item) => item.id === comment.id ? { ...item, ...data } : item))
    } catch (e) { if (e.response?.status === 401) navigate('/login') }
  }

  const handleAuthorClick = (post) => setSelectedProfile(post)
  const handleSelectPostFromProfile = (postId) => {
    setSelectedProfile(null)
    setActiveId(postId)
    requestAnimationFrame(() => cardRefs.current[postId]?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }

  const activePost = posts.find((p) => p.id === activeId)

  return (
    <div className="reels-page">
      <header className="reels-topbar">
        <button className="reels-back" onClick={() => navigate(-1)}><FaArrowLeft /></button>
        <h1>Reels</h1>
      </header>
      {!loading && !error && posts.length > 0 && (
        <div className="reels-stage">
          <div className="reels-feed" ref={containerRef}>
            {posts.map((post) => (
              <div key={post.id} data-post-id={post.id} ref={(el) => { cardRefs.current[post.id] = el }} className="reels-feed-item">
                <ReelCard post={post} isActive={activeId === post.id} muted={muted} onToggleMute={() => setMuted((m) => !m)} onViewed={handleViewed} onLike={handleLike} onSave={handleSave} onShare={handleShare} onDownload={handleDownload} onComments={() => { setActiveId(post.id); setCommentsOpen(true) }} onAuthorClick={handleAuthorClick} />
              </div>
            ))}
          </div>
          {commentsOpen && (
            <aside className="comments-panel">
              <div className="comments-heading">
                <div className="comments-post-author">
                  {activePost?.authorAvatarUrl ? <img src={activePost.authorAvatarUrl} alt="" /> : <FaCompactDisc />}
                  <strong>{activePost?.author || 'YA KAVA'}</strong>
                </div>
                <button type="button" className="comments-close" onClick={() => setCommentsOpen(false)}><FaTimes /></button>
              </div>
              <div className="comments-list">
                {comments.map((c) => (
                  <article className="comment" key={c.id}>
                    <div><strong>{c.author}</strong><p>{c.text}</p></div>
                    <button type="button" className={`comment-like ${c.isLiked ? 'is-liked' : ''}`} onClick={() => handleCommentLike(c)}>{c.isLiked ? <FaHeart /> : <FaRegHeart />}</button>
                  </article>
                ))}
              </div>
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." />
                <button type="submit"><FaPaperPlane /></button>
              </form>
            </aside>
          )}
        </div>
      )}
      {selectedProfile && (
        <InstagramProfileModal profile={selectedProfile} posts={posts} onClose={() => setSelectedProfile(null)} onSelectPost={handleSelectPostFromProfile} onNavigateProducts={() => { setSelectedProfile(null); navigate('/products') }} />
      )}
      {toast && <div className="reels-toast">{toast}</div>}
    </div>
  )
}