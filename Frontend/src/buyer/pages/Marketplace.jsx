import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, ShoppingCart, Star } from "lucide-react";
import toast from "react-hot-toast";
import BuyerLayout from "../components/BuyerLayout";
import { useCart } from "../../context/CartContext";
import api from "../../utils/axios";

function Marketplace() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [sortOptions, setSortOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [region, setRegion] = useState("All Regions");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const { data } = await api.get("/buyer/meta");
        if (Array.isArray(data.categories)) setCategoryOptions(data.categories);
        if (Array.isArray(data.regions)) setRegionOptions(data.regions);
        if (Array.isArray(data.sortOptions)) setSortOptions(data.sortOptions);
      } catch {
        toast.error("Failed to load marketplace filters");
      }
    };

    loadMeta();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const params = {
          page: 1,
          limit: 50,
          sort: sortBy,
          search,
          category: category === "All" ? "all" : category,
          region: region === "All Regions" ? "all" : region,
        };

        const { data } = await api.get("/buyer/marketplace", { params });
        setProducts(data.products || []);
        setTotalProducts(data.pagination?.total || 0);
      } catch {
        toast.error("Failed to load marketplace products");
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [search, category, region, sortBy]);

  const handleAdd = async (product) => {
    try {
      await addItem(product.id, 1);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error("Could not add item to cart");
    }
  };

  const filterBar = (
    <div className="space-y-3 rounded-3xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#1f2937]">
        <SlidersHorizontal size={16} className="text-[#0f5f53]" />
        Smart Filters
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <label className="relative block md:col-span-2">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, crops, farms..."
            className="h-11 w-full rounded-xl border border-[#dde4e1] bg-[#f9fbfa] pl-10 pr-3 text-sm text-[#334155] outline-none transition focus:border-[#8ccfb7]"
          />
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-xl border border-[#dde4e1] bg-[#f9fbfa] px-3 text-sm text-[#334155] outline-none transition focus:border-[#8ccfb7]"
        >
          <option>All</option>
          {categoryOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="h-11 rounded-xl border border-[#dde4e1] bg-[#f9fbfa] px-3 text-sm text-[#334155] outline-none transition focus:border-[#8ccfb7]"
          >
            <option>All Regions</option>
            {regionOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 rounded-xl border border-[#dde4e1] bg-[#f9fbfa] px-3 text-sm text-[#334155] outline-none transition focus:border-[#8ccfb7]"
          >
            {(sortOptions.length ? sortOptions : ["featured", "rating", "price-low", "price-high"]).map(
              (option) => (
                <option key={option} value={option}>
                  {option === "featured"
                    ? "Featured"
                    : option === "rating"
                    ? "Top Rated"
                    : option === "price-low"
                    ? "Price: Low"
                    : option === "price-high"
                    ? "Price: High"
                    : option}
                </option>
              )
            )}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <BuyerLayout
      title="Marketplace"
      subtitle="Direct-from-farm produce curated for premium quality and sustainability."
      actions={<p className="text-sm text-[#6b7280]">{totalProducts} products found</p>}
    >
      {filterBar}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative h-40 overflow-hidden">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-[#95df66] px-2 py-1 text-[10px] font-semibold uppercase text-[#143d35]">
                {product.tag || product.badge || "Featured"}
              </span>
            </div>
            <div className="p-4">
              <div className="mb-1 flex items-start justify-between gap-3">
                <h3 className="text-2xl font-semibold leading-tight text-[#1f2937]">{product.name}</h3>
                <p className="inline-flex items-center gap-1 text-sm font-semibold text-[#4d7c0f]">
                  <Star size={12} className="fill-current" />
                  {product.rating}
                </p>
              </div>
              <p className="text-sm text-[#64748b]">{product.farmer}</p>
              <div className="mt-4 flex items-end justify-between">
                <p className="text-xl font-semibold text-[#0f5f53]">
                  Rs. {product.price}
                  <span className="ml-1 text-base font-medium text-[#64748b]">/{product.unit}</span>
                </p>
                <button
                  onClick={() => handleAdd(product)}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-[#014d40] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#066454]"
                >
                  <ShoppingCart size={15} />
                  Add to Cart
                </button>
              </div>
            </div>
          </article>
        ))}

        {!isLoading && products.length === 0 && (
          <article className="rounded-3xl bg-white p-6 text-sm text-[#64748b] shadow-sm md:col-span-2 xl:col-span-3">
            No products found for current filters.
          </article>
        )}

        {isLoading && (
          <article className="rounded-3xl bg-white p-6 text-sm text-[#64748b] shadow-sm md:col-span-2 xl:col-span-3">
            Loading marketplace products...
          </article>
        )}
      </div>
    </BuyerLayout>
  );
}

export default Marketplace;
