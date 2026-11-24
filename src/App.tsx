/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, CartItem, PageId, TrackedOrder } from './types';
import { PASTEL_COLORS } from './data/translations';
import { INITIAL_TRACKED_ORDERS } from './data/content';
import { Navbar } from './components/Navbar';
import { BrandWelcomeBanner } from './components/BrandWelcomeBanner';
import { HomePage } from './pages/HomePage';
import { Catalog } from './components/Catalog';
import { Customizer } from './components/Customizer';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import SheetTrackingPage from './app/tracking/page';
import { LegalBlogPage } from './pages/LegalBlogPage';
import { AboutUs } from './components/AboutUs';
import { Contact } from './components/Contact';
import { CheckoutPage } from './pages/CheckoutPage';
import { LegalPage, LegalTabId } from './pages/LegalPage';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ChatbotWidget } from './components/ChatbotWidget';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('ca');
  const [activePage, setActivePage] = useState<PageId>('inici');
  const [legalTab, setLegalTab] = useState<LegalTabId>('avis');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Order tracking state (preloaded with demo orders + newly created checkout orders)
  const [trackedOrders, setTrackedOrders] = useState<TrackedOrder[]>(INITIAL_TRACKED_ORDERS);
  const [activeTrackingCode, setActiveTrackingCode] = useState<string>('PTZ-1042');

  // Customizer initial state if selected from catalog
  const [customizerSelection, setCustomizerSelection] = useState<{
    petName: string;
    colorId: string;
    photoUrl: string;
  }>({
    petName: 'Buddy',
    colorId: 'blau-cel',
    photoUrl: '/src/assets/images/mug_buddy_golden_1794328863250.jpg',
  });

  // Shopping cart preloaded with one mug so visitors can test Checkout immediately
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      cartId: 'item-buddy-initial',
      productId: 'tassa-buddy',
      title: 'Tassa Buddy · Interior Blau Suau',
      price: 15.90,
      interiorColor: PASTEL_COLORS[0],
      petName: 'Buddy',
      photoUrl: '/src/assets/images/mug_buddy_golden_1794328863250.jpg',
      quantity: 1,
    },
  ]);

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegal = (tab: LegalTabId) => {
    setLegalTab(tab);
    handleNavigate('legal');
  };

  const handleAddToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) =>
          it.productId === newItem.productId &&
          it.interiorColor.id === newItem.interiorColor.id &&
          it.petName === newItem.petName
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + newItem.quantity,
        };
        return updated;
      }
      return [newItem, ...prev];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCartItems((prev) => prev.filter((it) => it.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSelectForCustomizer = (petName: string, colorId: string, photoUrl: string) => {
    setCustomizerSelection({ petName, colorId, photoUrl });
    handleNavigate('personalitzador');
  };

  const handleOrderCreated = (newOrder: TrackedOrder) => {
    setTrackedOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingCode(newOrder.code);
  };

  const handleApprovePreview = (code: string) => {
    setTrackedOrders((prev) =>
      prev.map((order) => {
        if (order.code === code) {
          return {
            ...order,
            previewApproved: true,
            stage: order.stage === 'preview_pending' || order.stage === 'received' ? 'production' : order.stage,
          };
        }
        return order;
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-[#1E324B] font-sans selection:bg-[#C3D1E2] selection:text-[#1E324B]">
      {/* Sticky Multi-Page Navbar with Prominent Official Logo */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activePage={activePage}
        onNavigate={handleNavigate}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Independent Multi-Page Viewport */}
      <main className="flex-1">
        {activePage === 'inici' && (
          <HomePage
            currentLang={currentLang}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onSelectForCustomizer={handleSelectForCustomizer}
          />
        )}

        {activePage === 'cataleg' && (
          <Catalog
            currentLang={currentLang}
            onAddToCart={handleAddToCart}
            onSelectForCustomizer={handleSelectForCustomizer}
          />
        )}

        {activePage === 'personalitzador' && (
          <Customizer
            currentLang={currentLang}
            onAddToCart={handleAddToCart}
            presetPetName={customizerSelection.petName}
            presetColorId={customizerSelection.colorId}
            presetPhotoUrl={customizerSelection.photoUrl}
          />
        )}

        {activePage === 'seguiment' && (
          <OrderTrackingPage
            currentLang={currentLang}
            orders={trackedOrders}
            initialOrderCode={activeTrackingCode}
            onApprovePreview={handleApprovePreview}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'sheet-tracking' && <SheetTrackingPage />}

        {activePage === 'blog' && <LegalBlogPage currentLang={currentLang} />}

        {activePage === 'qui-som' && <AboutUs currentLang={currentLang} />}

        {activePage === 'contacte' && <Contact currentLang={currentLang} />}

        {activePage === 'checkout' && (
          <CheckoutPage
            currentLang={currentLang}
            items={cartItems}
            onNavigate={handleNavigate}
            onOrderCreated={handleOrderCreated}
            onClearCart={handleClearCart}
          />
        )}

        {activePage === 'legal' && (
          <LegalPage
            currentLang={currentLang}
            initialTab={legalTab}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer with Academic Notice and Legal Page Navigation */}
      <Footer
        currentLang={currentLang}
        onNavigate={handleNavigate}
        onOpenLegal={handleOpenLegal}
      />

      {/* Official Localized Brand Banner placed at the very bottom */}
      <BrandWelcomeBanner currentLang={currentLang} onNavigate={handleNavigate} />

      {/* Slide-over Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        currentLang={currentLang}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onNavigate={handleNavigate}
      />

      {/* Intelligent Default-Option Chatbot Widget */}
      <ChatbotWidget currentLang={currentLang} onNavigate={handleNavigate} />
    </div>
  );
}
