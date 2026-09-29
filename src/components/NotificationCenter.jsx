import { useEffect, useMemo, useState } from 'react'
import {
  FaBell,
  FaCheck,
  FaClock,
  FaExclamationCircle,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaSyncAlt,
  FaReceipt,
} from 'react-icons/fa'
import api from '../api.js'
import './NotificationCenter.css'

const TYPE_META = {
  order: { icon: <FaReceipt />, label: 'Order' },
  payment: { icon: <FaMoneyBillWave />, label: 'Payment' },
  invoice: { icon: <FaFileInvoiceDollar />, label: 'Invoice' },
  status: { icon: <FaCheck />, label: 'Update' },
  alert: { icon: <FaExclamationCircle />, label: 'Notice' },
}

const formatRelativeTime = (date) => {
  if (!date) return 'Just now'

  const diffMs = Date.now() - new Date(date).getTime()
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000))

  if (diffMinutes < 60) return `${diffMinutes}m ago`
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.round(diffHours / 24)
  return `${diffDays}d ago`
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    let endpointUnavailable = false

    const loadNotifications = async () => {
      try {
        const { data } = await api.get('/notifications', { params: { limit: 20 } })
        if (cancelled) return

        const items = Array.isArray(data) ? data : (data?.notifications || [])
        setNotifications(items)
        setLoadError('')
      } catch (requestError) {
        if (cancelled) return
        const status = requestError.response?.status
        endpointUnavailable = status === 404 || status === 401
        setLoadError(status === 404
          ? 'Notifications are not enabled on the connected server yet. The backend needs to be updated.'
          : status === 401
            ? 'Your session is not valid for this server. Sign in again to load your notifications.'
            : 'Notifications could not be loaded. Check your connection and try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadNotifications()
    const poller = window.setInterval(() => {
      if (!endpointUnavailable) loadNotifications()
    }, 15000)
    return () => { cancelled = true; window.clearInterval(poller) }
  }, [reloadToken])

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read && !item.isRead).length,
    [notifications]
  )

  const handleMarkRead = async (id) => {
    if (!id) return

    setNotifications((current) => current.map((notification) => (
      notification._id === id
        ? { ...notification, read: true, isRead: true }
        : notification
    )))

    try {
      await api.patch(`/notifications/${id}/read`)
    } catch {
      // Gracefully ignore API-level read errors and keep the UI state optimistic.
    }
  }

  const handleMarkAllRead = async () => {
    if (!notifications.length) return

    setNotifications((current) => current.map((notification) => ({
      ...notification,
      read: true,
      isRead: true,
    })))

    try {
      await api.patch('/notifications/read-all')
    } catch {
      // Gracefully ignore API-level read errors and keep the UI state optimistic.
    }
  }

  const getNotificationMeta = (type) => TYPE_META[type] || TYPE_META.alert

  const getOrderStatusInfo = (notification) => {
    const metadata = notification?.metadata || {}
    const orderNumber = metadata.orderNumber || metadata.orderId || null
    const status = metadata.status || metadata.paymentStatus || 'pending'
    const paymentStatus = metadata.paymentStatus || 'pending'
    const total = metadata.total

    return { orderNumber, status, paymentStatus, total }
  }

  return (
    <div className="notification-center">
      <button
        type="button"
        className="notification-button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => {
          if (!open) setReloadToken((current) => current + 1)
          setOpen((current) => !current)
        }}
      >
        <FaBell />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-panel" role="dialog" aria-label="Notifications panel">
          <div className="notification-header">
            <div>
              <h3>Notifications</h3>
              <p>Recent account and order activity</p>
            </div>
            <div className="notification-header-actions">
              {unreadCount > 0 && (
                <button type="button" className="notification-mark-read" onClick={handleMarkAllRead}>
                  Mark all read
                </button>
              )}
              <button type="button" className="notification-refresh" aria-label="Refresh notifications" title="Refresh notifications" onClick={() => setReloadToken((current) => current + 1)}>
                <FaSyncAlt />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="notification-state"><span className="notification-loading-mark" /><strong>Checking your updates</strong><span>Loading your latest activity.</span></div>
          ) : loadError ? (
            <div className="notification-state notification-state--error">
              <span className="notification-state-icon"><FaExclamationCircle /></span>
              <strong>{loadError.includes('Sign in again') ? 'Please sign in again' : 'We couldn’t load your updates'}</strong>
              <span>{loadError}</span>
              <button type="button" onClick={() => setReloadToken((current) => current + 1)}>Try again</button>
            </div>
          ) : notifications.length === 0 ? (
            <div className="notification-state">
              <span className="notification-state-icon"><FaBell /></span>
              <strong>You’re all caught up</strong>
              <span>New order updates, product releases, and offers will appear here.</span>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => {
                const typeMeta = getNotificationMeta(notification.type)
                const isUnread = !notification.read && !notification.isRead
                const orderInfo = getOrderStatusInfo(notification)

                return (
                  <div
                    key={notification._id || notification.id || `${notification.type}-${notification.createdAt}`}
                    className={`notification-item ${isUnread ? 'unread' : ''} ${notification.metadata?.resourceType === 'welcome' ? 'notification-item--welcome' : ''}`}
                    onClick={() => handleMarkRead(notification._id || notification.id)}
                  >
                    <div className="notification-icon">{typeMeta.icon}</div>

                    <div className="notification-message">
                      <span className="notification-title">{notification.title || typeMeta.label}</span>
                      <span className="notification-copy">{notification.message || notification.body || 'You have a new update.'}</span>
                      {(orderInfo.orderNumber || orderInfo.total !== undefined) && (
                        <div className="notification-order-meta">
                          {orderInfo.orderNumber && <span className="notification-order-chip">#{orderInfo.orderNumber}</span>}
                          {orderInfo.total !== undefined && <span className="notification-order-chip">{new Intl.NumberFormat('en-US', { style: 'currency', currency: notification.metadata?.currency || 'RWF', maximumFractionDigits: 2 }).format(orderInfo.total)}</span>}
                          {orderInfo.status && <span className="notification-status-chip">{orderInfo.status}</span>}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                      <span className="notification-time">
                        {notification.createdAt ? formatRelativeTime(notification.createdAt) : <FaClock />}
                      </span>
                      {isUnread && <span className="notification-dot" aria-label="Unread notification" />}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
