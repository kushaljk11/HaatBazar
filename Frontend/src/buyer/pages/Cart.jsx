import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import BuyerLayout from "../components/BuyerLayout";
import { useCart } from "../../context/CartContext";

function Cart() {
  const { items, subtotal, itemCount, updateQuantity, removeItem, clearCart, isCartLoading } = useCart();

  const deliveryFee = subtotal > 0 ? 150 : 0;
  const tax = subtotal * 0.13;
  const total = subtotal + deliveryFee + tax;

  const handleQuantity = async (id, delta) => {
    try {
      await updateQuantity(id, delta);
    } catch {
      toast.error("Could not update item quantity");
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeItem(id);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Could not remove cart item");
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      await clearCart();
      toast.success("Purchase confirmed");
    } catch {
      toast.error("Could not confirm purchase");
    }
  };

  return (
    <BuyerLayout
      title="Your Harvest Cart"
      subtitle="Review selected products before confirming your purchase."
      actions={<p className="text-sm text-[#64748b]">{itemCount} items selected</p>}
    >
      {isCartLoading ? (
        <section className="rounded-3xl bg-white p-8 text-center text-sm text-[#64748b] shadow-sm">
          Loading cart...
        </section>
      ) : items.length === 0 ? (
        <section className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-3xl font-semibold text-[#143d35]">Your cart is empty</h2>
          <p className="mt-2 text-[#64748b]">Start adding products from Marketplace or Saved Posts.</p>
          <Link
            to="/buyer/marketplace"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#014d40] px-5 py-3 text-sm font-semibold text-white"
          >
            Browse Marketplace
            <ArrowRight size={15} />
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <section className="space-y-4 xl:col-span-8">
            {items.map((item) => (
              <article key={item.id} className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-xl font-semibold text-[#1f2937]">{item.name}</h3>
                    <p className="text-sm text-[#64748b]">Farm: {item.vendor}</p>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#f1f5f3] px-2 py-1">
                      <button onClick={() => handleQuantity(item.id, -1)} className="rounded-full p-1 text-[#475569]">
                        <Minus size={14} />
                      </button>
                      <span className="min-w-12 text-center text-sm font-semibold text-[#1f2937]">
                        {item.quantity} {item.unit}
                      </span>
                      <button onClick={() => handleQuantity(item.id, 1)} className="rounded-full p-1 text-[#475569]">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-semibold text-[#143d35]">NPR {(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#dc2626]"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                </div>
              </article>
            ))}

            <section className="rounded-3xl bg-[#184f3b] p-6 text-white shadow-sm">
              <h3 className="text-3xl font-semibold">Eco-Friendly Delivery</h3>
              <p className="mt-2 max-w-lg text-sm text-[#d3e8df]">
                Our riders use electric vehicles for all deliveries within Kathmandu valley to minimize carbon footprint.
              </p>
              <div className="mt-4 flex gap-2">
                <button className="rounded-full bg-[#7aa700] px-4 py-2 text-xs font-semibold text-[#123326]">
                  Select Scheduled Time
                </button>
                <button className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white">Learn More</button>
              </div>
            </section>
          </section>

          <aside className="space-y-4 xl:col-span-4">
            <section className="rounded-3xl bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#1f2937]">Order Summary</h2>
              <div className="mt-4 space-y-2 text-sm text-[#475569]">
                <div className="flex justify-between"><span>Subtotal</span><span>NPR {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span><span>NPR {deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Tax (13%)</span><span>NPR {tax.toFixed(2)}</span></div>
              </div>
              <div className="mt-4 border-t border-[#e2e8f0] pt-4">
                <div className="flex justify-between text-2xl font-semibold text-[#143d35]">
                  <span>Total Amount</span>
                  <span>NPR {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmPurchase}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#014d40] px-4 py-3 text-sm font-semibold text-white hover:bg-[#066454]"
              >
                Confirm Purchase
                <ArrowRight size={15} />
              </button>

              <p className="mt-4 text-center text-xs text-[#64748b]">
                By confirming, you agree to HaatBazar terms and purchase policy.
              </p>
            </section>

            <div className="rounded-full border border-[#dbe4df] bg-white px-4 py-3 text-sm text-[#475569]">
              <p className="inline-flex items-center gap-2 font-medium text-[#14532d]">
                <ShieldCheck size={16} />
                Secure Checkout
              </p>
              <p className="text-xs">256-bit SSL encrypted payments</p>
            </div>
          </aside>
        </div>
      )}
    </BuyerLayout>
  );
}

export default Cart;
