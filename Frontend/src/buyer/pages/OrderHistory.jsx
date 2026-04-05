import { useEffect, useMemo, useState } from "react";
import { MapPinned, Headset } from "lucide-react";
import toast from "react-hot-toast";
import BuyerLayout from "../components/BuyerLayout";
import api from "../../utils/axios";

function OrderTrackCard({ order, steps }) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-[#6b7280]">ORDER #{order.id}</p>
          <h2 className="mt-1 text-3xl font-semibold text-[#143d35]">{order.name}</h2>
          <div className="mt-3 flex flex-wrap gap-5 text-sm text-[#475569]">
            <p>
              Placed on
              <br />
              <span className="font-semibold text-[#1f2937]">{order.placedOn}</span>
            </p>
            <p>
              Total
              <br />
              <span className="font-semibold text-[#4d7c0f]">${order.total}</span>
            </p>
            <p>
              Carrier
              <br />
              <span className="font-semibold text-[#1f2937]">{order.carrier}</span>
            </p>
          </div>
        </div>
        <span className="inline-flex h-8 items-center rounded-full bg-[#d7f3c3] px-3 text-xs font-semibold uppercase tracking-wide text-[#3f6212]">
          {order.status}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-3 h-1.5 w-full rounded-full bg-[#e7ece9]">
          <div className="h-full rounded-full bg-[#4d7c0f]" style={{ width: `${(order.progress / 4) * 100}%` }} />
        </div>
        <div className="grid grid-cols-4 text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  index + 1 <= order.progress ? "bg-[#4d7c0f]" : "bg-[#d1d5db]"
                }`}
              />
              {step}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#e2e8f0] bg-[#f8faf9] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">Latest update</p>
          <p className="mt-1 text-sm font-semibold text-[#1f2937]">{order.latest}</p>
          <p className="text-xs text-[#64748b]">{order.updateTime}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-[#cad5d1] px-4 py-2 text-sm font-semibold text-[#0f5f53]">
          <MapPinned size={15} />
          Live Tracking Map
        </button>
      </div>
    </article>
  );
}

function OrderHistory() {
  const [timelineOrders, setTimelineOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeShipments, setActiveShipments] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [statusSteps, setStatusSteps] = useState(["Placed", "Shipped", "In Transit", "Delivered"]);
  const [meta, setMeta] = useState({
    estimatedArrival: "No active shipment",
    supportTitle: "Issue with an order?",
    supportDescription: "Our specialized agro-support team is ready to help 24/7.",
    supportAction: "CONTACT HELP CENTER",
  });

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/buyer/orders");

        const mapped = (data.orders || []).map((order) => ({
          id: order.id,
          name: order.title,
          placedOn: new Date(order.placedOn).toLocaleDateString(),
          total: Number(order.totalNpr || 0).toFixed(2),
          carrier: order.carrier,
          status: String(order.status || "").replace("-", " "),
          progress: order.progressStep || 1,
          latest: order.latestUpdate,
          updateTime: new Date(order.latestUpdateAt).toLocaleString(),
        }));

        setTimelineOrders(mapped);
        setActiveShipments(data.activeShipments || 0);
        setCompleted(data.completed || 0);
        setStatusSteps(data.statusSteps || ["Placed", "Shipped", "In Transit", "Delivered"]);
        setMeta((prev) => ({ ...prev, ...(data.meta || {}) }));
      } catch {
        toast.error("Failed to load orders");
        setTimelineOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const miniHistory = useMemo(
    () =>
      timelineOrders.slice(0, 2).map((order, index) => ({
        id: index + 1,
        name: order.name,
        amount: `NPR ${Number(order.total).toLocaleString()}`,
        date: `Placed ${order.placedOn}`,
      })),
    [timelineOrders]
  );

  return (
    <BuyerLayout
      title="My Orders Timeline"
      subtitle="Manage your active shipments and review past seasonal harvests."
      actions={
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full border border-[#d8e0dc] bg-white px-4 py-2 text-[#334155]">
            Active Shipments: <strong className="text-[#4d7c0f]">{activeShipments}</strong>
          </span>
          <span className="rounded-full border border-[#d8e0dc] bg-white px-4 py-2 text-[#334155]">
            Completed: <strong className="text-[#14532d]">{completed}</strong>
          </span>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <section className="space-y-5 xl:col-span-8">
          {isLoading && (
            <article className="rounded-3xl bg-white p-5 text-sm text-[#64748b] shadow-sm">
              Loading order timeline...
            </article>
          )}

          {timelineOrders.map((order) => (
            <OrderTrackCard key={order.id} order={order} steps={statusSteps} />
          ))}

          {!isLoading && timelineOrders.length === 0 && (
            <article className="rounded-3xl bg-white p-5 text-sm text-[#64748b] shadow-sm">
              No orders found for this buyer account.
            </article>
          )}
        </section>

        <aside className="space-y-5 xl:col-span-4">
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#1f2937]">Order History</h2>
              <button className="text-xs font-semibold text-[#4d7c0f]">SEE ALL</button>
            </div>
            <div className="space-y-3">
              {miniHistory.map((item) => (
                <article key={item.id} className="rounded-2xl border border-[#e5ebe8] bg-[#f9fbfa] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#143d35]">{item.name}</h3>
                      <p className="mt-1 text-xs text-[#64748b]">{item.date}</p>
                    </div>
                    <p className="text-lg font-semibold text-[#14532d]">{item.amount}</p>
                  </div>
                  <button className="mt-2 text-xs font-semibold text-[#4d7c0f]">REORDER</button>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="h-36 rounded-2xl bg-gradient-to-br from-[#d8ecde] to-[#bacfbf]" />
            <div className="mt-4 rounded-2xl bg-[#f3f8f5] p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">Estimated Arrival</p>
              <p className="mt-1 text-2xl font-semibold text-[#143d35]">{meta.estimatedArrival}</p>
            </div>
          </section>

          <section className="rounded-3xl bg-[#0f5f53] p-5 text-white shadow-sm">
            <div className="flex items-start gap-3">
              <Headset className="mt-1" size={18} />
              <div>
                <h3 className="text-lg font-semibold">{meta.supportTitle}</h3>
                <p className="mt-1 text-sm text-[#c9e8de]">{meta.supportDescription}</p>
              </div>
            </div>
            <button className="mt-4 rounded-full bg-[#85b600] px-4 py-2 text-xs font-semibold text-[#143d35]">
              {meta.supportAction}
            </button>
          </section>
        </aside>
      </div>
    </BuyerLayout>
  );
}

export default OrderHistory;
