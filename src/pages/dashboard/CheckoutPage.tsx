import React from 'react';
import { useCartContext } from '@/context/cart-provider';
import { ShieldCheck, Truck, CreditCard, ChevronLeft, MapPin, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/context/auth-provider';

const CheckoutPage = () => {
  const { cart, totalPrice } = useCartContext();
  const { user } = useAuthContext();
  const formattedPrice = (price: number) => 
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 bg-white">
      {/* 1. Header & Breadcrumbs */}
      <div className="mb-10">
        <Link to="/dashboard/product/cart" className="flex items-center gap-2 text-gray-400 hover:text-orange-600 transition-colors mb-4 text-sm font-bold uppercase tracking-widest">
          <ChevronLeft size={16} /> Back to Cart
        </Link>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Finalize Order</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT COLUMN: FORMS */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* Shipping Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-sm">1</div>
              <h2 className="text-xl font-black text-gray-900">Shipping Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                <Input placeholder="John Doe" value={`${user?.firstName} ${user?.lastName}`} className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                <Input placeholder="+234..." className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Street Address</label>
                <Input placeholder="123 Business Way, Ikeja" className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white" />
              </div>
            </div>
          </section>

          {/* Payment Section (Dummy) */}
          <section className="space-y-6 opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-black text-sm">2</div>
              <h2 className="text-xl font-black text-gray-900">Payment Method</h2>
            </div>
            
            <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center">
              <CreditCard className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-sm font-bold text-gray-500">Secure Payment Gateway will open here</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">Supports Cards, Bank Transfer & USSD</p>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-gray-50 rounded-[32px] p-8 border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">In Your Bag</h3>
            
            {/* Scrollable Mini-Items List */}
            <div className="max-h-60 overflow-y-auto mb-8 space-y-4 pr-2 custom-scrollbar">
              {cart?.items.map((item: any) => (
                <div key={item.product._id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-100 shrink-0">
                    <img src={item.product.media[0]} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-black text-gray-900">{formattedPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <Separator className="mb-6 bg-gray-200" />

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Subtotal</span>
                <span>{formattedPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between items-baseline pt-4">
                <span className="text-base font-black text-gray-900 uppercase">Total Amount</span>
                <span className="text-3xl font-black text-orange-600">{formattedPrice(totalPrice)}</span>
              </div>
            </div>

            <Button className="w-full h-16 bg-gray-900 hover:bg-orange-600 text-white rounded-2xl font-black text-lg gap-3 transition-all active:scale-95 shadow-2xl shadow-gray-200 group">
              <Lock size={20} className="text-orange-400 group-hover:text-white transition-colors" />
              Pay {formattedPrice(totalPrice)}
            </Button>

            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100">
                <ShieldCheck size={18} className="text-blue-500" />
                <span className="text-[9px] font-black text-gray-500 uppercase">Buyer Protection</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-100">
                <Truck size={18} className="text-orange-500" />
                <span className="text-[9px] font-black text-gray-500 uppercase">Fast Delivery</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;