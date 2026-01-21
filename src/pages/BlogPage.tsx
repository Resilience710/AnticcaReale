import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Video, FileText, Eye, Calendar, Tag, Filter, X } from 'lucide-react';
import { useBlogPosts } from '../hooks/useFirestore';
import type { BlogPost, BlogCategory } from '../types';
import { BLOG_CATEGORIES, isVideoBlogPost } from '../types';
import Loading from '../components/ui/Loading';
import Button from '../components/ui/Button';

function BlogCard({ post }: { post: BlogPost }) {
  const isVideo = isVideoBlogPost(post);
  
  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Link
      to={`/blog/${post.slug || post.id}`}
      className="group bg-linen-300 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-mist-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-linen-200">
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mist-400">
            <span className="text-6xl">📝</span>
          </div>
        )}
        
        {/* Type indicator */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          isVideo 
            ? 'bg-red-500 text-white' 
            : 'bg-blue-500 text-white'
        }`}>
          {isVideo ? (
            <>
              <Video className="h-3.5 w-3.5" />
              <span>Video</span>
            </>
          ) : (
            <>
              <FileText className="h-3.5 w-3.5" />
              <span>Makale</span>
            </>
          )}
        </div>

        {/* Featured badge */}
        {post.isFeatured && (
          <div className="absolute top-3 right-3 bg-gold-500 text-espresso-950 px-2.5 py-1 rounded-full text-xs font-medium">
            Öne Çıkan
          </div>
        )}

        {/* Video duration */}
        {isVideo && (post as any).videoDuration && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-0.5 rounded text-xs">
            {(post as any).videoDuration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gold-700 bg-gold-100 px-2 py-0.5 rounded-full">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-semibold text-espresso-900 line-clamp-2 group-hover:text-gold-800 transition-colors mb-2">
          {post.title}
        </h3>
        
        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-espresso-600 line-clamp-2 mb-3">
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-espresso-500 pt-3 border-t border-mist-300">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{post.viewCount || 0} görüntülenme</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { posts, loading } = useBlogPosts({
    publishedOnly: true,
    category: selectedCategory || undefined,
  });

  const { posts: featuredPosts } = useBlogPosts({
    publishedOnly: true,
    featured: true,
    limitCount: 3,
  });

  const clearFilter = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-linen-300">
      {/* Header */}
      <div className="bg-olive-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">Blog</h1>
          <p className="mt-2 text-linen-100/90">
            Antika dünyasından hikayeler, koleksiyonerlik rehberleri ve daha fazlası
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-espresso-900">Kategoriler</h2>
            {selectedCategory && (
              <Button variant="ghost" size="sm" onClick={clearFilter}>
                <X className="h-4 w-4 mr-1" />
                Filtreyi Temizle
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-gold-500 text-espresso-950'
                  : 'bg-linen-200 text-espresso-700 hover:bg-linen-400'
              }`}
            >
              Tümü
            </button>
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-gold-500 text-espresso-950'
                    : 'bg-linen-200 text-espresso-700 hover:bg-linen-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Posts Section (only show if no filter) */}
        {!selectedCategory && featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-6">
              Öne Çıkan Yazılar
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-espresso-900 mb-6">
            {selectedCategory ? `${selectedCategory}` : 'Tüm Yazılar'}
          </h2>
          
          {loading ? (
            <Loading />
          ) : posts.length === 0 ? (
            <div className="text-center py-16 bg-linen-200 rounded-xl border border-mist-300">
              <FileText className="h-12 w-12 text-mist-400 mx-auto mb-4" />
              <p className="text-espresso-700 text-lg">Henüz blog yazısı bulunmuyor.</p>
              {selectedCategory && (
                <p className="text-espresso-500 mt-2">
                  "{selectedCategory}" kategorisinde yazı yok. 
                  <button 
                    onClick={clearFilter}
                    className="text-gold-700 hover:underline ml-1"
                  >
                    Tüm yazıları görüntüle
                  </button>
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
