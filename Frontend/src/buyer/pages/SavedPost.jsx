import { useEffect, useState } from "react";
import { Trash2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import BuyerLayout from "../components/BuyerLayout";
import { useCart } from "../../context/CartContext";
import api from "../../utils/axios";

function SavedPost() {
  const { addItem } = useCart();
  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedPosts = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/buyer/saved-posts");
        setSavedItems(data.savedPosts || []);
      } catch {
        toast.error("Failed to load saved posts");
        setSavedItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedPosts();
  }, []);

  const addToCart = async (item) => {
    try {
      await addItem(item.id, 1);
      toast.success(`${item.name} added to cart`);
    } catch {
      toast.error("Could not add item to cart");
    }
  };

  const removeSaved = async (id) => {
    try {
      await api.delete(`/buyer/saved-posts/${id}`);
      setSavedItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Removed from saved posts");
    } catch {
      toast.error("Could not remove saved post");
    }
  };

  return (
    <BuyerLayout
      title="Saved Seeds & Crops"
      subtitle="Manage your curated list of premium agricultural supplies."
      actions={
        <div className="flex gap-2">
          <button className="rounded-full border border-[#d8e0dc] bg-white px-3 py-2 text-xs font-semibold text-[#334155]">
            Recently Added
          </button>
          <button className="rounded-full border border-[#d8e0dc] bg-white px-3 py-2 text-xs font-semibold text-[#334155]">
            Category
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {savedItems.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative h-40 overflow-hidden">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeSaved(item.id)}
                className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#dc2626]"
              >
                <Trash2 size={14} />
              </button>
              <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {item.tag}
              </span>
            </div>
            <div className="p-4">
              <div className="mb-1 flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-[#1f2937]">{item.name}</h3>
                <p className="text-2xl font-semibold text-[#143d35]">${item.price}</p>
              </div>
              <p className="text-sm text-[#64748b]">{item.description}</p>
              <button
                onClick={() => addToCart(item)}
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#014d40] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#066454]"
              >
                <ShoppingCart size={15} />
                Add to Cart
              </button>
            </div>
          </article>
        ))}

        {!isLoading && savedItems.length === 0 && (
          <article className="rounded-3xl bg-white p-6 text-sm text-[#64748b] shadow-sm md:col-span-2 xl:col-span-4">
            You do not have any saved posts right now.
          </article>
        )}

        {isLoading && (
          <article className="rounded-3xl bg-white p-6 text-sm text-[#64748b] shadow-sm md:col-span-2 xl:col-span-4">
            Loading saved posts...
          </article>
        )}
      </div>
    </BuyerLayout>
  );
}

export default SavedPost;
