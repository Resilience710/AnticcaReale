import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Play, Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useBlogPost } from '../hooks/useFirestore';
import Loading from '../components/ui/Loading';
import { useState } from 'react';
import { isVideoBlogPost, isRichTextBlogPost } from '../types';

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { post, loading, error } = useBlogPost(id || '');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (loading) {
    return <Loading fullScreen text="Blog yazısı yükleniyor..." />;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-olive-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-linen-300 mb-4">Blog yazısı bulunamadı</h1>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Blog'a Dön
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  // Get gallery images for rich text posts
  const galleryImages = isRichTextBlogPost(post) ? post.galleryImages : [];

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null || galleryImages.length === 0) return;
    const newIndex = direction === 'prev' 
      ? (selectedImageIndex - 1 + galleryImages.length) % galleryImages.length
      : (selectedImageIndex + 1) % galleryImages.length;
    setSelectedImageIndex(newIndex);
  };

  return (
    <div className="min-h-screen bg-olive-800">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-olive-800 via-olive-800/50 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-olive-800/80 backdrop-blur-sm text-linen-300 rounded-lg hover:bg-olive-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Blog'a Dön
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Type Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500 text-olive-800 rounded-full text-sm font-medium mb-4">
              {post.type === 'video' ? (
                <>
                  <Play className="w-4 h-4" />
                  Video
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  Makale
                </>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif text-linen-100 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-linen-300/80 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.createdAt)}
              </span>
              {isVideoBlogPost(post) && post.videoDuration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.videoDuration}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Video Content */}
        {isVideoBlogPost(post) && post.videoUrl && (
          <div className="mb-10">
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={getVideoEmbedUrl(post.videoUrl)}
                title={post.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Video Description */}
            {post.videoDescription && (
              <div className="mt-6 p-6 bg-linen-300 rounded-xl">
                <p className="text-espresso-900 text-lg leading-relaxed">
                  {post.videoDescription}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Rich Text Content */}
        {isRichTextBlogPost(post) && (
          <>
            {/* Rich Text Body */}
            {post.content && (
              <div 
                className="prose prose-lg max-w-none mb-10
                  prose-headings:font-serif prose-headings:text-linen-100
                  prose-p:text-linen-300 prose-p:leading-relaxed
                  prose-a:text-gold-500 prose-a:no-underline hover:prose-a:text-gold-400
                  prose-strong:text-linen-100
                  prose-blockquote:border-gold-500 prose-blockquote:text-linen-300/80 prose-blockquote:italic
                  prose-ul:text-linen-300 prose-ol:text-linen-300
                  prose-li:marker:text-gold-500"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Image Gallery */}
            {post.galleryImages && post.galleryImages.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-serif text-linen-100 mb-6 flex items-center gap-3">
                  <ImageIcon className="w-6 h-6 text-gold-500" />
                  Galeri
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {post.galleryImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => openLightbox(index)}
                      className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={image}
                        alt={`${post.title} - Görsel ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-olive-800/0 group-hover:bg-olive-800/40 transition-colors flex items-center justify-center">
                        <span className="text-linen-100 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                          Büyüt
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-mist-300/20">
            <h3 className="text-sm font-medium text-linen-300/60 mb-3">Etiketler</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-olive-700 text-linen-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-mist-300/20">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-olive-800 rounded-lg font-medium hover:bg-gold-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tüm Yazılar
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && galleryImages.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-olive-900/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-linen-300 hover:text-linen-100 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
            className="absolute left-4 p-2 text-linen-300 hover:text-linen-100 transition-colors"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          
          <img
            src={galleryImages[selectedImageIndex]}
            alt={`${post.title} - Görsel ${selectedImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          
          <button
            onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
            className="absolute right-4 p-2 text-linen-300 hover:text-linen-100 transition-colors"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-linen-300 text-sm">
            {selectedImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
