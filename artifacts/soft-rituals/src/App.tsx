import { useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  tag: string;
  img: string;
  description: string;
  includes: string[];
  available: boolean;
};

const products: Product[] = [
  {
    id: 'p1',
    name: 'Sunday Reset Digital Planner',
    price: 14,
    originalPrice: 20,
    tag: 'Available now',
    img: 'pimg-9',
    description: 'A calm, complete digital planner for 2027 — your year, months, weeks and days in one softly organised system. Designed for GoodNotes, Notability or any PDF annotation app.',
    includes: ['Year, month, week & day spreads', 'Goals, vision & money-tracking pages', 'Self-care, mood & habit trackers', 'Hyperlinked navigation between sections', 'Instant digital delivery'],
    available: true,
  },
  {
    id: 'p2',
    name: 'Daily Notes Notion Template',
    price: 12,
    tag: 'Digital',
    img: 'pimg-2',
    description: 'A clean Notion workspace for everyday notes, with just enough structure to keep ideas moving.',
    includes: ['Daily notes space', 'Simple weekly view', 'Gentle capture prompts'],
    available: false,
  },
  {
    id: 'p3',
    name: 'Soft Focus Weekly Pad',
    price: 18,
    tag: 'Physical',
    img: 'pimg-3',
    description: 'A printed weekly pad made for slow mornings — tear-off sheets in soft, uncoated paper that is kind to pen and pencil.',
    includes: ['52 undated weekly sheets', 'Uncoated, easy-to-write paper', 'Small-batch printed'],
    available: false,
  },
  {
    id: 'p4',
    name: 'Little Rituals Journal',
    price: 24,
    tag: 'Physical',
    img: 'pimg-4',
    description: 'A gently guided journal for the pauses in between — no pressure to fill every page.',
    includes: ['Guided reflection prompts', 'Lay-flat binding', 'Soft-touch cover'],
    available: false,
  },
  {
    id: 'p5',
    name: 'Sunday Reset Bundle',
    price: 42,
    originalPrice: 48,
    tag: 'Bundle',
    img: 'pimg-5',
    description: 'The complete Sunday Reset ritual, paired with paper goods that will be available soon.',
    includes: ['Sunday Reset Digital Planner', 'Soft Focus Weekly Pad', 'Monthly Reflection Cards'],
    available: false,
  },
  {
    id: 'p6',
    name: 'Study Session Kit',
    price: 16,
    tag: 'Digital',
    img: 'pimg-6',
    description: 'Templates and tools for long study sessions — built to make focus feel lighter, not heavier.',
    includes: ['Focus session pages', 'Break planning prompts', 'Review templates'],
    available: false,
  },
  {
    id: 'p7',
    name: 'Monthly Reflection Cards',
    price: 16,
    tag: 'Physical',
    img: 'pimg-7',
    description: 'A small deck of prompt cards for closing out the month with intention.',
    includes: ['30 reflection prompts', 'Small-batch printed cards', 'Keepsake storage sleeve'],
    available: false,
  },
  {
    id: 'p8',
    name: 'Everyday Sticker Sheet',
    price: 8,
    tag: 'Physical',
    img: 'pimg-8',
    description: 'Simple, useful stickers for marking the small things in your planner or journal.',
    includes: ['Three soft-colour sheets', 'Matte finish', 'Planner-friendly adhesive'],
    available: false,
  },
];

const iconArrow = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function Icon({ name }: { name: 'moon' | 'sun' | 'menu' | 'bag' | 'close' | 'minus' | 'plus' }) {
  if (name === 'moon') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" /></svg>;
  if (name === 'sun') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
  if (name === 'menu') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  if (name === 'bag') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16l-1.4 10.2a2 2 0 0 1-2 1.8H7.4a2 2 0 0 1-2-1.8L4 7z" /><path d="M8 7V6a4 4 0 0 1 8 0v1" /></svg>;
  if (name === 'close') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>;
  if (name === 'minus') return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
}

