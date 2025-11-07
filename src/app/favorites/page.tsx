'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import ImageWithFallback from '@/components/common/ImageWithFallback';

interface Website {
  id: number;
  name: string;
  description: string;
  url: string;
  logoUrl: string;
  category: {
    name: string;
    slug: string;
  };
  favoritedAt: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  views: number;
  readTime: number;
  publishedAt: string;
  category: {
    name: string;
    slug: string;
  };
  tags: Array<{
    name: string;
    slug: string;
    color: string;
  }>;
  favoritedAt: string;
}

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState<'websites' | 'articles'>('websites');
  const [websites, setWebsites] = useState<Website[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // 检查登录状态
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login?redirect=/favorites');
    }
  }, [user, userLoading, router]);

  // 加载收藏数据
  useEffect(() => {
    if (!user) return;

    const loadFavorites = async () => {
      setLoading(true);
      try {
        // 加载网站收藏
        const websitesRes = await fetch('/api/favorites/websites');
        if (websitesRes.ok) {
          const websitesData = await websitesRes.json();
          setWebsites(websitesData);
        }

        // 加载文章收藏
        const articlesRes = await fetch('/api/favorites/articles');
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          setArticles(articlesData);
        }
      } catch (error) {
        console.error('加载收藏失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  // 取消收藏网站
  const handleUnfavoriteWebsite = async (id: number) => {
    try {
      const response = await fetch(`/api/favorites/websites/${id}`, {
        method: 'POST'
      });

      if (response.ok) {
        setWebsites(websites.filter(w => w.id !== id));
      }
    } catch (error) {
      console.error('取消收藏失败:', error);
    }
  };

  // 取消收藏文章
  const handleUnfavoriteArticle = async (id: number) => {
    try {
      const response = await fetch(`/api/favorites/articles/${id}`, {
        method: 'POST'
      });

      if (response.ok) {
        setArticles(articles.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('取消收藏失败:', error);
    }
  };

  // 网站点击追踪
  const handleWebsiteClick = async (id: number) => {
    try {
      await fetch(`/api/websites/${id}/click`, { method: 'POST' });
    } catch (error) {
      console.error('记录点击失败:', error);
    }
  };

  if (userLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页头 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的收藏</h1>
          <p className="text-gray-600">
            共收藏了 {websites.length} 个网站和 {articles.length} 篇文章
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab 切换 */}
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('websites')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'websites'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            网站收藏 ({websites.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'articles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            文章收藏 ({articles.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        ) : (
          <>
            {/* 网站收藏列表 */}
            {activeTab === 'websites' && (
              <div>
                {websites.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📌</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">暂无收藏的网站</h2>
                    <p className="text-gray-600 mb-6">快去首页收藏你喜欢的网站吧</p>
                    <Link
                      href="/"
                      className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      去首页看看
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {websites.map((website) => (
                      <div
                        key={website.id}
                        className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow relative group"
                      >
                        {/* 取消收藏按钮 */}
                        <button
                          onClick={() => handleUnfavoriteWebsite(website.id)}
                          className="absolute top-2 right-2 p-2 bg-red-50 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                          title="取消收藏"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                        </button>

                        <a
                          href={website.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleWebsiteClick(website.id)}
                          className="flex items-start gap-3"
                        >
                          <ImageWithFallback
                            src={website.logoUrl}
                            alt={website.name}
                            className="w-12 h-12 rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate mb-1">
                              {website.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {website.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">
                                {website.category.name}
                              </span>
                              <span>
                                {new Date(website.favoritedAt).toLocaleDateString('zh-CN')}
                              </span>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 文章收藏列表 */}
            {activeTab === 'articles' && (
              <div>
                {articles.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📖</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">暂无收藏的文章</h2>
                    <p className="text-gray-600 mb-6">去文章列表收藏你喜欢的文章吧</p>
                    <Link
                      href="/articles"
                      className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      去看文章
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                      <div
                        key={article.id}
                        className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow relative group"
                      >
                        {/* 取消收藏按钮 */}
                        <button
                          onClick={() => handleUnfavoriteArticle(article.id)}
                          className="absolute top-2 right-2 z-10 p-2 bg-red-50 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                          title="取消收藏"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                        </button>

                        <Link href={`/posts/${article.slug}`}>
                          {article.coverImage && (
                            <ImageWithFallback
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {article.description}
                            </p>

                            {/* 标签 */}
                            {article.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {article.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag.slug}
                                    className="text-xs px-2 py-1 rounded text-white"
                                    style={{ backgroundColor: tag.color }}
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* 元信息 */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="px-2 py-1 bg-gray-100 rounded">
                                {article.category.name}
                              </span>
                              <span>
                                {new Date(article.favoritedAt).toLocaleDateString('zh-CN')}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

