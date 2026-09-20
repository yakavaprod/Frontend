import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import api from '../api.js'
import './Support.css'

const FAQS = [
  {
    question: 'I can’t sign in to my account.',
    answer:
      'First, check that your email and password are correct. If Google sign-in is blocked, use the email/password form instead. If the issue continues, submit a support report below with your email and the exact error message.',
  },
  {
    question: 'My order is stuck or not confirmed.',
    answer:
      'Orders are reviewed by the admin team before access is unlocked. Please wait a few minutes and refresh the dashboard. If it remains pending, send us the order number and a screenshot through the form below.',
  },
  {
    question: 'I paid but I do not have access to the product yet.',
    answer:
      'This usually means the payment is still being reviewed. Confirm your transaction reference and share it in the support form. Once the admin verifies it, access is restored automatically.',
  },
  {
    question: 'I cannot see a course or product I purchased.',
    answer:
      'Check your dashboard and your My Shelf section. If the product is missing, submit a report with the product name, email address, and order details so we can trace it quickly.',
  },
  {
    question: 'The app is not loading correctly on my browser.',
    answer:
      'Try refreshing the page, clearing the browser cache, or opening in a private tab. If the problem continues, share the browser type, page URL, and the exact error in the support report.',
  },
  {
    question: 'I want to ask something not listed here.',
    answer:
      'Use the support form below to send your question directly to the admin team. Include as much detail as possible so we can respond quickly and fix the issue.',
  },
]

const CATEGORY_OPTIONS = [
  'login',
  'account',
  'payment',
  'product',
  'delivery',
  'technical',
  'other',
]

const initialForm = {
  name: '',
  email: '',
  category: 'technical',
  subject: '',
  message: '',
}

export default function Support() {
  const [openItem, setOpenItem] = useState(0)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: '', text: '' })
  const [lookupEmail, setLookupEmail] = useState('')
  const [myTickets, setMyTickets] = useState([])
  const [lookupLoading, setLookupLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const loadMyTickets = async () => {
    const email = lookupEmail.trim()
    if (!email) {
      setMyTickets([])
      return
    }

    setLookupLoading(true)
    try {
      const { data } = await api.get('/support/tickets', { params: { email } })
      setMyTickets(data)
    } catch (error) {
      setMyTickets([])
      setStatus({
        type: 'error',
        text: error.response?.data?.error || 'Unable to load your support history right now.',
      })
    } finally {
      setLookupLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setStatus({ type: '', text: '' })

    try {
      const { data } = await api.post('/support/tickets', {
        ...form,
        sourceUrl: window.location.href,
        userAgent: navigator.userAgent,
      })

      setStatus({
        type: 'success',
        text: data.message || 'Your support request was sent successfully. Our admin team will review it soon.',
      })
      setForm(initialForm)
    } catch (error) {
      setStatus({
        type: 'error',
        text: error.response?.data?.error || 'Unable to send your request right now. Please try again later.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="support-shell">
      <Navbar />

      <main className="support-page">
        <section className="support-hero">
          <div className="wrap support-hero__inner">
            <div>
              <p className="eyebrow">Support center</p>
              <h1>How can we help?</h1>
              <p>
                Find quick answers to common issues below. If your problem is not listed,
                send a detailed report and the admin team will review it.
              </p>
            </div>
          </div>
        </section>

        <div className="wrap support-grid">
          <section className="support-panel">
            <div className="support-panel__header">
              <h2>Frequently asked questions</h2>
            </div>

            <div className="faq-list">
              {FAQS.map((faq, index) => (
                <div key={faq.question} className={`faq-item ${openItem === index ? 'is-open' : ''}`}>
                  <button type="button" onClick={() => setOpenItem(openItem === index ? -1 : index)}>
                    <span>{faq.question}</span>
                    <span className="faq-toggle">{openItem === index ? '−' : '+'}</span>
                  </button>
                  {openItem === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="support-panel support-form-panel">
            <div className="support-panel__header">
              <h2>Report a problem</h2>
            </div>

            <form onSubmit={handleSubmit} className="support-form">
              <div className="support-form__row">
                <label>
                  Full name
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                </label>
              </div>

              <div className="support-form__row">
                <label>
                  Email address
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                </label>
              </div>

              <div className="support-form__row">
                <label>
                  Category
                  <select name="category" value={form.category} onChange={handleChange}>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="support-form__row">
                <label>
                  Subject
                  <input name="subject" value={form.subject} onChange={handleChange} placeholder="Brief summary of your issue" required />
                </label>
              </div>

              <div className="support-form__row">
                <label>
                  Problem details
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Describe what happened, what you expected, and any error message or screenshots you have."
                    rows="6"
                    required
                  />
                </label>
              </div>

              {status.text && (
                <p className={`support-form__status ${status.type === 'success' ? 'is-success' : 'is-error'}`}>
                  {status.text}
                </p>
              )}

              <div className="support-form__actions">
                <button type="submit" className="yk-btn yk-btn-primary" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send report'}
                </button>
                <Link to="/" className="support-form__link">Back to home</Link>
              </div>
            </form>

            <div className="support-history">
              <h3>My support requests</h3>
              <div className="support-history__lookup">
                <input
                  type="email"
                  value={lookupEmail}
                  onChange={(event) => setLookupEmail(event.target.value)}
                  placeholder="Enter your email to view replies"
                />
                <button type="button" onClick={loadMyTickets} disabled={lookupLoading}>
                  {lookupLoading ? 'Checking...' : 'Check'}
                </button>
              </div>

              {myTickets.length === 0 ? (
                <p className="support-history__empty">No support reports found for this email yet.</p>
              ) : (
                <div className="support-history__list">
                  {myTickets.map((ticket) => (
                    <div key={ticket._id} className="support-thread">
                      <div className="support-thread__header">
                        <div>
                          <strong>{ticket.subject}</strong>
                          <span>{ticket.status}</span>
                        </div>
                        <small>{new Date(ticket.createdAt).toLocaleString()}</small>
                      </div>

                      <p className="support-thread__message">{ticket.message}</p>

                      {ticket.replies && ticket.replies.length > 0 ? (
                        <div className="support-thread__replies">
                          {ticket.replies.map((reply, index) => (
                            <div key={`${reply.sender}-${index}`} className={`support-reply support-reply--${reply.sender}`}>
                              <div className="support-reply__meta">
                                <strong>{reply.sender === 'admin' ? 'Admin reply' : 'You'}</strong>
                                <span>{new Date(reply.createdAt || ticket.createdAt).toLocaleString()}</span>
                              </div>
                              <p>{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="support-thread__empty">No admin reply yet. We will reply here as soon as we review your report.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
