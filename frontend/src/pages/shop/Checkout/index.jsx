import React, { useState } from "react";
import { productImage } from "@/utils/shopImage";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Check, CreditCard, ShieldCheck, Truck, ShoppingBag, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/dashboard/layout";
import { useCart } from "@/hooks/useCart";

export default function CheckoutView() {
  const navigate = useNavigate();
  const { cart, subtotal, discountAmount, shipping, total, checkoutOrder } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Success

  // Form states
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "Shreyash Sharma",
    address: "128 Riverstone Ave",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    phone: "+1 (555) 019-2831"
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "•••• •••• •••• 4242",
    expiry: "12/28",
    cvv: "•••",
    cardName: "Shreyash Sharma"
  });

  const handleNextStep = (e) => {
    e?.preventDefault();
    setStep(prev => prev + 1);
  };

  const handlePlaceOrder = () => {
    checkoutOrder(shippingDetails, paymentDetails);
    setStep(4);
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <DashboardLayout pageTitle="Checkout" pageDescription="Process order.">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="text-slate-300 mb-4 animate-pulse" size={32} />
          <h3 className="text-lg font-black text-slate-700">Your bag is empty</h3>
          <Link to="/shop" className="mt-4 text-xs font-black text-emerald-600 hover:underline">
            Go back to shop
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const steps = [
    { num: 1, label: "Shipping" },
    { num: 2, label: "Payment" },
    { num: 3, label: "Review" }
  ];

  return (
    <DashboardLayout
      pageTitle="Secure Checkout"
      pageDescription="Complete shipping options and payment methods securely."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Step indicator header */}
        {step < 4 && (
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              {steps.map(s => (
                <div key={s.num} className="flex items-center gap-1.5">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${
                    step >= s.num ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    {step > s.num ? <Check size={10} /> : s.num}
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    step >= s.num ? "text-slate-800" : "text-slate-400"
                  }`}>
                    {s.label}
                  </span>
                  {s.num < 3 && <div className="h-0.5 w-6 bg-slate-100" />}
                </div>
              ))}
            </div>

            <Link to="/shop/cart" className="text-xs font-black text-slate-400 hover:text-slate-600 flex items-center gap-0.5">
              <ChevronLeft size={14} />
              <span>Back to cart</span>
            </Link>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Wizard Panels */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form
                  key="shipping"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleNextStep}
                  className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4"
                >
                  <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Truck size={17} className="text-emerald-500" />
                    <span>Shipping Address</span>
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                      <input
                        required
                        type="text"
                        value={shippingDetails.fullName}
                        onChange={e => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Street Address</label>
                      <input
                        required
                        type="text"
                        value={shippingDetails.address}
                        onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">City</label>
                      <input
                        required
                        type="text"
                        value={shippingDetails.city}
                        onChange={e => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">State</label>
                        <input
                          required
                          type="text"
                          value={shippingDetails.state}
                          onChange={e => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 bg-slate-50 focus:bg-white transition"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Zip Code</label>
                        <input
                          required
                          type="text"
                          value={shippingDetails.zipCode}
                          onChange={e => setShippingDetails({ ...shippingDetails, zipCode: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 bg-slate-50 focus:bg-white transition"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition mt-2"
                  >
                    Continue to Payment
                  </button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.form
                  key="payment"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleNextStep}
                  className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-4"
                >
                  <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <CreditCard size={17} className="text-emerald-500" />
                    <span>Payment Method</span>
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Name on Card</label>
                      <input
                        required
                        type="text"
                        value={paymentDetails.cardName}
                        onChange={e => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Card Number</label>
                      <input
                        required
                        type="text"
                        value={paymentDetails.cardNumber}
                        onChange={e => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Expiry Date</label>
                      <input
                        required
                        type="text"
                        placeholder="MM/YY"
                        value={paymentDetails.expiry}
                        onChange={e => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">CVV</label>
                      <input
                        required
                        type="text"
                        value={paymentDetails.cvv}
                        onChange={e => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-400 bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition"
                    >
                      Continue to Review
                    </button>
                  </div>
                </motion.form>
              )}

              {step === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm space-y-5"
                >
                  <h3 className="text-base font-black text-slate-800 tracking-tight">Review Order</h3>

                  {/* Summary lists */}
                  <div className="space-y-4 text-xs">
                    <div className="grid gap-2 border-b border-slate-100 pb-3">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Shipping Details</span>
                      <p className="font-bold text-slate-700">{shippingDetails.fullName}</p>
                      <p className="text-slate-500">{shippingDetails.address}, {shippingDetails.city}, {shippingDetails.state} {shippingDetails.zipCode}</p>
                    </div>

                    <div className="grid gap-2 border-b border-slate-100 pb-3">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Payment Method</span>
                      <p className="font-bold text-slate-700">Card ending in 4242</p>
                      <p className="text-slate-500">Holder: {paymentDetails.cardName}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(2)}
                      className="flex-1 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl text-xs font-black hover:shadow-lg transition"
                    >
                      Place Secure Order
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="success"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-[30px] border border-emerald-200 bg-emerald-50/20 p-8 text-center space-y-4 shadow-sm"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white mx-auto shadow-md shadow-emerald-500/20 animate-bounce">
                    <Check size={26} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">Order Placed Successfully!</h3>
                  <p className="max-w-md mx-auto text-xs font-semibold text-slate-500 leading-relaxed">
                    Thank you! Your secure checkout has been processed successfully. We've sent a detailed summary confirmation to your email.
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <Link
                      to="/shop/orders"
                      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Order History
                    </Link>
                    <Link
                      to="/shop"
                      className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black text-white hover:bg-slate-800 transition"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel: Side summary cards */}
          {step < 4 && (
            <div className="lg:col-span-4 space-y-4">
              {/* Product items lists preview */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Items Summary</span>
                <div className="space-y-3">
                  {cart.map((item, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <img
                        src={productImage(item.product)}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-700 truncate leading-tight">{item.product.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secure payment details summary */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 text-xs">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Total summary</span>
                <div className="space-y-1.5 border-b border-slate-100 pb-2 text-slate-500 font-semibold">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-700 font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-rose-600">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-slate-700 font-bold">{shipping === 0 ? "FREE" : `$${shipping}`}</span>
                  </div>
                </div>
                <div className="flex justify-between items-baseline font-black text-slate-800">
                  <span>Total Amount</span>
                  <span className="text-base text-slate-900">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
