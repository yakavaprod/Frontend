import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBoxOpen, FaChartLine, FaCheckCircle, FaCompactDisc, FaEdit, FaEye, FaHeart, FaPlus, FaReceipt, FaShareAlt, FaDownload, FaTrash, FaUsers, FaLaptopCode, FaSignOutAlt, FaCog, FaHeadset } from 'react-icons/fa'
import { MdOutlineDashboard } from 'react-icons/md'
import api, { clearSession } from '../api.js'
import './Admin.css'

const emptyProduct = {
  title: '', category: 'products', price: '', discount: 0, description: '', image: '', videoUrl: '', trailerUrl: '', downloadUrl: '', instructor: '', duration: '',
}

const CATEGORY_LABELS = { courses: 'Course', products: 'Digital Asset', services: 'Service' }
const emptyReel = { videoUrl: '', postType: 'video', isStory: false, caption: '', status: 'published' }

export default function Admin() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [overview, setOverview] = useState({ products: 0, orders: 0, users: 0, paidOrders: 0, reels: 0 })
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [reels, setReels] = useState([])
  const [supportTickets, setSupportTickets] = useState([])
  const [selectedTicketId, setSelectedTicketId] = useState('')
  const [replyText, setReplyText] = useState('')
  const [replying, setReplying] = useState(false)

  const [productForm, setProductForm] = useState(emptyProduct)
  const [editingProductId, setEditingProductId] = useState(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [reelForm, setReelForm] = useState(emptyReel)
  const [editingReelId, setEditingReelId] = useState(null)
  const [showReelForm, setShowReelForm] = useState(false)
  const [savingReel, setSavingReel] = useState(false)

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [overviewRes, productsRes, ordersRes, usersRes, reelsRes, ticketsRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/products'),
        api.get('/admin/orders'),
        api.get('/admin/users'),
        api.get('/admin/posts'),
        api.get('/admin/support-tickets'),
      ])
      setOverview(overviewRes.data)
      setProducts(productsRes.data)
      setOrders(ordersRes.data)
      setUsers(usersRes.data)
      setReels(reelsRes.data)
      setSupportTickets(ticketsRes.data)
    } catch (requestError) {
      if (requestError.response?.status === 401 || requestError.response?.status === 403) {
        navigate('/login')
        return
      }
      setError(requestError.response?.data?.error || 'Unable to load admin data right now.')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => { loadAll() }, [loadAll])

  useEffect(() => {
    if (!supportTickets.length) {
      setSelectedTicketId('')
      return
    }

    if (!selectedTicketId || !supportTickets.some((ticket) => ticket._id === selectedTicketId)) {
      setSelectedTicketId(supportTickets[0]._id)
    }
  }, [supportTickets, selectedTicketId])

  const selectedTicket = supportTickets.find((ticket) => ticket._id === selectedTicketId) || null

  const handleReply = async (event) => {
    event.preventDefault()
    if (!selectedTicket || !replyText.trim()) return

    setReplying(true)
    try {
      const { data } = await api.post(`/admin/support-tickets/${selectedTicket._id}/replies`, {
        message: replyText,
        status: selectedTicket.status,
      })

      setSupportTickets((current) => current.map((ticket) =>
        ticket._id === selectedTicket._id ? data.ticket : ticket
      ))
      setReplyText('')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to send the reply.')
    } finally {
      setReplying(false)
    }
  }

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  const toggleProductStatus = async (product) => {
    try {
      const nextStatus = product.status === 'published' ? 'draft' : 'published'
      const { data } = await api.patch(`/admin/products/${product._id}`, { status: nextStatus })
      setProducts((current) => current.map((p) => (p._id === product._id ? data : p)))
    } catch {
      setError('Unable to update product status.')
    }
  }

  const openNewProductForm = () => {
    setProductForm(emptyProduct)
    setEditingProductId(null)
    setShowProductForm(true)
  }

  const editProduct = (product) => {
    setProductForm({
      title: product.title,
      category: product.category,
      price: product.price,
      discount: product.discount || 0,
      description: product.description,
      image: product.image || '',
      videoUrl: product.videoUrl || '',
      trailerUrl: product.trailerUrl || '',
      downloadUrl: product.downloadUrl || '',
      instructor: product.instructor || '',
      duration: product.duration || '',
    })
    setEditingProductId(product._id)
    setShowProductForm(true)
  }

  const handleProductInput = (event) => {
    const { name, value } = event.target
    setProductForm((current) => ({ ...current, [name]: value }))
  }

  const saveProduct = async (event) => {
    event.preventDefault()
    if (!productForm.title.trim() || Number.isNaN(Number(productForm.price))) return
    setSaving(true)
    setError('')
    const payload = {
      title: productForm.title.trim(),
      category: productForm.category,
      price: Number(productForm.price),
      discount: Math.min(100, Math.max(0, Number(productForm.discount) || 0)),
      description: productForm.description,
      image: productForm.image,
      videoUrl: productForm.videoUrl,
      trailerUrl: productForm.trailerUrl,
      downloadUrl: productForm.downloadUrl,
      instructor: productForm.instructor,
      duration: productForm.duration,
    }
    try {
      if (editingProductId) {
        const { data } = await api.patch(`/admin/products/${editingProductId}`, payload)
        setProducts((current) => current.map((p) => (p._id === editingProductId ? data : p)))
      } else {
        const { data } = await api.post('/admin/products', payload)
        setProducts((current) => [data, ...current])
      }
      setProductForm(emptyProduct)
      setEditingProductId(null)
      setShowProductForm(false)
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to save product.')
    } finally {
      setSaving(false)
    }
  }

  const removeProduct = async (id) => {
    try {
      await api.delete(`/admin/products/${id}`)
      setProducts((current) => current.filter((product) => product._id !== id))
    } catch {
      setError('Unable to delete product.')
    }
  }

  const markOrderPaid = async (order) => {
    try {
      const nextStatus = order.status === 'paid' ? 'pending' : 'paid'
      const { data } = await api.patch(`/orders/${order._id}/status`, { status: nextStatus })
      setOrders((current) => current.map((o) => (o._id === order._id ? { ...o, status: data.status } : o)))
    } catch {
      setError('Unable to update order status.')
    }
  }

  const toggleUserStatus = async (user) => {
    try {
      const nextStatus = user.status === 'active' ? 'suspended' : 'active'
      const { data } = await api.patch(`/admin/users/${user._id}/status`, { status: nextStatus })
      setUsers((current) => current.map((u) => (u._id === user._id ? data : u)))
    } catch {
      setError('Unable to update user status.')
    }
  }

  const openNewReelForm = () => {
    setReelForm(emptyReel)
    setEditingReelId(null)
    setShowReelForm(true)
  }

  const editReel = (reel) => {
    setReelForm({ videoUrl: reel.videoUrl || '', postType: reel.postType || 'video', isStory: reel.isStory || false, caption: reel.caption || '', status: reel.status })
    setEditingReelId(reel.id)
    setShowReelForm(true)
  }

  const handleReelInput = (event) => {
    const { name, value } = event.target
    setReelForm((current) => ({ ...current, [name]: value }))
  }

  const saveReel = async (event) => {
    event.preventDefault()
    if (reelForm.postType !== 'text' && !reelForm.videoUrl.trim()) return
    setSavingReel(true)
    setError('')
    try {
      if (editingReelId) {
        const { data } = await api.patch(`/admin/posts/${editingReelId}`, reelForm)
        setReels((current) => current.map((r) => (r.id === editingReelId ? data : r)))
      } else {
        const { data } = await api.post('/admin/posts', reelForm)
        setReels((current) => [data, ...current])
      }
      setReelForm(emptyReel)
      setEditingReelId(null)
      setShowReelForm(false)
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to save reel.')
    } finally {
      setSavingReel(false)
    }
  }

  const toggleReelStatus = async (reel) => {
    try {
      const nextStatus = reel.status === 'published' ? 'draft' : 'published'
      const { data } = await api.patch(`/admin/posts/${reel.id}`, { status: nextStatus })
      setReels((current) => current.map((r) => (r.id === reel.id ? data : r)))
    } catch {
      setError('Unable to update reel status.')
    }
  }

  const removeReel = async (id) => {
    try {
      await api.delete(`/admin/posts/${id}`)
      setReels((current) => current.filter((reel) => reel.id !== id))
    } catch {
      setError('Unable to delete reel.')
    }
  }

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand" onClick={() => navigate('/')} title="Return to site">
          <FaLaptopCode /> <span>Aurora</span>
        </div>
        
        <nav className="admin-nav" aria-label="Admin sections">
          <button className={activeTab === 'overview' ? 'is-active' : ''} onClick={() => setActiveTab('overview')}><MdOutlineDashboard /> Overview</button>
          <button className={activeTab === 'products' ? 'is-active' : ''} onClick={() => setActiveTab('products')}><FaBoxOpen /> Products</button>
          <button className={activeTab === 'orders' ? 'is-active' : ''} onClick={() => setActiveTab('orders')}><FaReceipt /> Orders</button>
          <button className={activeTab === 'users' ? 'is-active' : ''} onClick={() => setActiveTab('users')}><FaUsers /> Customers</button>
          <button className={activeTab === 'reels' ? 'is-active' : ''} onClick={() => setActiveTab('reels')}><FaCompactDisc /> Content (Reels)</button>
          <button className={activeTab === 'support' ? 'is-active' : ''} onClick={() => setActiveTab('support')}><FaHeadset /> Support Tickets</button>
        </nav>
        
        <div className="admin-sidebar-footer">
          <button onClick={() => navigate('/settings')}><FaCog /> Settings</button>
          <button onClick={handleLogout}><FaSignOutAlt /> Sign out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>
            {activeTab === 'overview' && 'Overview Dashboard'}
            {activeTab === 'products' && 'Product Management'}
            {activeTab === 'orders' && 'Order Management'}
            {activeTab === 'users' && 'Customer Base'}
            {activeTab === 'reels' && 'Content Studio'}
            {activeTab === 'support' && 'Support Tickets'}
          </h1>
          <div className="admin-header-actions">
            <button className="admin-profile-btn" onClick={() => navigate('/settings')}>
              <div className="admin-avatar">A</div>
              <span>Admin User</span>
            </button>
          </div>
        </header>

        {error && <p role="alert" className="form-error">⚠️ {error}</p>}

        {loading ? (
          <section className="admin-content"><p style={{ color: 'var(--text-muted)' }}>Loading platform data…</p></section>
        ) : (
        <>
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <section className="admin-content">
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-header"><span>Total Revenue</span> <FaChartLine /></div>
                <h3 className="stat-value">RWF {(orders.reduce((acc, o) => acc + (o.status === 'paid' ? o.total : 0), 0) || 0).toLocaleString()}</h3>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span>Total Products</span> <FaBoxOpen /></div>
                <h3 className="stat-value">{overview.products}</h3>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span>Active Orders</span> <FaReceipt /></div>
                <h3 className="stat-value">{overview.orders}</h3>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span>Registered Users</span> <FaUsers /></div>
                <h3 className="stat-value">{overview.users}</h3>
              </div>
              <div className="stat-card">
                <div className="stat-header"><span>Published Content</span> <FaCompactDisc /></div>
                <h3 className="stat-value">{overview.reels}</h3>
              </div>
            </div>
            
            <div className="admin-grid">
              <section className="admin-panel">
                <div className="panel-heading">
                  <h2>Recent Products</h2>
                  <button onClick={() => setActiveTab('products')}>View All</button>
                </div>
                <div className="admin-list">
                  {products.slice(0, 4).map((product) => (
                    <div className="admin-list-row" key={product._id}>
                      <div className="admin-list-info">
                        <div className="list-icon"><FaBoxOpen /></div>
                        <div className="admin-list-text">
                          <strong>{product.title}</strong>
                          <small>{CATEGORY_LABELS[product.category]}</small>
                        </div>
                      </div>
                      <div className="admin-list-value">
                        RWF {product.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              <section className="admin-panel">
                <div className="panel-heading">
                  <h2>Latest Orders</h2>
                  <button onClick={() => setActiveTab('orders')}>View All</button>
                </div>
                <div className="admin-list">
                  {orders.slice(0, 4).map((order) => (
                    <div className="admin-list-row" key={order._id}>
                      <div className="admin-list-info">
                        <div className="list-icon order"><FaReceipt /></div>
                        <div className="admin-list-text">
                          <strong>{order.orderNumber}</strong>
                          <small>{order.user?.name}</small>
                        </div>
                      </div>
                      <div>
                        <span className={`status-badge ${order.status}`}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Product Catalog</h2>
              <button className="primary-admin-btn" onClick={openNewProductForm}><FaPlus /> Add Product</button>
            </div>
            
            {showProductForm && activeTab === 'products' && (
              <form className="product-form" onSubmit={saveProduct}>
                <div className="product-form-grid">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input name="title" value={productForm.title} onChange={handleProductInput} placeholder="e.g. Kigali Drum Kit" required />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={productForm.category} onChange={handleProductInput}>
                      <option value="products">Digital Asset</option>
                      <option value="courses">Course</option>
                      <option value="services">Service</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price (RWF)</label>
                    <input name="price" type="number" min="0" step="0.01" value={productForm.price} onChange={handleProductInput} placeholder="0.00" required />
                  </div>
                  <div className="form-group">
                    <label>Discount (%)</label>
                    <input name="discount" type="number" min="0" max="100" value={productForm.discount} onChange={handleProductInput} />
                  </div>
                  <div className="form-group">
                    <label>Instructor / Creator</label>
                    <input name="instructor" value={productForm.instructor} onChange={handleProductInput} placeholder="e.g. Sarah Chen" />
                  </div>
                  <div className="form-group">
                    <label>Duration / Access</label>
                    <input name="duration" value={productForm.duration} onChange={handleProductInput} placeholder="e.g. Lifetime" />
                  </div>
                  <div className="form-group product-form-wide">
                    <label>Image Cover URL</label>
                    <input name="image" type="url" value={productForm.image} onChange={handleProductInput} placeholder="https://..." />
                  </div>
                  <div className="form-group product-form-wide">
                    <label>Description</label>
                    <textarea name="description" value={productForm.description} onChange={handleProductInput} placeholder="Explain what customers receive..." required />
                  </div>
                  
                  {productForm.category === 'courses' ? (
                    <>
                      <div className="form-group product-form-wide">
                        <label>Trailer / Public Video</label>
                        <input name="trailerUrl" type="url" value={productForm.trailerUrl} onChange={handleProductInput} placeholder="https://www.youtube.com/embed/..." />
                        <small>Public preview acting as the course trailer.</small>
                      </div>
                      <div className="form-group product-form-wide">
                        <label>Paid Content Video</label>
                        <input name="videoUrl" type="url" value={productForm.videoUrl} onChange={handleProductInput} placeholder="https://www.youtube.com/embed/..." />
                        <small>The full video access unlocked after payment.</small>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group product-form-wide">
                        <label>Preview Video</label>
                        <input name="videoUrl" type="url" value={productForm.videoUrl} onChange={handleProductInput} placeholder="https://www.youtube.com/embed/..." />
                        <small>Public demo not locked behind payment.</small>
                      </div>
                      <div className="form-group product-form-wide">
                        <label>Download Link (Asset)</label>
                        <input name="downloadUrl" type="url" value={productForm.downloadUrl} onChange={handleProductInput} placeholder="https://example.com/file.zip" />
                        <small>File delivered after purchase.</small>
                      </div>
                    </>
                  )}
                </div>

                {(productForm.category === 'courses' ? (productForm.trailerUrl || productForm.videoUrl) : productForm.videoUrl) && (
                  <div className="video-preview">
                    <div className="video-preview-label">Preview Player</div>
                    <iframe src={productForm.category === 'courses' ? (productForm.trailerUrl || productForm.videoUrl) : productForm.videoUrl} title="Preview" allowFullScreen />
                  </div>
                )}
                
                <div className="form-actions">
                  <button type="submit" className="primary-admin-btn" disabled={saving}>{saving ? 'Saving...' : editingProductId ? 'Save Changes' : 'Create Product'}</button>
                  <button type="button" className="btn-secondary" onClick={() => { setProductForm(emptyProduct); setEditingProductId(null); setShowProductForm(false) }}>Cancel</button>
                </div>
              </form>
            )}

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product details</th>
                    <th>Category</th>
                    <th>Pricing</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="td-product">
                          <div className="td-product-icon">
                            {product.image ? <img src={product.image} alt="" /> : <FaBoxOpen />}
                          </div>
                          <div className="td-product-info">
                            <strong>{product.title}</strong>
                            <small>{product.description}</small>
                          </div>
                        </div>
                      </td>
                      <td>{CATEGORY_LABELS[product.category]}</td>
                      <td>
                        <div className="td-product-info">
                          <strong>RWF {product.price.toFixed(2)}</strong>
                          {product.discount > 0 && <small style={{ color: 'var(--status-yellow)' }}>{product.discount}% OFF</small>}
                        </div>
                      </td>
                      <td>
                        <button className={`status-badge ${product.status}`} onClick={() => toggleProductStatus(product)}>
                          {product.status}
                        </button>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button aria-label="Edit" onClick={() => editProduct(product)}><FaEdit /></button>
                          <button aria-label="Delete" className="delete" onClick={() => removeProduct(product._id)}><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Transactions & Orders</h2>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td><strong>{order.orderNumber}</strong></td>
                      <td>{order.user?.name}</td>
                      <td>{order.items.map(i => i.title).join(', ')}</td>
                      <td><strong>RWF {order.total.toFixed(2)}</strong></td>
                      <td>
                        <button className={`status-badge ${order.status}`} onClick={() => markOrderPaid(order)}>
                          {order.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Customer Directory</h2>
            </div>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>System Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.email}</td>
                      <td><span style={{ textTransform: 'capitalize', color: 'var(--text-subtle)' }}>{user.role}</span></td>
                      <td>
                        <button className={`status-badge ${user.status}`} onClick={() => toggleUserStatus(user)}>
                          {user.status}
                        </button>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button aria-label="Edit"><FaEdit /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* REELS TAB */}
        {activeTab === 'support' && (
          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Support Tickets</h2>
            </div>

            {supportTickets.length === 0 ? (
              <div className="admin-support-empty">No support tickets yet.</div>
            ) : (
              <div className="admin-support-layout">
                <div className="admin-table-container admin-support-table">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Category</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportTickets.map((ticket) => (
                        <tr
                          key={ticket._id}
                          className={selectedTicketId === ticket._id ? 'is-selected' : ''}
                          onClick={() => setSelectedTicketId(ticket._id)}
                        >
                          <td>
                            <div className="td-product-info">
                              <strong>{ticket.name}</strong>
                              <small>{ticket.email}</small>
                            </div>
                          </td>
                          <td style={{ textTransform: 'capitalize' }}>{ticket.category}</td>
                          <td>{ticket.subject}</td>
                          <td>
                            <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
                          </td>
                          <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedTicket && (
                  <div className="support-ticket-detail">
                    <div className="support-ticket-detail__header">
                      <div>
                        <p className="eyebrow">Ticket #{selectedTicket._id.slice(-6)}</p>
                        <h3>{selectedTicket.subject}</h3>
                      </div>
                      <span className={`status-badge ${selectedTicket.status}`}>{selectedTicket.status}</span>
                    </div>

                    <div className="support-ticket-detail__meta">
                      <div><strong>Name:</strong> {selectedTicket.name}</div>
                      <div><strong>Email:</strong> {selectedTicket.email}</div>
                      <div><strong>Category:</strong> {selectedTicket.category}</div>
                      <div><strong>Source:</strong> {selectedTicket.sourceUrl || 'Unknown'}</div>
                    </div>

                    <div className="support-ticket-detail__message">
                      <h4>Problem details</h4>
                      <p>{selectedTicket.message}</p>
                    </div>

                    <div className="support-ticket-detail__replies">
                      <h4>Conversation</h4>

                      {selectedTicket.replies && selectedTicket.replies.length > 0 ? (
                        selectedTicket.replies.map((reply, index) => (
                          <div key={`${reply.sender}-${index}`} className={`support-detail-reply support-detail-reply--${reply.sender}`}>
                            <div className="support-detail-reply__meta">
                              <strong>{reply.sender === 'admin' ? 'Admin' : 'Customer'}</strong>
                              <span>{new Date(reply.createdAt || selectedTicket.createdAt).toLocaleString()}</span>
                            </div>
                            <p>{reply.message}</p>
                          </div>
                        ))
                      ) : (
                        <p className="support-detail-empty">No replies yet. Send the first update.</p>
                      )}
                    </div>

                    <form onSubmit={handleReply} className="support-reply-form">
                      <label>
                        Admin reply
                        <textarea
                          value={replyText}
                          onChange={(event) => setReplyText(event.target.value)}
                          rows="5"
                          placeholder="Write a reply to the customer..."
                          required
                        />
                      </label>

                      <div className="support-reply-form__actions">
                        <select
                          value={selectedTicket.status}
                          onChange={(event) => {
                            setSupportTickets((current) => current.map((ticket) =>
                              ticket._id === selectedTicket._id ? { ...ticket, status: event.target.value } : ticket
                            ))
                          }}
                        >
                          <option value="open">Open</option>
                          <option value="pending">Pending</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button type="submit" disabled={replying}>
                          {replying ? 'Sending...' : 'Send reply'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === 'reels' && (
          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Content Studio (Reels)</h2>
              <button className="primary-admin-btn" onClick={openNewReelForm}><FaPlus /> Post Reel</button>
            </div>
            
            {showReelForm && activeTab === 'reels' && (
              <form className="product-form" onSubmit={saveReel}>
                <div className="product-form-grid">
                  <div className="form-group">
                    <label>Post Type</label>
                    <select name="postType" value={reelForm.postType} onChange={handleReelInput}>
                      <option value="video">Video</option>
                      <option value="image">Image</option>
                      <option value="text">Text Only</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Initial Status</label>
                    <select name="status" value={reelForm.status} onChange={handleReelInput}>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  
                  {reelForm.postType !== 'text' && (
                    <div className="form-group product-form-wide">
                      <label>{reelForm.postType === 'image' ? 'Image URL' : 'Video URL'}</label>
                      <input name="videoUrl" type="url" value={reelForm.videoUrl} onChange={handleReelInput} placeholder="https://..." required />
                    </div>
                  )}
                  
                  <div className="form-group product-form-wide">
                    <label>Caption / Text Content</label>
                    <textarea name="caption" value={reelForm.caption} onChange={handleReelInput} placeholder="What do you want to say?" required />
                  </div>
                  
                  <div className="product-form-wide">
                    <label className="story-check">
                      <input name="isStory" type="checkbox" checked={reelForm.isStory} onChange={(e) => setReelForm(c => ({...c, isStory: e.target.checked}))} />
                      Highlight in Top Stories
                    </label>
                  </div>
                </div>

                {reelForm.postType === 'video' && reelForm.videoUrl && /\.(mp4|webm|ogg|mov)$/i.test(reelForm.videoUrl.split('?')[0]) && (
                  <div className="video-preview">
                    <div className="video-preview-label">Direct Video Source</div>
                    <video src={reelForm.videoUrl} controls style={{ width: '100%', maxHeight: 400 }} />
                  </div>
                )}
                {reelForm.postType === 'video' && reelForm.videoUrl && !/\.(mp4|webm|ogg|mov)$/i.test(reelForm.videoUrl.split('?')[0]) && (
                  <div className="video-preview">
                    <div className="video-preview-label">Embed Player</div>
                    <iframe src={reelForm.videoUrl} title="Reel preview" allowFullScreen />
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="primary-admin-btn" disabled={savingReel}>{savingReel ? 'Publishing...' : editingReelId ? 'Save Edits' : 'Publish Reel'}</button>
                  <button type="button" className="btn-secondary" onClick={() => { setReelForm(emptyReel); setEditingReelId(null); setShowReelForm(false) }}>Cancel</button>
                </div>
              </form>
            )}

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Post Content</th>
                    <th>Engagement Stats</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reels.map((reel) => (
                    <tr key={reel.id}>
                      <td>
                        <div className="td-product-info">
                          <strong>{reel.caption || 'Untitled Post'}</strong>
                          <small style={{ textTransform: 'capitalize' }}>
                            {reel.postType || 'video'} {reel.isStory && ' • Story Highlight'}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="reel-stats">
                          <span><FaEye /> {reel.views || 0}</span>
                          <span><FaHeart /> {reel.likesCount || 0}</span>
                          <span><FaShareAlt /> {reel.shares || 0}</span>
                          <span><FaDownload /> {reel.downloads || 0}</span>
                        </div>
                      </td>
                      <td>
                        <button className={`status-badge ${reel.status}`} onClick={() => toggleReelStatus(reel)}>
                          {reel.status}
                        </button>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button aria-label="Edit" onClick={() => editReel(reel)}><FaEdit /></button>
                          <button aria-label="Delete" className="delete" onClick={() => removeReel(reel.id)}><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        </>
        )}
      </main>
    </div>
  )
}