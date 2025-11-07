'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ImageWithFallback from '@/components/common/ImageWithFallback';

interface Website {
  id: number;
  name: string;
  description: string;
  url: string;
  logo: string;
  category: {
    name: string;
    slug: string;
  };
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  viewCount: number;
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
}

interface SearchResults {
  query: string;
  websites: Website[];
  articles: Article[];
  total: {
    websites: number;
    articles: number;
    all: number;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || 'all';

  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState(typeParam);

  // 执行搜索
  useEffect(() => {
    const performSearch = async () => {
      if (!q) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${activeType}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error('搜索失败:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [q, activeType]);

  // 网站点击追踪
  const handleWebsiteClick = async (id: number) => {
    try {
      await fetch(`/api/websites/${id}/click`, { method: 'POST' });
    } catch (error) {
      console.error('记录点击失败:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 搜索头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            搜索结果
          </h1>
          {q && (
            <p className="text-gray-600">
              关键词：<span className="font-medium text-gray-900">{q}</span>
              {results && (
                <span className="ml-4 text-sm">
                  找到 <strong>{results.total.all}</strong> 条结果
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!q ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">请输入搜索关键词</h2>
            <p className="text-gray-600">使用顶部搜索框开始搜索</p>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">搜索中...</p>
          </div>
        ) : !results || results.total.all === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">未找到相关内容</h2>
            <p className="text-gray-600">试试其他关键词吧</p>
          </div>
        ) : (
          <div>
            {/* Tab 切换 */}
            <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveType('all')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeType === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                全部 ({results.total.all})
              </button>
              <button
                onClick={() => setActiveType('website')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeType === 'website'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                网站 ({results.total.websites})
              </button>
              <button
                onClick={() => setActiveType('article')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeType === 'article'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                文章 ({results.total.articles})
              </button>
            </div>

            {/* 网站结果 */}
            {(activeType === 'all' || activeType === 'website') && results.websites.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  🌐 网站 ({results.websites.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.websites.map((website) => (
                    <a
                      key={website.id}
                      href={website.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleWebsiteClick(website.id)}
                      className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow border border-gray-200"
                    >
                      <div className="flex items-start gap-3">
                        <ImageWithFallback
                          src={website.logo}
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
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {website.category.name}
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* 文章结果 */}
            {(activeType === 'all' || activeType === 'article') && results.articles.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  📝 文章 ({results.articles.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/posts/${article.slug}`}
                      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
                    >
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
                          {article.excerpt}
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
                          <div className="flex items-center gap-3">
                            <span>👁️ {article.viewCount}</span>
                            <span>⏱️ {article.readTime}分钟</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

