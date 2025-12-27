import React, { useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import ProductCard from '../components/UI/ProductCard';
import { ShoppingCart, ShoppingBag, Tag, Star, ChevronRight, Search, Filter } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Bazaar = () => {
    const { showToast } = useAppContext();
    const [activeCategory, setActiveCategory] = useState("FUEL");

    const categories = ["FUEL", "ARMOR", "EQUIPMENT"];

    const handlePurchase = (item) => {
        showToast(`${item} added to locker`);
    };

    const items = [
        {
            title: "Pre-Forge X1",
            price: "₹3,999",
            levelRequired: 1,
            isLocked: false,
            tag: "BESTSELLER"
        },
        {
            title: "Iron Core Belt",
            price: "₹7,450",
            levelRequired: 10,
            isLocked: true
        },
        {
            title: "Molten Recovery",
            price: "₹2,499",
            levelRequired: 5,
            isLocked: true
        },
        {
            title: "Carbon Goggles",
            price: "₹10,999",
            levelRequired: 50,
            isLocked: true,
            tag: "ELITE"
        }
    ];

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="header-title-group">
                    <h1 className="title-display" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Bazaar</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        GEAR FOR THE ELITE. EARNED, NOT BOUGHT.
                    </p>
                </div>
                <div className="icon-box icon-box-muted" style={{ width: '45px', height: '45px' }}>
                    <ShoppingCart size={20} />
                </div>
            </header>

            {/* Categories */}
            <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '12px',
                marginBottom: '24px',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
            }}>
                {categories.map(cat => (
                    <div
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '10px 20px',
                            background: activeCategory === cat ? 'var(--accent-orange)' : 'var(--bg-card)',
                            color: activeCategory === cat ? '#000' : 'var(--text-secondary)',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            fontWeight: '800',
                            whiteSpace: 'nowrap',
                            border: '1px solid var(--border-glass)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontFamily: 'var(--font-display)',
                            letterSpacing: '1px'
                        }}
                    >
                        {cat}
                    </div>
                ))}
            </div>

            {/* Feature Banner */}
            <section style={{ marginBottom: '40px' }}>
                <Card noPadding className="glass-panel" style={{
                    background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '160px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '24px',
                    borderRadius: '20px',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                            <h3 className="title-display" style={{ fontSize: '1.25rem' }}>SUMMER FORGE DROP</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Limited Edition Carbon Apparel.</p>
                        </div>
                        <ChevronRight color="var(--text-primary)" />
                    </div>
                </Card>
            </section>

            <h3 className="section-label">AVAILABLE GEAR</h3>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
            }}>
                {items.map((item, idx) => (
                    <ProductCard
                        key={idx}
                        {...item}
                        onPurchase={() => handlePurchase(item.title)}
                    />
                ))}
            </div>

            <div style={{
                marginTop: '40px',
                padding: '24px',
                textAlign: 'center',
                border: '1px dashed var(--border-glass)',
                borderRadius: '20px'
            }}>
                <ShoppingBag size={32} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    More exclusive gear unlocks as you climb the <span style={{ color: 'var(--accent-orange)' }}>Arena</span>.
                </p>
            </div>
        </div>
    );
};

export default Bazaar;
