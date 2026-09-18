import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaFilter, FaShoppingCart } from 'react-icons/fa'
import SimpleHeader from '../components/SimpleHeader.jsx'
import Footer from '../components/Footer.jsx'
import api from '../api.js'
import './ProductListing.css'

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=500&h=300&fit=crop'

export default function ProductListing() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (selectedCategory !== 'all') params.category = selectedCategory
      if (searchTerm.trim()) params.search = searchTerm.trim()
      const { data } = await api.get('/products', { params })
      setProducts(data)
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to load products right now.')
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, searchTerm])

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 250)
    return () => clearTimeout(timeout)
  }, [fetchProducts])

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  const featuredProducts = products.filter((p) => p.featured).slice(0, 3)

  return (
    <>
      <SimpleHeader showBack={true} />
      <div className="product-listing">
      {/* Search and Filter */}
      <div className="listing-container">
        <div className="search-filter-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search courses and products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            <button
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              <FaFilter /> All Products
            </button>
            <button
              className={`filter-btn ${selectedCategory === 'courses' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('courses')}
            >
              Courses
            </button>
            <button
              className={`filter-btn ${selectedCategory === 'products' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('products')}
            >
              Digital Assets
            </button>
            <button
              className={`filter-btn ${selectedCategory === 'services' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('services')}
            >
              Services
            </button>
          </div>
        </div>

        {error && <p role="alert" className="form-error">{error}</p>}

        {loading ? (
          <div className="no-products">
            <p>Loading products…</p>
          </div>
        ) : (
          <>
            {/* Featured Banner */}
            {featuredProducts.length > 0 && (
              <section className="featured-section">
                <h2>Featured</h2>
                <div className="featured-grid">
                  {featuredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="featured-card"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <div className="featured-image">
                        <img src={product.image || PLACEHOLDER_IMAGE} alt={product.title} />
                        <div className="featured-badge">Featured</div>
                      </div>
                      <div className="featured-content">
                        <h3>{product.title}</h3>
                        <div className="featured-meta">
                          {product.instructor && <span className="instructor">{product.instructor}</span>}
                        </div>
                        <p className="featured-desc">{product.description.substring(0, 80)}...</p>
                        <div className="featured-footer">
                          <span className={product.discount ? 'price price--discounted' : 'price'}>
                            {product.discount
                              ? <><s>RWF {product.price.toFixed(2)}</s> RWF {(product.price * (1 - product.discount / 100)).toFixed(2)}</>
                              : `RWF ${product.price.toFixed(2)}`}
                          </span>
                          <button className="featured-btn">View Details →</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Products Grid */}
            <section className="products-section">
              <div className="section-title">
                <h2>
                  {selectedCategory === 'all'
                    ? 'All Products'
                    : selectedCategory === 'courses'
                    ? 'Courses'
                    : selectedCategory === 'services'
                    ? 'Services'
                    : 'Digital Assets'}
                </h2>
                <span className="product-count">{products.length} items</span>
              </div>

              {products.length === 0 ? (
                <div className="no-products">
                  <p>No products found matching your search.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="product-card"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <div className="product-image">
                        <img src={product.image || PLACEHOLDER_IMAGE} alt={product.title} />
                        <div className="product-overlay">
                          <button className="view-btn">
                            <FaShoppingCart /> View Details
                          </button>
                        </div>
                      </div>

                      <div className="product-info">
                        <div className="product-category">{product.category}</div>
                        <h3 className="product-title">{product.title}</h3>

                        {product.instructor && (
                          <div className="product-meta">
                            <span className="instructor">{product.instructor}</span>
                          </div>
                        )}

                        {product.duration && (
                          <div className="product-stats">
                            <span>{product.duration}</span>
                          </div>
                        )}

                        <div className="product-footer">
                          <span className={product.discount ? 'product-price product-price--discounted' : 'product-price'}>
                            {product.discount
                              ? <><s>RWF {product.price.toFixed(2)}</s> RWF {(product.price * (1 - product.discount / 100)).toFixed(2)}</>
                              : `RWF ${product.price.toFixed(2)}`}
                          </span>
                          <button className="add-cart-btn">Add to Cart</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
      </div>
      <Footer />
    </>
  )
}