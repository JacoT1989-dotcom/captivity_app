import { useState, useCallback } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil } from "lucide-react";
import {
  HighlightedProduct,
  useHighlightedProductsData,
} from "@/app/(editor)/_editor-store/highlighted-products-store";

// Types
interface ProductCardProps {
  product: HighlightedProduct;
  isEditor: boolean;
  onEdit: (product: HighlightedProduct) => void;
  onRemove: (id: string) => Promise<void>;
}

interface AddProductFormProps {
  onCancel: () => void;
  onUpload: (formData: FormData) => Promise<void>;
}

// Base Product Card Component
const ProductCard = ({
  product,
  isEditor,
  onEdit,
  onRemove,
}: ProductCardProps) => {
  const { title, price, image, rating = 0 } = product;

  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="aspect-square relative">
        <Image
          src={image || "/placeholder.png"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">R{price}</span>
          <div className="flex">
            {Array.from({ length: Math.floor(rating) }).map((_, i) => (
              <span key={i} className="text-yellow-400">
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      {isEditor && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-white/80 rounded-full hover:bg-white hover:shadow-md transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(product.id)}
            className="p-2 bg-white/80 rounded-full hover:bg-white hover:shadow-md transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// Add Product Form Component
const AddProductForm = ({ onCancel, onUpload }: AddProductFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    rating: "0",
    position: "0",
    image: null as File | null,
    imagePreview: null as string | null,
  });

  const handleFileSelect = (file: File | undefined) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("price", formData.price);
    submitData.append("rating", formData.rating);
    submitData.append("position", formData.position);
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    await onUpload(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="space-y-4">
        <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
          {formData.imagePreview ? (
            <Image
              src={formData.imagePreview}
              alt="Preview"
              fill
              className="object-cover"
            />
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              <Plus className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Upload Image</span>
              <input
                type="file"
                className="hidden"
                onChange={e => handleFileSelect(e.target.files?.[0])}
                accept="image/*"
              />
            </label>
          )}
        </div>

        <input
          type="text"
          placeholder="Product Title"
          value={formData.title}
          onChange={e =>
            setFormData(prev => ({ ...prev, title: e.target.value }))
          }
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={e =>
            setFormData(prev => ({ ...prev, price: e.target.value }))
          }
          className="w-full p-2 border rounded"
          required
          min="0"
          step="0.01"
        />

        <input
          type="number"
          placeholder="Rating (0-5)"
          value={formData.rating}
          onChange={e =>
            setFormData(prev => ({ ...prev, rating: e.target.value }))
          }
          className="w-full p-2 border rounded"
          required
          min="0"
          max="5"
          step="0.5"
        />

        <input
          type="number"
          placeholder="Position"
          value={formData.position}
          onChange={e =>
            setFormData(prev => ({ ...prev, position: e.target.value }))
          }
          className="w-full p-2 border rounded"
          required
          min="0"
          step="1"
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>
    </form>
  );
};

// Main New Arrivals Section Component
export function NewArrivalsSection() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<HighlightedProduct | null>(null);

  const {
    newArrivals,
    isLoading,
    uploadNewArrival,
    updateNewArrival,
    removeNewArrival,
  } = useHighlightedProductsData();

  const handleUpload = useCallback(
    async (formData: FormData) => {
      try {
        await uploadNewArrival(formData);
        setShowAddForm(false);
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [uploadNewArrival]
  );

  const handleEdit = useCallback((product: HighlightedProduct) => {
    setEditingProduct(product);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-100 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {showAddForm ? (
          <AddProductForm
            onCancel={() => setShowAddForm(false)}
            onUpload={handleUpload}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isEditor={true}
                onEdit={handleEdit}
                onRemove={removeNewArrival}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default NewArrivalsSection;
