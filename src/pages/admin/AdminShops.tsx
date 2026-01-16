import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Upload } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { Shop } from '../../types';
import { getAllShops, createShop, updateShop, deleteShop } from '../../hooks/useFirestore';
import { TR } from '../../constants/tr';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Loading from '../../components/ui/Loading';

export default function AdminShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city: 'İstanbul',
    district: '',
    address: '',
    phone: '',
    logoUrl: '',
    isActive: true,
  });

  useEffect(() => {
    fetchShops();
  }, []);

  async function fetchShops() {
    try {
      const data = await getAllShops(false);
      setShops(data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      city: 'İstanbul',
      district: '',
      address: '',
      phone: '',
      logoUrl: '',
      isActive: true,
    });
    setEditingShop(null);
  };

  const openModal = (shop?: Shop) => {
    if (shop) {
      setEditingShop(shop);
      setFormData({
        name: shop.name,
        description: shop.description,
        city: shop.city,
        district: shop.district,
        address: shop.address,
        phone: shop.phone,
        logoUrl: shop.logoUrl || '',
        isActive: shop.isActive,
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
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `shops/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData({ ...formData, logoUrl: url });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Görsel yüklenirken hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingShop) {
        await updateShop(editingShop.id, formData);
      } else {
        await createShop(formData);
      }
      await fetchShops();
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
      await deleteShop(id);
      await fetchShops();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silme hatası oluştu.');
    }
  };

  const toggleActive = async (shop: Shop) => {
    try {
      await updateShop(shop.id, { isActive: !shop.isActive });
      await fetchShops();
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-navy-800">
          {TR.admin.shops}
        </h1>
        <Button onClick={() => openModal()}>
          <Plus className="h-5 w-5 mr-2" />
          {TR.admin.addShop}
        </Button>
      </div>

      {/* Shops List */}
      <div className="bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden">
        {shops.length === 0 ? (
          <div className="p-8 text-center text-navy-500">
            Henüz dükkan eklenmemiş.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Logo
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Dükkan Adı
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Konum
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-navy-600">
                    Telefon
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
                {shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-cream-50">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-cream-100 overflow-hidden">
                        {shop.logoUrl ? (
                          <img
                            src={shop.logoUrl}
                            alt={shop.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            🏛️
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-navy-800">{shop.name}</div>
                      <div className="text-sm text-navy-500 line-clamp-1">
                        {shop.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">
                      {shop.district}, {shop.city}
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">
                      {shop.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          shop.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {shop.isActive ? TR.admin.active : TR.admin.inactive}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleActive(shop)}
                          className="p-2 text-navy-500 hover:text-navy-700 hover:bg-cream-100 rounded-lg transition-colors"
                          title={shop.isActive ? TR.admin.deactivate : TR.admin.activate}
                        >
                          {shop.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openModal(shop)}
                          className="p-2 text-navy-500 hover:text-navy-700 hover:bg-cream-100 rounded-lg transition-colors"
                          title={TR.admin.editShop}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(shop.id)}
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
            <div className="sticky top-0 bg-white border-b border-cream-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-navy-800">
                {editingShop ? TR.admin.editShop : TR.admin.addShop}
              </h2>
              <button
                onClick={closeModal}
                className="text-navy-400 hover:text-navy-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  {TR.admin.uploadLogo}
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg bg-cream-100 overflow-hidden border border-cream-200">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🏛️
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2 px-4 py-2 border border-navy-200 rounded-lg text-navy-700 hover:bg-cream-50 transition-colors">
                      <Upload className="h-4 w-4" />
                      {uploading ? 'Yükleniyor...' : 'Görsel Seç'}
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={TR.admin.shopName}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label={TR.auth.phone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  {TR.admin.shopDescription}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-navy-200 focus:border-gold-500 focus:ring-2 focus:ring-gold-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={TR.filters.city}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
                <Input
                  label={TR.filters.district}
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                />
              </div>

              <Input
                label={TR.shops.address}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />

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