function Device({ showcase = false, hero = false }: { showcase?: boolean; hero?: boolean }) {
  return (
    <div className={`device-mock ${showcase ? 'showcase-device' : ''} ${hero ? 'hero-device' : ''}`} aria-label="Preview of the Sunday Reset planner">
      <div className="device-cam" />
      <div className="device-screen"><PlannerCoverImage className="device-cover-image" /></div>
      {hero && <div className="card-label">Digital Planner</div>}
    </div>
  );
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

const plannerCoverSrc = `${import.meta.env.BASE_URL}reset-planner-cover.png`;

function PlannerCoverImage({ className = '', alt = '' }: { className?: string; alt?: string }) {
  return <img className={className} src={plannerCoverSrc} alt={alt} />;
}

function PlannerProductMockup() {
  return (
    <div className="planner-product-mockup">
      <PlannerCoverImage className="planner-product-image" />
    </div>
  );
}

function ProductSoonArtwork({ id }: { id: string }) {
  if (id === 'p2') return <svg className="product-artwork" viewBox="0 0 120 150" aria-hidden="true"><path d="M22 28c18-7 29-5 38 2 9-7 20-9 38-2v91c-16-7-28-6-38 2-10-8-22-9-38-2z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" /><path d="M60 30v91M34 53h18M34 64h18M34 75h14M68 53h18M68 64h18M68 75h14" stroke="var(--sky)" strokeWidth="3" strokeLinecap="round" /><path d="m88 23 15 15-6 6-15-15z" fill="var(--butter)" stroke="var(--ink)" strokeWidth="2" /></svg>;
  if (id === 'p3') return <svg className="product-artwork" viewBox="0 0 120 150" aria-hidden="true"><rect x="24" y="30" width="70" height="84" rx="5" fill="var(--cream)" stroke="var(--ink)" strokeWidth="2" transform="rotate(5 59 72)" /><rect x="18" y="24" width="70" height="84" rx="5" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" /><path d="M28 48h50M28 63h50M28 78h50M28 93h30" stroke="var(--rose-deep)" strokeWidth="2" strokeLinecap="round" /><path d="M34 34v-8M48 34v-8M62 34v-8M76 34v-8" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" /></svg>;
  if (id === 'p4') return <svg className="product-artwork" viewBox="0 0 120 150" aria-hidden="true"><rect x="27" y="20" width="66" height="104" rx="8" fill="var(--rose-deep)" stroke="var(--ink)" strokeWidth="2" transform="rotate(5 60 72)" /><path d="M60 25v98" stroke="var(--ink)" strokeWidth="1.5" opacity=".45" /><path d="M43 56c12-12 24-12 35 0-12 8-24 8-35 0zM47 72h26M47 82h20" fill="none" stroke="var(--paper)" strokeWidth="2" strokeLinecap="round" /><path d="M82 112c7 8 7 14 2 19" fill="none" stroke="var(--cocoa)" strokeWidth="2" /></svg>;
  if (id === 'p5') return <svg className="product-artwork" viewBox="0 0 120 150" aria-hidden="true"><rect x="23" y="52" width="74" height="60" rx="7" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" transform="rotate(-6 60 82)" /><rect x="31" y="34" width="62" height="68" rx="6" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" transform="rotate(7 62 68)" /><rect x="28" y="29" width="58" height="68" rx="6" fill="var(--butter)" stroke="var(--ink)" strokeWidth="2" /><path d="M40 50h34M40 62h25M40 74h30" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" /></svg>;
  if (id === 'p6') return <svg className="product-artwork" viewBox="0 0 120 150" aria-hidden="true"><path d="M19 38c15-6 28-5 41 3 13-8 26-9 41-3v76c-14-6-27-5-41 3-14-8-27-9-41-3z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" /><path d="M60 42v75M31 59h20M31 70h20M69 59h20M69 70h18" stroke="var(--lilac)" strokeWidth="3" strokeLinecap="round" /><path d="m86 24 14 8-31 66-14-8z" fill="var(--butter)" stroke="var(--ink)" strokeWidth="2" /></svg>;
  if (id === 'p7') return <svg className="product-artwork" viewBox="0 0 120 150" aria-hidden="true"><rect x="24" y="36" width="66" height="80" rx="7" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" transform="rotate(-8 57 76)" /><rect x="34" y="28" width="66" height="80" rx="7" fill="var(--cream)" stroke="var(--ink)" strokeWidth="2" transform="rotate(7 67 68)" /><circle cx="66" cy="58" r="16" fill="var(--lilac)" stroke="var(--ink)" strokeWidth="1.5" /><path d="M66 42a16 16 0 0 0 0 32 11 11 0 0 1 0-32z" fill="var(--paper)" /><path d="M49 87h34M54 97h22" stroke="var(--taupe)" strokeWidth="2" strokeLinecap="round" /></svg>;
  return <svg className="product-artwork" viewBox="0 0 120 150" aria-hidden="true"><rect x="24" y="30" width="72" height="88" rx="8" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" /><circle cx="43" cy="52" r="10" fill="var(--rose)" stroke="var(--ink)" strokeWidth="1.5" /><path d="M39 52h8M43 48v8" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" /><path d="M67 44c8-8 18 2 10 10-8 8-18-2-10-10zM68 78c12-5 17 9 6 13-11 4-17-9-6-13z" fill="var(--butter)" stroke="var(--ink)" strokeWidth="1.5" /><path d="M38 91c7-9 18 1 10 9-8 8-18-1-10-9z" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1.5" /></svg>;
}

function ProductArtwork({ product }: { product: Product }) {
  return (
    <div className={`product-img ${product.img} has-artwork`}>
      {product.available ? <PlannerProductMockup /> : <ProductSoonArtwork id={product.id} />}
    </div>
  );
}

function RitualIllustration({ name }: { name: string }) {
  if (name === 'Sunday Reset') return <svg className="ritual-artwork" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="88" rx="34" ry="7" fill="var(--rose-deep)" opacity=".45" /><path d="M34 58h44l-4 26a10 10 0 0 1-10 9H48a10 10 0 0 1-10-9z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" /><path d="M78 62c10-2 16 4 14 12s-10 10-16 8M44 40c2-6 0-10-4-14M56 38c2-8-1-12-4-16M68 40c1-6-1-10-4-14" stroke="var(--cocoa)" strokeWidth="2" fill="none" strokeLinecap="round" /><ellipse cx="56" cy="58" rx="22" ry="4" fill="var(--rose-deep)" opacity=".6" /></svg>;
  if (name === 'Study Rituals') return <svg className="ritual-artwork" viewBox="0 0 120 120" aria-hidden="true"><path d="M20 34c14-6 28-6 40 2 12-8 26-8 40-2v58c-14-6-28-6-40 2-12-8-26-8-40-2z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" /><path d="M60 36v58M28 46h22M28 56h22M28 66h16M70 46h22M70 56h22M70 66h16" stroke="var(--sky)" strokeWidth="3" strokeLinecap="round" /><path d="m78 20 18 18-6 6-18-18z" fill="var(--butter)" stroke="var(--ink)" strokeWidth="2" /></svg>;
  if (name === 'Self-Care') return <svg className="ritual-artwork" viewBox="0 0 120 120" aria-hidden="true"><path d="M50 100c0-30 4-46 10-58M60 100c2-28 8-44 16-54M70 100c4-26 12-40 20-48" stroke="var(--cocoa)" strokeWidth="2" fill="none" strokeLinecap="round" /><circle cx="60" cy="38" r="10" fill="var(--rose-deep)" stroke="var(--ink)" strokeWidth="1.5" /><circle cx="80" cy="46" r="8" fill="var(--rose-deep)" stroke="var(--ink)" strokeWidth="1.5" /><circle cx="45" cy="46" r="8" fill="var(--rose)" stroke="var(--ink)" strokeWidth="1.5" /><circle cx="60" cy="38" r="3" fill="var(--butter)" /><circle cx="80" cy="46" r="2.4" fill="var(--butter)" /><circle cx="45" cy="46" r="2.4" fill="var(--butter)" /></svg>;
  if (name === 'Everyday Organisation') return <svg className="ritual-artwork" viewBox="0 0 120 120" aria-hidden="true"><path d="M42 78h36l-5 24a4 4 0 0 1-4 3H51a4 4 0 0 1-4-3z" fill="var(--cocoa)" /><path d="M60 78V40M60 55c-14-4-18-16-14-26 12 2 18 12 14 26zM60 66c14-2 20-12 18-22-13 0-20 8-18 22z" stroke="var(--ink)" strokeWidth="2" fill="var(--sky)" /><path d="M46 53c5-9 10-13 14-13" stroke="var(--ink)" strokeWidth="2" fill="none" /><ellipse cx="60" cy="78" rx="20" ry="5" fill="var(--line-soft)" /></svg>;
  return <svg className="ritual-artwork" viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="90" rx="30" ry="8" fill="var(--butter)" stroke="var(--ink)" strokeWidth="2" /><ellipse cx="60" cy="78" rx="26" ry="7" fill="var(--butter)" stroke="var(--ink)" strokeWidth="2" /><ellipse cx="60" cy="66" rx="22" ry="6" fill="var(--butter)" stroke="var(--ink)" strokeWidth="2" /><path d="M60 66c-2-10 0-18 4-24M64 42c8-2 12 4 8 10-6 2-10-4-8-10z" stroke="var(--cocoa)" strokeWidth="2" strokeLinecap="round" fill="var(--rose-deep)" /></svg>;
}

function ProductCard({ product, onOpen, onAdd }: { product: Product; onOpen: (product: Product) => void; onAdd: (id: string) => void }) {
  return (
    <article className={`product-card ${product.available ? '' : 'soon'}`} data-testid={`card-product-${product.id}`}>
      <div
        className={`product-media ${product.available ? 'available' : ''}`}
        role={product.available ? 'button' : undefined}
        tabIndex={product.available ? 0 : undefined}
        onClick={() => product.available && onOpen(product)}
        onKeyDown={(event) => { if (product.available && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onOpen(product); } }}
        aria-label={product.available ? `View ${product.name}` : `${product.name}, coming soon`}
        data-testid={`media-product-${product.id}`}
      >
        <span className={`product-tag ${product.available ? '' : 'soon-tag'}`}>{product.available ? 'Available now' : 'Coming soon'}</span>
        <ProductArtwork product={product} />
        {product.available && <button className="product-add" type="button" onClick={(event) => { event.stopPropagation(); onAdd(product.id); }} data-testid={`button-add-${product.id}`}>Add to cart — {product.price} €</button>}
      </div>
      <div className="product-info">
        <span className="product-name">{product.name}</span>
        <span className="product-price">{product.originalPrice && <span className="price-was">{product.originalPrice} €</span>}{product.price} €</span>
      </div>
      {!product.available && <div className="availability-note">Not available to purchase yet</div>}
      {product.available && <div className="availability-note">Instant digital delivery</div>}
    </article>
  );
}

function AppContent() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return (localStorage.getItem('soft-rituals-theme') as 'light' | 'dark') || 'light'; } catch { return 'light'; }
  });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem('soft-rituals-cart') || '{}') as Record<string, number>; } catch { return {}; }
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newsletterMessage, setNewsletterMessage] = useState('One or two emails a month. Unsubscribe any time.');
  const [toast, setToast] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('soft-rituals-theme', theme); } catch { /* storage can be unavailable */ }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { window.removeEventListener('scroll', handleScroll); revealObserver.disconnect(); };
  }, []);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(targetId);
      if (target) window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - 80), behavior: 'auto' });
    }, 60);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    try { localStorage.setItem('soft-rituals-cart', JSON.stringify(cart)); } catch { /* storage can be unavailable */ }
  }, [cart]);

  useEffect(() => {
    document.body.classList.toggle('modal-open', cartOpen || Boolean(selectedProduct));
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setCartOpen(false); setSelectedProduct(null); setMenuOpen(false); }
    };
    window.addEventListener('keydown', handleKey);
    return () => { document.body.classList.remove('modal-open'); window.removeEventListener('keydown', handleKey); };
  }, [cartOpen, selectedProduct]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const cartItems = useMemo(() => products.filter((product) => cart[product.id]), [cart]);
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const subtotal = cartItems.reduce((total, product) => total + product.price * (cart[product.id] || 0), 0);
  const closeMenus = () => setMenuOpen(false);
  const addToCart = (id: string) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    setCartOpen(true);
    setToast('Sunday Reset Planner added to your cart.');
  };
  const updateQuantity = (id: string, delta: number) => {
    setCart((current) => {
      const next = (current[id] || 0) + delta;
      if (next <= 0) { const copy = { ...current }; delete copy[id]; return copy; }
      return { ...current, [id]: next };
    });
  };
  const subscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterMessage('You are on the list. We will keep it gentle.');
    event.currentTarget.reset();
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="announce">The Sunday Reset Digital Planner is available now · Everything else is coming soon</div>
      <header className={scrolled ? 'scrolled' : ''} id="site-header">
        <div className="wrap nav-inner">
          <a className="logo" href="#top" onClick={closeMenus} data-testid="link-logo">Soft Rituals</a>
          <nav aria-label="Main navigation" className={menuOpen ? 'nav-open' : ''}>
            <ul className="nav-links">
              <li><a href="#shop" onClick={closeMenus} data-testid="link-shop">Shop</a></li>
              <li><a href="#rituals" onClick={closeMenus} data-testid="link-rituals">Rituals</a></li>
              <li><a href="#about" onClick={closeMenus} data-testid="link-about">About</a></li>
            </ul>
          </nav>
          <div className="nav-actions">
            <button className="icon-btn" type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} data-testid="button-theme">{theme === 'light' ? <Icon name="moon" /> : <Icon name="sun" />}</button>
            <button className="icon-btn" type="button" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cartCount} items`} data-testid="button-cart"><Icon name="bag" />{cartCount > 0 && <span className="cart-count">{cartCount}</span>}</button>
            <button className="icon-btn menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-menu"><Icon name={menuOpen ? 'close' : 'menu'} /></button>
          </div>
        </div>
        {menuOpen && <div className="mobile-nav wrap"><a href="#shop" onClick={closeMenus} data-testid="mobile-link-shop">Shop</a><a href="#rituals" onClick={closeMenus} data-testid="mobile-link-rituals">Rituals</a><a href="#about" onClick={closeMenus} data-testid="mobile-link-about">About</a></div>}
      </header>

      <main id="main-content">
        <section className="hero" id="top">
          <div className="wrap hero-grid">
            <div>
              <div className="hero-eyebrow"><span className="dot" /> Digital &amp; physical, made to work together</div>
              <h1>Made with love.</h1>
              <p className="hero-sub">Planners, journals and paper goods designed to turn ordinary planning into something you actually enjoy — one soft ritual at a time.</p>
              <div className="hero-cta"><a href="#shop" className="btn btn-primary" data-testid="link-shop-collection">Shop the collection {iconArrow}</a><a href="#rituals" className="btn btn-outline" data-testid="link-explore-rituals">Explore rituals</a></div>
            </div>
            <div className="hero-visual">
              <div className="bokeh bokeh-1" /><div className="bokeh bokeh-2" /><div className="bokeh bokeh-3" />
              <div className="float-card card-c" />
              <div className="float-card card-b"><div className="mock-dot-grid">{Array.from({ length: 16 }, (_, index) => <span key={index} />)}</div><div className="card-label">Everyday Sticker Sheet</div></div>
              <Device hero />
              <div className="hero-sprig" aria-hidden="true"><svg viewBox="0 0 120 120" width="76" height="76"><path d="M50 100c0-30 4-46 10-58M60 100c2-28 8-44 16-54" stroke="var(--cocoa)" strokeWidth="2" fill="none" strokeLinecap="round" /><circle cx="60" cy="38" r="9" fill="var(--rose-deep)" stroke="var(--ink)" strokeWidth="1.4" /><circle cx="76" cy="48" r="7" fill="var(--rose)" stroke="var(--ink)" strokeWidth="1.4" /><circle cx="60" cy="38" r="2.6" fill="var(--butter)" /><circle cx="76" cy="48" r="2.2" fill="var(--butter)" /></svg></div>
            </div>
          </div>
        </section>

        <section className="offer-section" aria-label="What we offer">
          <div className="wrap">
            <div className="offer-grid">
              <a href="#shop" className="offer-card" data-testid="link-digital-planners"><div className="offer-icon"><svg viewBox="0 0 120 120" width="40"><rect x="24" y="20" width="72" height="56" rx="6" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2" /><rect x="34" y="30" width="52" height="4" rx="2" fill="var(--paper)" /><rect x="34" y="40" width="36" height="4" rx="2" fill="var(--paper)" /><path d="M48 84h24M60 76v8" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" /></svg></div><h3>Digital Planners</h3><p>Sunday Reset is ready to download and use tonight — the rest of the digital collection is coming soon.</p><span className="offer-link">Shop Sunday Reset →</span></a>
              <div className="offer-card offer-card-soon"><span className="coming-soon-badge">Coming soon</span><div className="offer-icon"><svg viewBox="0 0 120 120" width="40"><path d="M30 26c14-6 28-6 40 2 12-8 26-8 40-2v58c-14-6-28-6-40 2-12-8-26-8-40-2z" fill="var(--rose)" stroke="var(--ink)" strokeWidth="2" transform="translate(-5,4) scale(.9)" /></svg></div><h3>Physical Planners</h3><p>Soon, you will be able to take your planning from screen to paper.</p></div>
              <div className="offer-card offer-card-soon"><span className="coming-soon-badge">Coming soon</span><div className="offer-icon"><svg viewBox="0 0 120 120" width="40"><rect x="26" y="42" width="68" height="46" rx="6" fill="var(--butter)" stroke="var(--ink)" strokeWidth="2" /><path d="M26 56h68M60 42v46M46 42c-6-10 2-18 14-14 12-4 20 4 14 14" fill="none" stroke="var(--ink)" strokeWidth="2" /></svg></div><h3>Bundles</h3><p>Digital + physical, paired on purpose — available once the paper goods arrive.</p><span className="offer-link">Coming soon</span></div>
            </div>
            <div className="why-strip"><div className="why-item"><span className="why-check">✓</span> Instant digital delivery, same evening</div><div className="why-item"><span className="why-check">✓</span> Digital &amp; physical designed to work together</div><div className="why-item"><span className="why-check">✓</span> Calm, considered design — never cluttered</div><div className="why-item"><span className="why-check">✓</span> Small-batch paper goods, made with care</div></div>
          </div>
        </section>

        <section className="section-pad brand-intro"><div className="wrap"><Reveal><h2>Make space for the things that matter — <em>one page, one pause at a time.</em></h2></Reveal><Reveal><p>We design small tools, not big promises. No productivity system to master, no perfect routine to fail at — just quiet, considered pieces that make the everyday feel a little more intentional.</p></Reveal></div></section>

        <section className="section-pad"><div className="wrap paired-wrap"><Reveal className="showcase-visual"><div className="bokeh bokeh-1" /><div className="bokeh bokeh-2" /><Device showcase /><div className="showcase-badge" aria-hidden="true"><svg viewBox="0 0 120 120" width="46"><path d="M34 58h44l-4 26a10 10 0 0 1-10 9H48a10 10 0 0 1-10-9z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" /><path d="M78 62c10-2 16 4 14 12s-10 10-16 8" fill="none" stroke="var(--ink)" strokeWidth="2" /></svg></div></Reveal><div className="pair-copy"><span className="eyebrow">Meet the planner</span><h2>One page, opened slowly — with room to breathe.</h2><p>The Sunday Reset Digital Planner is designed the way we would want to use it ourselves: legible, uncluttered, and pleasant to open every morning on your iPad, tablet or laptop.</p><div className="benefits-list"><div className="benefit-row"><span className="benefit-check">✓</span> Hyperlinked tabs for instant navigation between months, weeks and days</div><div className="benefit-row"><span className="benefit-check">✓</span> Designed for GoodNotes, Notability and standard PDF annotation apps</div><div className="benefit-row"><span className="benefit-check">✓</span> A calm, legible layout with space to think</div><div className="benefit-row"><span className="benefit-check">✓</span> Instant download, ready to use the same evening</div></div><a href="#shop" className="btn btn-primary" data-testid="link-see-planners">See Sunday Reset {iconArrow}</a></div></div></section>

        <section className="expand-section" aria-labelledby="desk-edit-title">
          <div className="expand-pin">
            <div className="expand-heading">
              <div>
                <span className="eyebrow">The desk edit</span>
                <h2 id="desk-edit-title">A softer start to the week.</h2>
              </div>
              <p>Three small resets for the space around you.</p>
            </div>
            <div className="expand-frame" tabIndex={0} aria-label="Illustrated desk edit with a planner, notebook, plant, and cup">
              <div className="texture" />
              <div className="desk-shapes">
                <div className="obj obj-1" /><div className="obj obj-2" /><div className="obj obj-3" /><div className="obj obj-4" />
                <div className="device-mock desk-ipad">
                  <div className="device-cam" />
                  <div className="device-screen"><PlannerCoverImage className="device-cover-image" /></div>
                </div>
                <svg className="desk-illustration desk-notebook" viewBox="0 0 120 120" width="64" aria-hidden="true"><rect x="20" y="24" width="70" height="86" rx="6" fill="var(--cream)" stroke="var(--ink)" strokeWidth="2" transform="rotate(-6 55 67)" /><path d="m34 46 42-8M36 58l42-8M38 70l30-6" stroke="var(--taupe)" strokeWidth="2" strokeLinecap="round" transform="rotate(-6 55 67)" /><path d="m78 30 20-14M96 14l5 5" stroke="var(--rose-deep)" strokeWidth="3" strokeLinecap="round" /></svg>
                <svg className="desk-illustration desk-plant" viewBox="0 0 120 120" width="70" aria-hidden="true"><path d="M42 78h36l-5 24a4 4 0 0 1-4 3H51a4 4 0 0 1-4-3z" fill="var(--cocoa)" /><path d="M60 78V40" stroke="var(--ink)" strokeWidth="2" /><path d="M60 55c-14-4-18-16-14-26 12 2 18 12 14 26z" fill="var(--lilac)" stroke="var(--ink)" strokeWidth="1.5" /><path d="M60 66c14-2 20-12 18-22-13 0-20 8-18 22z" fill="var(--sky)" stroke="var(--ink)" strokeWidth="1.5" /></svg>
                <svg className="desk-illustration desk-cup" viewBox="0 0 120 120" width="60" aria-hidden="true"><path d="M34 58h44l-4 26a10 10 0 0 1-10 9H48a10 10 0 0 1-10-9z" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" /><path d="M78 62c10-2 16 4 14 12s-10 10-16 8M44 40c2-6 0-10-4-14M56 38c2-8-1-12-4-16" stroke="var(--cocoa)" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>
                <div className="desk-textile" />
              </div>
              <div className="desk-note desk-note-left"><strong>01</strong><span>Clear one corner</span><small>Make room for what matters.</small></div>
              <div className="desk-note desk-note-right"><strong>02</strong><span>Open Sunday Reset</span><small>Ten quiet minutes is enough.</small></div>
              <div className="expand-caption"><span>Everything has its place, softly.</span></div>
            </div>
            <div className="expand-foot">
              <p>Keep the ritual small. Let the room do less.</p>
              <a href="#shop" className="text-link" data-testid="link-desk-sunday-reset">Explore Sunday Reset {iconArrow}</a>
            </div>
          </div>
        </section>

        <section className="section-pad" id="rituals"><div className="wrap"><div className="section-head"><div><span className="eyebrow">Collections</span><h2>Shop by ritual</h2></div><p>Every collection is built around a moment in your week — not a category on a shelf.</p></div><div className="rituals-list">{[
          ['Ritual 01', 'Sunday Reset', 'A gentle way to close one week and open the next — planners and pads for slowing down before Monday arrives.', 'linear-gradient(150deg,var(--rose),var(--cream))'],
          ['Ritual 02', 'Study Rituals', 'Templates and kits built for long sessions and short attention spans — designed to make focus feel lighter.', 'linear-gradient(150deg,var(--sky),var(--paper))'],
          ['Ritual 03', 'Self-Care', 'Journals and reflection cards for the pauses in between — no pressure to fill every page.', 'linear-gradient(150deg,var(--lilac),var(--cream))'],
          ['Ritual 04', 'Everyday Organisation', 'The quiet backbone of your week — notes, lists and small systems that stay out of the way.', 'linear-gradient(150deg,var(--butter),var(--cream))'],
          ['Ritual 05', 'Money & Planning', 'A calmer way to look at your budget — trackers designed to inform, never to guilt.', 'linear-gradient(150deg,var(--paper),var(--rose))'],
        ].map(([number, name, description, background], index) => <Reveal className="ritual-row" key={name}><div><span className="ritual-number">{number}</span><h3 className="ritual-name">{name}</h3><p className="ritual-desc">{description}</p><a href="#shop" className="ritual-link" data-testid={`link-ritual-${index}`}>Shop the ritual {iconArrow}</a></div><div className="ritual-visual" style={{ background }}><div className="ritual-motif"><RitualIllustration name={name} /></div></div></Reveal>)}</div></div></section>

        <section className="section-pad" id="shop"><div className="wrap"><div className="section-head"><div><span className="eyebrow">Featured</span><h2>New &amp; loved</h2></div><p>One small ritual is ready to begin today. The rest are taking their time.</p></div><div className="products-grid">{products.map((product) => <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} onAdd={addToCart} />)}</div></div></section>

        <section className="section-pad" id="digital"><div className="wrap paired-wrap"><div className="pair-visual"><div className="pair-box d"><div style={{ padding: 24 }}><div className="mock-tag">Digital</div></div></div><div className="pair-connector" /><div className="pair-box p"><div style={{ padding: 20 }}><div className="mock-tag" style={{ color: 'var(--paper)' }}>Physical</div></div></div></div><div className="pair-copy"><span className="eyebrow">Why both</span><h2>Made to work beautifully together.</h2><p>Some rituals need a screen, others need paper in your hands. We design our digital and physical products side by side, so they complete each other rather than compete.</p><div className="pair-examples"><div className="pair-example"><span className="plus">＋</span> Sunday Reset Digital Planner paired with the Soft Focus Weekly Pad</div><div className="pair-example"><span className="plus">＋</span> Little Rituals Journal paired with Monthly Reflection Cards</div><div className="pair-example"><span className="plus">＋</span> Daily Notes Notion Template paired with the Study Session Kit</div></div></div></div></section>

        <section className="section-pad" id="bundle"><div className="wrap"><div className="bundle-panel"><div className="bundle-visual"><div className="bundle-item bi-4" /><div className="bundle-item bi-3" /><div className="bundle-item bi-2" /><div className="bundle-item bi-1"><div style={{ padding: 22 }}><div className="mock-tag">Sunday Reset</div></div></div></div><div className="bundle-copy"><span className="eyebrow">The edit</span><h2>Sunday Reset Bundle</h2><p>Everything you need to close the week gently — a digital planner, a printed weekly pad and a set of reflection cards, designed as one complete ritual.</p><div className="soon-panel"><strong>Coming soon</strong><span>Available when the physical pieces are ready.</span></div><ul className="bundle-includes"><li><span>Sunday Reset Digital Planner</span><span>14 €</span></li><li><span>Soft Focus Weekly Pad</span><span>18 €</span></li><li><span>Monthly Reflection Cards</span><span>16 €</span></li></ul><div className="bundle-price"><span className="now">42 €</span><span className="was">48 €</span></div><button className="btn btn-outline btn-disabled" type="button" disabled aria-label="Sunday Reset Bundle coming soon" data-testid="button-bundle-disabled">Coming soon</button></div></div></div></section>

        <section className="section-pad editorial-moment"><div className="editorial-glow" /><div className="wrap"><span className="eyebrow">A note from the studio</span><h2>We do not believe in a perfectly organised life. We believe in <em>small, honest rituals</em> — the ten minutes on Sunday, the page before bed.</h2></div></section>
        <section className="section-pad" id="about"><div className="wrap"><div className="section-head"><div><span className="eyebrow">About</span><h2>What people are saying</h2></div></div><p className="testimonial-note">Illustrative quotes — Soft Rituals is a concept store and does not yet have real customer reviews.</p><div className="testimonials-grid"><Reveal className="testimonial-card"><p>“The Sunday Reset planner is the first system I have actually kept using — because it does not ask much of me.”</p><div className="testimonial-who">— Illustrative note</div></Reveal><Reveal className="testimonial-card"><p>“It feels less like stationery and more like a small, calm object I look forward to opening.”</p><div className="testimonial-who">— Illustrative note</div></Reveal><Reveal className="testimonial-card"><p>“The paper pad and the digital planner genuinely work together.”</p><div className="testimonial-who">— Illustrative note</div></Reveal></div></div></section>
        <section className="section-pad"><div className="wrap"><div className="newsletter"><span className="eyebrow">Stay close</span><h2>Notes, rituals &amp; little things.</h2><p>Join our little corner for new collections, thoughtful tools and occasional inspiration — nothing more than we would want to receive ourselves.</p><form className="newsletter-form" onSubmit={subscribe}><input type="email" required placeholder="you@example.com" aria-label="Email address" data-testid="input-newsletter-email" /><button type="submit" className="btn btn-primary" data-testid="button-newsletter-submit">Subscribe</button></form><div className="newsletter-note" aria-live="polite">{newsletterMessage}</div></div></div></section>
      </main>

      <footer><div className="wrap"><div className="footer-grid"><div><div className="footer-logo">Soft Rituals</div><p className="footer-tag">Small tools for a softer, more organised life.</p></div><div className="footer-col"><h4>Shop</h4><ul><li><a href="#shop">Digital</a></li><li><span aria-disabled="true">Physical · coming soon</span></li><li><span aria-disabled="true">Bundles · coming soon</span></li><li><a href="#rituals">Collections</a></li></ul></div><div className="footer-col"><h4>Help</h4><ul><li><a href="mailto:hello@softrituals.example">Contact</a></li><li><a href="#shop">Shipping &amp; returns</a></li><li><a href="#about">FAQ</a></li></ul></div><div className="footer-col"><h4>Studio</h4><ul><li><a href="#about">About</a></li><li><a href="#digital">Why both</a></li><li><a href="#top">Back to top</a></li></ul></div></div><div className="footer-bottom"><span>© 2026 Soft Rituals. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>

      <div className={`cart-overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-label="Shopping cart" aria-hidden={!cartOpen}>
        <div className="cart-head"><h3>Your cart</h3><button className="icon-btn" type="button" onClick={() => setCartOpen(false)} aria-label="Close cart" data-testid="button-close-cart"><Icon name="close" /></button></div>
        <div className="cart-items">{cartItems.length === 0 ? <div className="cart-empty">Your cart is quietly empty.<br />Add something you will enjoy using.</div> : cartItems.map((product) => <div className="cart-item" key={product.id}><div className={`cart-item-thumb ${product.img} planner-thumb`}><PlannerCoverImage /></div><div className="cart-item-info"><div className="cart-item-name">{product.name}</div><div className="cart-item-meta">Digital · {product.price} €</div><div className="cart-item-row"><div className="qty-control"><button type="button" onClick={() => updateQuantity(product.id, -1)} aria-label={`Decrease ${product.name} quantity`} data-testid={`button-decrease-${product.id}`}><Icon name="minus" /></button><span>{cart[product.id]}</span><button type="button" onClick={() => updateQuantity(product.id, 1)} aria-label={`Increase ${product.name} quantity`} data-testid={`button-increase-${product.id}`}><Icon name="plus" /></button></div><button className="remove-link" type="button" onClick={() => updateQuantity(product.id, -cart[product.id])} data-testid={`button-remove-${product.id}`}>Remove</button></div></div></div>)}</div>
        <div className="cart-foot"><div className="cart-subtotal"><span>Subtotal</span><strong>{subtotal} €</strong></div><button className="btn btn-primary btn-disabled" type="button" disabled data-testid="button-checkout">Proceed to checkout</button><div className="cart-hint">Checkout is being prepared — your items are saved here for now.</div></div>
      </aside>

      <div className={`product-overlay ${selectedProduct ? 'open' : ''}`} onClick={() => setSelectedProduct(null)} />
      {selectedProduct && <div className="product-modal open" role="dialog" aria-modal="true" aria-labelledby="product-modal-title"><button className="product-modal-close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Close product details" data-testid="button-close-product"><Icon name="close" /></button><div className="product-modal-inner"><div className="product-modal-visual"><div className={`pm-main-img ${selectedProduct.img}`}><PlannerCoverImage alt={selectedProduct.name} /></div><div className="pm-thumbs"><div className={`pm-thumb ${selectedProduct.img} active`}><PlannerCoverImage /></div></div></div><div className="product-modal-info"><span className="product-tag" style={{ position: 'static' }}>Available now</span><h3 id="product-modal-title">{selectedProduct.name}</h3><div className="pm-price">{selectedProduct.price} € <span className="price-was">{selectedProduct.originalPrice} €</span></div><p className="pm-description">{selectedProduct.description}</p><div className="pm-includes">{selectedProduct.includes.map((item) => <div key={item}>{item}</div>)}</div><button className="btn btn-primary" type="button" onClick={() => { addToCart(selectedProduct.id); setSelectedProduct(null); }} data-testid="button-modal-add">Add to cart {iconArrow}</button><div className="cart-hint">Instant digital delivery. Ready to open this evening.</div></div></div></div>}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

const queryClient = new QueryClient();

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><ErrorBoundary><AppContent /></ErrorBoundary><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;