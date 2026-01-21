import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Upload, Video, FileText, Star, StarOff } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import type { BlogPost, VideoBlogPost, RichTextBlogPost, BlogCategory } from '../../types';
import { BLOG_CATEGORIES, isVideoBlogPost } from '../../types';
import { 
  getAllBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  generateSlug,
  extractVideoInfo 
} from '../../hooks/useFirestore';
import { useAuth } from '../../contexts/AuthContext';
import { TR } from '../../constants/tr';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Loading from '../../components/ui/Loading';

type BlogPostType = 'video' | 'richtext';

interface FormData {
  type: BlogPostType;
  title: string;
  excerpt: string;
  category: BlogCategory;
  thumbnailUrl: string;
  tags: string;
  isPublished: boolean;
  isFeatured: boolean;
  // Video specific
  videoUrl: string;
  videoDescription: string;
  videoDuration: string;
  // Rich text specific
  content: string;
  galleryImages: string[];
}

const initialFormData: FormData = {
  type: 'richtext',
  title: '',
  excerpt: '',
  category: 'Antika Hikayeleri',
  thumbnailUrl: '',
  tags: '',
  isPublished: false,
  isFeatured: false,
  videoUrl: '',
  videoDescription: '',
  videoDuration: '',
  content: '',
  galleryImages: [],
};

