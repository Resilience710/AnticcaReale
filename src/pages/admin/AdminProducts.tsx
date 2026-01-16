import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Upload, Image } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { Product, Shop, CATEGORIES, ERAS, ProductCategory, ProductEra } from '../../types';
import { getAllProducts, getAllShops, createProduct, updateProduct, deleteProduct } from '../../hooks/useFirestore';
import { TR } from '../../constants/tr';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Loading from '../../components/ui/Loading';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    shopId: '',
    name: '',
    description: '',
    price: 0,
    currency: 'TRY',
    category: 'Mobilya' as ProductCategory,
    era: 'Osmanlı' as ProductEra,
    images: [] as string[],
    stock: 1,
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [productsData, shopsData] = await Promise.all([
        getAllProducts(false),
        getAllShops(false), // Fetch ALL shops for admin, not just active ones
      ]);
      console.log('Fetched shops:', shopsData);
      console.log('Fetched products:', productsData);
      setProducts(productsData);
      setShops(shopsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const shopMap = new Map(shops.map(s => [s.id, s.name]));

  const resetForm = () => {
    setFormData({
      shopId: shops[0]?.id || '',
      name: '',
      description: '',
      price: 0,
      currency: 'TRY',
      category: 'Mobilya',
      era: 'Osmanlı',
      images: [],
      stock: 1,
      isActive: true,
    });
    setEditingProduct(null);
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        shopId: product.shopId,
        name: product.name,
        description: product.description,
        price: product.price,
        currency: product.currency,
        category: product.category,
        era: product.era,
        images: product.images || [],
        stock: product.stock,
        isActive: product.isActive,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }
      setFormData({ ...formData, images: [...formData.images, ...urls] });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Görsel yüklenirken hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.shopId) {
      alert('Lütfen bir dükkan seçin.');
      return;
    }

    setSaving(true);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      await fetchData();
      closeModal();
    } catch (error) {
      console.error('Save error:', error);
      alert('Kaydetme hatası oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(TR.admin.confirmDelete)) return;

    try {
      await deleteProduct(id);
      await fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silme hatası oluştu.');
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      await updateProduct(product.id, { isActive: !product.isActive });
      await fetchData();
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const categoryOptions = CATEGORIES.map((cat) => ({ value: cat, label: cat }));
  const eraOptions = ERAS.map((era) => ({ value: era, label: era }));
  const shopOptions = shops.map((shop) => ({ value: shop.id, label: shop.name }));

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-navy-800">
          {TR.admin.products}
        </h1>
        <Button onClick={() => openModal()} disabled={shops.length === 0}>
          <Plus className="h-5 w-5 mr-2" />
          {TR.admin.addProduct}
        </Button>
      </div>

      {shops.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-yellow-800">
          Ürün eklemek için önce bir dükkan oluşturmalısınız.
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-8 text-center text-navy-500">
            Henüz ürün eklenmemiş.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Görsel
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Ürün Adı
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Dükkan
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-navy-600">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-cream-50">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-cream-100 overflow-hidden">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            🏺
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy-800 line-clamp-1">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">
                      {shopMap.get(product.shopId) || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-navy-600">{product.category}</span>
                      <br />
                      <span className="text-xs text-navy-400">{product.era}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy-800">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.isActive ? TR.admin.active : TR.admin.inactive}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleActive(product)}
                          className="p-2 text-navy-500 hover:text-navy-700 hover:bg-cream-100 rounded-lg transition-colors"
                          title={product.isActive ? TR.admin.deactivate : TR.admin.activate}
                        >
                          {product.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openModal(product)}
                          className="p-2 text-navy-500 hover:text-navy-700 hover:bg-cream-100 rounded-lg transition-colors"
                          title={TR.admin.editProduct}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title={TR.admin.delete}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-cream-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold text-navy-800">
                {editingProduct ? TR.admin.editProduct : TR.admin.addProduct}
              </h2>
              <button
                onClick={closeModal}
                className="text-navy-400 hover:text-navy-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Shop Select */}
              <Select
                label={TR.admin.selectShop}
                options={shopOptions}
                value={formData.shopId}
                onChange={(e) => setFormData({ ...formData, shopId: e.target.value })}
                required
              />

              {/* Images Upload */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  {TR.admin.uploadImages}
                </label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {formData.images.map((url, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden bg-cream-100 border border-cream-200">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-cream-300 flex items-center justify-center cursor-pointer hover:border-gold-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {uploading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-gold-500 border-t-transparent rounded-full" />
                    ) : (
                      <Image className="h-6 w-6 text-cream-400" />
                    )}
                  </label>
                </div>
              </div>

              <Input
                label={TR.admin.productName}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  {TR.admin.productDescription}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label={TR.filters.category}
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                />
                <Select
                  label={TR.filters.era}
                  options={eraOptions}
                  value={formData.era}
                  onChange={(e) => setFormData({ ...formData, era: e.target.value as ProductEra })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={TR.products.price}
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  required
                />
                <Input
                  label={TR.admin.stock}
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-navy-300 text-gold-600 focus:ring-gold-500"
                />
                <label htmlFor="isActive" className="text-sm text-navy-700">
                  {TR.admin.active}
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  {TR.admin.cancel}
                </Button>
                <Button type="submit" loading={saving}>
                  {TR.admin.save}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
