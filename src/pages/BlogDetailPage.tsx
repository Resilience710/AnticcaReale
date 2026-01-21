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
      <div className="min-h-screen bg-linen-300 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-espresso-900 mb-4">Blog yazısı bulunamadı</h1>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 transition-colors"
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
    <div className="min-h-screen bg-linen-300">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Blog'a Dön
          </Link>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Type Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500 text-espresso-900 rounded-full text-sm font-medium mb-4">
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
            
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-4 drop-shadow-lg">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4 text-white/90 text-sm">
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
              <div className="mt-6 p-6 bg-linen-200 rounded-xl border border-mist-300">
                <p className="text-espresso-800 text-lg leading-relaxed">
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
              <div className="bg-linen-200 rounded-xl p-6 md:p-8 mb-10 border border-mist-300">
                <div 
                  className="prose prose-lg max-w-none
                    prose-headings:font-serif prose-headings:text-espresso-900
                    prose-p:text-espresso-800 prose-p:leading-relaxed
                    prose-a:text-gold-700 prose-a:no-underline hover:prose-a:text-gold-600
                    prose-strong:text-espresso-900 prose-strong:font-semibold
                    prose-blockquote:border-gold-500 prose-blockquote:text-espresso-700 prose-blockquote:italic prose-blockquote:bg-linen-100 prose-blockquote:rounded-lg prose-blockquote:py-2 prose-blockquote:px-4
                    prose-ul:text-espresso-800 prose-ol:text-espresso-800
                    prose-li:marker:text-gold-600
                    prose-code:text-espresso-900 prose-code:bg-linen-100 prose-code:px-1 prose-code:rounded
                    prose-pre:bg-espresso-900 prose-pre:text-linen-100"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            )}

            {/* Image Gallery */}
            {post.galleryImages && post.galleryImages.length > 0 && (
              <div className="mt-12 bg-linen-200 rounded-xl p-6 border border-mist-300">
                <h2 className="text-2xl font-serif text-espresso-900 mb-6 flex items-center gap-3">
                  <ImageIcon className="w-6 h-6 text-gold-600" />
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
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
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
          <div className="mt-12 pt-8 border-t border-mist-300">
            <h3 className="text-sm font-medium text-espresso-600 mb-3">Etiketler</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-linen-200 text-espresso-700 border border-mist-300 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-mist-300">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-espresso-900 rounded-lg font-medium hover:bg-gold-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tüm Yazılar
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && galleryImages.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
            className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors"
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
            className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
