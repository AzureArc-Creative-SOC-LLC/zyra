import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Minus, Plus, ShoppingBag } from 'lucide-react'
import { products, getProductById } from './dealsProducts'
import { useCart } from '../context/cart-context'
import SiteFooter from '../components/SiteFooter'
import Seo from '../components/Seo'
import './ProductDetail.css'

const SITE = 'https://zyralabs.com'
// Bundled asset paths are root-relative (/assets/…); make them absolute for schema.
const absolute = (src) => (src && src.startsWith('/') ? `${SITE}${src}` : src)

function ProductDetail() {
  const { id } = useParams()
  const product = getProductById(id)
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  const gallery = useMemo(() => {
    if (!product) return []
    if (product.gallery && product.gallery.length > 0) return product.gallery
    return [product.image]
  }, [product])

  const related = useMemo(
    () => products.filter((p) => p.id !== id).slice(0, 3),
    [id],
  )

  if (!product) {
    return (
      <div className="pd-page">
        <Seo title="Product not found" path={`/product/${id}`} noindex />
        <div className="pd-page__inner pd-missing">
          <h1>Product not found</h1>
          <p>The product you’re looking for doesn’t exist or was removed.</p>
          <Link className="pd-btn pd-btn--solid" to="/services">
            <ArrowLeft size={16} /> Back to products
          </Link>
        </div>
        <SiteFooter />
      </div>
    )
  }

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.image,
      qty,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  const priceValue = String(product.price).replace(/[^0-9.]/g, '')
  const productUrl = `${SITE}/product/${product.id}`
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: gallery.map(absolute),
        sku: product.id,
        brand: { '@type': 'Brand', name: 'Zyra Labs' },
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: 'USD',
          price: priceValue,
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE}/services` },
          { '@type': 'ListItem', position: 3, name: product.title, item: productUrl },
        ],
      },
    ],
  }

  return (
    <div className="pd-page">
      <Seo
        title={product.title}
        path={`/product/${product.id}`}
        type="product"
        image={absolute(product.image)}
        description={`${product.subtitle} — ${product.description}`.slice(0, 160)}
        jsonLd={productJsonLd}
      />
      <div className="pd-page__inner">
        <nav className="pd-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/services">Products</Link>
          <span aria-hidden="true">/</span>
          <span className="pd-crumbs__current">{product.title}</span>
        </nav>

        <section className="pd-hero">
          <div className="pd-gallery">
            <div className="pd-gallery__main">
              <img
                key={activeImg}
                src={gallery[activeImg] || product.image}
                alt={product.title}
              />
            </div>
            {gallery.length > 1 && (
              <div className="pd-gallery__thumbs" role="tablist" aria-label="Product images">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    role="tab"
                    aria-selected={activeImg === i}
                    aria-label={`Show image ${i + 1}`}
                    className={`pd-gallery__thumb ${activeImg === i ? 'is-active' : ''}`}
                    onMouseEnter={() => setActiveImg(i)}
                    onFocus={() => setActiveImg(i)}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pd-hero__body">
            <span className="pd-eyebrow">{product.subtitle}</span>
            <h1 className="pd-title">{product.title}</h1>
            <div className="pd-price">{product.price}</div>
            <p className="pd-desc">{product.description}</p>

            <div className="pd-actions">
              <div className="pd-qty" aria-label="Quantity">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                type="button"
                className={`pd-btn pd-btn--solid pd-add ${added ? 'is-added' : ''}`}
                onClick={handleAdd}
              >
                {added ? (
                  <>
                    <Check size={16} /> Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to cart
                  </>
                )}
              </button>
            </div>

            <dl className="pd-specs">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="pd-specs__row">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="pd-related" aria-labelledby="pd-related-heading">
          <div className="pd-related__head">
            <span className="pd-eyebrow">also explore</span>
            <h2 id="pd-related-heading">Related products</h2>
          </div>
          <div className="pd-related__grid">
            {related.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="pd-related-card">
                <div className="pd-related-card__media">
                  <img src={p.image} alt={p.title} />
                </div>
                <div className="pd-related-card__info">
                  <span className="pd-related-card__subtitle">{p.subtitle}</span>
                  <h3 className="pd-related-card__title">{p.title}</h3>
                  <span className="pd-related-card__price">{p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  )
}

export default ProductDetail