export default function AdminBlog() {
  const { userData } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const postsData = await getAllBlogPosts(false);
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingPost(null);
  };

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        type: post.type,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        thumbnailUrl: post.thumbnailUrl,
        tags: post.tags.join(', '),
        isPublished: post.isPublished,
        isFeatured: post.isFeatured,
        videoUrl: isVideoBlogPost(post) ? post.videoUrl : '',
        videoDescription: isVideoBlogPost(post) ? post.videoDescription : '',
        videoDuration: isVideoBlogPost(post) ? (post.videoDuration || '') : '',
        content: !isVideoBlogPost(post) ? post.content : '',
        galleryImages: !isVideoBlogPost(post) ? post.galleryImages : [],
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

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `blog/thumbnails/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFormData({ ...formData, thumbnailUrl: url });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Görsel yüklenirken hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const storageRef = ref(storage, `blog/gallery/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }
      setFormData({ ...formData, galleryImages: [...formData.galleryImages, ...urls] });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Görseller yüklenirken hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newImages = formData.galleryImages.filter((_, i) => i !== index);
    setFormData({ ...formData, galleryImages: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Lütfen başlık girin.');
      return;
    }

    if (!formData.thumbnailUrl) {
      alert('Lütfen kapak görseli yükleyin.');
      return;
    }

    if (formData.type === 'video' && !formData.videoUrl) {
      alert('Lütfen video URL\'si girin.');
      return;
    }

    setSaving(true);

    try {
      const slug = generateSlug(formData.title);
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      
      const baseData = {
        title: formData.title,
        slug: editingPost?.slug || slug + '-' + Date.now(),
        excerpt: formData.excerpt,
        category: formData.category,
        thumbnailUrl: formData.thumbnailUrl,
        authorId: userData?.uid || '',
        authorName: userData?.name || 'Admin',
        tags,
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured,
      };

      if (formData.type === 'video') {
        const videoInfo = extractVideoInfo(formData.videoUrl);
        const postData: Omit<VideoBlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'> = {
          ...baseData,
          type: 'video',
          videoUrl: videoInfo.embedUrl,
          videoPlatform: videoInfo.platform,
          videoDescription: formData.videoDescription,
          videoDuration: formData.videoDuration || undefined,
        };

        if (editingPost) {
          await updateBlogPost(editingPost.id, postData);
        } else {
          await createBlogPost(postData);
        }
      } else {
        const postData: Omit<RichTextBlogPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'> = {
          ...baseData,
          type: 'richtext',
          content: formData.content,
          galleryImages: formData.galleryImages,
        };

        if (editingPost) {
          await updateBlogPost(editingPost.id, postData);
        } else {
          await createBlogPost(postData);
        }
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
    if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteBlogPost(id);
      await fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silme hatası oluştu.');
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      await updateBlogPost(post.id, { isPublished: !post.isPublished });
      await fetchData();
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const toggleFeatured = async (post: BlogPost) => {
    try {
      await updateBlogPost(post.id, { isFeatured: !post.isFeatured });
      await fetchData();
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const categoryOptions = BLOG_CATEGORIES.map((cat) => ({ value: cat, label: cat }));
  const typeOptions = [
    { value: 'richtext', label: 'Metin & Galeri' },
    { value: 'video', label: 'Video Blog' },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-espresso-900">
          Blog Yönetimi
        </h1>
        <Button onClick={() => openModal()}>
          <Plus className="h-5 w-5 mr-2" />
          Yeni Yazı Ekle
        </Button>
      </div>

      {/* Posts List */}
      <div className="bg-linen-200 rounded-xl shadow-sm border border-mist-300 overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-espresso-600">
            Henüz blog yazısı eklenmemiş.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linen-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-espresso-700">
                    Tür
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-espresso-700">
                    Kapak
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-espresso-700">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-espresso-700">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-espresso-700">
                    Görüntülenme
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-espresso-700">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-espresso-700">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist-300">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-linen-300/50">
                    <td className="px-6 py-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        post.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {post.type === 'video' ? (
                          <Video className="h-5 w-5" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-10 rounded-lg bg-linen-300 overflow-hidden">
                        {post.thumbnailUrl ? (
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-mist-400">
                            📝
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-espresso-900 line-clamp-1 max-w-xs">
                        {post.title}
                      </div>
                      <div className="text-xs text-espresso-500 mt-1">
                        {post.authorName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-espresso-700">
                      {post.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-espresso-700">
                      {post.viewCount || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            post.isPublished
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {post.isPublished ? 'Yayında' : 'Taslak'}
                        </span>
                        {post.isFeatured && (
                          <Star className="h-4 w-4 text-gold-500 fill-gold-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleFeatured(post)}
                          className="p-2 text-espresso-500 hover:text-gold-600 hover:bg-linen-300 rounded-lg transition-colors"
                          title={post.isFeatured ? 'Öne çıkarmayı kaldır' : 'Öne çıkar'}
                        >
                          {post.isFeatured ? (
                            <StarOff className="h-4 w-4" />
                          ) : (
                            <Star className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => togglePublished(post)}
                          className="p-2 text-espresso-500 hover:text-espresso-800 hover:bg-linen-300 rounded-lg transition-colors"
                          title={post.isPublished ? 'Yayından kaldır' : 'Yayınla'}
                        >
                          {post.isPublished ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => openModal(post)}
                          className="p-2 text-espresso-500 hover:text-espresso-800 hover:bg-linen-300 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
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
          <div className="relative bg-linen-200 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-linen-200 border-b border-mist-300 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold text-espresso-900">
                {editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
              </h2>
              <button
                onClick={closeModal}
                className="text-espresso-400 hover:text-espresso-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Type Selection */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'richtext' })}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    formData.type === 'richtext'
                      ? 'border-gold-500 bg-gold-50'
                      : 'border-mist-300 hover:border-mist-400'
                  }`}
                >
                  <FileText className={`h-8 w-8 mx-auto mb-2 ${
                    formData.type === 'richtext' ? 'text-gold-600' : 'text-espresso-400'
                  }`} />
                  <p className={`font-medium ${
                    formData.type === 'richtext' ? 'text-gold-700' : 'text-espresso-600'
                  }`}>Metin & Galeri</p>
                  <p className="text-xs text-espresso-500 mt-1">Zengin metin editörü + çoklu görsel</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'video' })}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    formData.type === 'video'
                      ? 'border-gold-500 bg-gold-50'
                      : 'border-mist-300 hover:border-mist-400'
                  }`}
                >
                  <Video className={`h-8 w-8 mx-auto mb-2 ${
                    formData.type === 'video' ? 'text-gold-600' : 'text-espresso-400'
                  }`} />
                  <p className={`font-medium ${
                    formData.type === 'video' ? 'text-gold-700' : 'text-espresso-600'
                  }`}>Video Blog</p>
                  <p className="text-xs text-espresso-500 mt-1">YouTube/Vimeo video gömme</p>
                </button>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium text-espresso-800 mb-2">
                  Kapak Görseli *
                </label>
                <div className="flex items-center gap-4">
                  {formData.thumbnailUrl ? (
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-linen-300 border border-mist-300">
                      <img src={formData.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, thumbnailUrl: '' })}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-32 h-20 rounded-lg border-2 border-dashed border-mist-300 flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                      {uploading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-gold-500 border-t-transparent rounded-full" />
                      ) : (
                        <>
                          <Upload className="h-5 w-5 text-mist-400" />
                          <span className="text-xs text-mist-500 mt-1">Yükle</span>
                        </>
                      )}
                    </label>
                  )}
                  <p className="text-xs text-espresso-500">Önerilen boyut: 1200x630px</p>
                </div>
              </div>

              {/* Title */}
              <Input
                label="Başlık *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Blog yazısı başlığı"
              />

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-espresso-800 mb-1">
                  Kısa Açıklama
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  placeholder="Blog kartlarında görünecek kısa açıklama..."
                  className="w-full px-4 py-2.5 rounded-lg border border-mist-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 bg-linen-100"
                />
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Kategori"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as BlogCategory })}
                />
                <Input
                  label="Etiketler"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="antika, osmanlı, mobilya (virgülle ayırın)"
                />
              </div>

              {/* Video-specific fields */}
              {formData.type === 'video' && (
                <div className="space-y-4 p-4 bg-red-50 rounded-xl border border-red-100">
                  <h3 className="font-medium text-espresso-800 flex items-center gap-2">
                    <Video className="h-5 w-5 text-red-500" />
                    Video Ayarları
                  </h3>
                  <Input
                    label="Video URL *"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... veya https://vimeo.com/..."
                    required={formData.type === 'video'}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Video Süresi"
                      value={formData.videoDuration}
                      onChange={(e) => setFormData({ ...formData, videoDuration: e.target.value })}
                      placeholder="12:34"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-espresso-800 mb-1">
                      Video Açıklaması
                    </label>
                    <textarea
                      value={formData.videoDescription}
                      onChange={(e) => setFormData({ ...formData, videoDescription: e.target.value })}
                      rows={3}
                      placeholder="Video hakkında kısa açıklama..."
                      className="w-full px-4 py-2.5 rounded-lg border border-mist-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 bg-linen-100"
                    />
                  </div>
                </div>
              )}

              {/* Rich text fields */}
              {formData.type === 'richtext' && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="font-medium text-espresso-800 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    İçerik Ayarları
                  </h3>
                  
                  {/* Content Editor */}
                  <div>
                    <label className="block text-sm font-medium text-espresso-800 mb-1">
                      İçerik (HTML destekler)
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={10}
                      placeholder="<p>Blog yazısı içeriği...</p><h2>Alt Başlık</h2><p>Devamı...</p>"
                      className="w-full px-4 py-2.5 rounded-lg border border-mist-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 bg-linen-100 font-mono text-sm"
                    />
                    <p className="text-xs text-espresso-500 mt-1">
                      HTML etiketleri kullanabilirsiniz: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;blockquote&gt;
                    </p>
                  </div>

                  {/* Gallery Images */}
                  <div>
                    <label className="block text-sm font-medium text-espresso-800 mb-2">
                      Galeri Görselleri
                    </label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {formData.galleryImages.map((url, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden bg-linen-300 border border-mist-300">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      <label className="w-20 h-20 rounded-lg border-2 border-dashed border-mist-300 flex flex-col items-center justify-center cursor-pointer hover:border-gold-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryUpload}
                          className="hidden"
                        />
                        {uploading ? (
                          <div className="animate-spin h-5 w-5 border-2 border-gold-500 border-t-transparent rounded-full" />
                        ) : (
                          <>
                            <Plus className="h-5 w-5 text-mist-400" />
                            <span className="text-xs text-mist-500">Ekle</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Publish options */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded border-mist-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="text-sm text-espresso-800">Yayınla</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-mist-300 text-gold-600 focus:ring-gold-500"
                  />
                  <span className="text-sm text-espresso-800">Öne Çıkar</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-mist-300">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  İptal
                </Button>
                <Button type="submit" loading={saving}>
                  {editingPost ? 'Güncelle' : 'Kaydet'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
