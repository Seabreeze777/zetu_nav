/**
 * 文章详情页
 * 路由：/posts/[slug]
 */

import { notFound } from 'next/navigation'
import ArticleLayout from '@/components/article/ArticleLayout'
import ArticleHeader from '@/components/article/ArticleHeader'
import ArticleContent from '@/components/article/ArticleContent'
import ArticleTOC from '@/components/article/ArticleTOC'
import RelatedPosts from '@/components/article/RelatedPosts'
import Breadcrumb from '@/components/common/Breadcrumb'
import { prisma } from '@/lib/prisma'
import { slug as slugger } from 'github-slugger'
import { formatDateTime } from '@/lib/date-format'

// 生成静态路径
export async function generateStaticParams() {
  const articles = await prisma.article.findMany({
    where: { isPublished: true },
    select: { slug: true },
  })
  
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

// 生成元数据
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, isPublished: true },
    select: { title: true, description: true },
  })
  
  if (!article) {
    return {
      title: '文章不存在',
    }
  }

  return {
    title: `${article.title} | 泽途网`,
    description: article.description,
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: {
      slug: params.slug,
      isPublished: true,
    },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
          icon: true,
        },
      },
      tags: {
        include: {
          tag: {
            select: {
              name: true,
              slug: true,
              color: true,
            },
          },
        },
      },
    },
  })

  if (!article) {
    notFound()
  }

  // 增加浏览量（后台处理，不等待）
  prisma.article.update({
    where: { id: article.id },
    data: { views: { increment: 1 } },
  }).catch(console.error)

  // 获取相关文章
  const relatedArticlesRaw = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      isPublished: true,
      id: { not: article.id },
    },
    orderBy: { views: 'desc' },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      coverImage: true,
      author: true,
      views: true,
      readTime: true,
      publishedAt: true,
    },
  })

  // ✅ 转换 Date 为 string
  const relatedArticles = relatedArticlesRaw.map(article => ({
    ...article,
    publishedAt: article.publishedAt?.toISOString() || null,
  }))

  // 提取目录（从Markdown内容中）
  const headings = extractHeadings(article.content)

  return (
    <ArticleLayout>
      {/* 左侧：目录导航 - ✅ 悬浮定位 */}
      <aside className="hidden xl:block">
        <div className="sticky top-20">
          <ArticleTOC headings={headings} />
        </div>
      </aside>

      {/* 中间：文章主体 */}
      <article className="flex-1 min-w-0">
        {/* 面包屑导航 */}
        <Breadcrumb 
          items={[
            { label: '文章中心', href: '/articles' },
            { label: article.category.name, href: '/articles' },
            { label: article.title }
          ]} 
        />
        
        <ArticleHeader
          article={{
            ...article,
            tags: article.tags.map(at => at.tag.name),
            category: article.category.name,
            date: formatDateTime(article.publishedAt),
          } as any} 
        />
        <ArticleContent content={article.content} />
      </article>

      {/* 右侧：相关推荐 - ✅ 悬浮定位 */}
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <RelatedPosts 
            currentSlug={article.slug} 
            category={article.category.slug}
            relatedArticles={relatedArticles}
          />
        </div>
      </aside>
    </ArticleLayout>
  )
}

// 提取Markdown标题并清除markdown语法
function extractHeadings(content: string) {
  const lines = content.split('\n')
  const headings: Array<{ level: number; text: string; id: string }> = []
  
  lines.forEach((line) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      let text = match[2]
      
      // 清除markdown语法
      text = text
        .replace(/\*\*(.+?)\*\*/g, '$1')  // 粗体 **xxx**
        .replace(/\*(.+?)\*/g, '$1')       // 斜体 *xxx*
        .replace(/__(.+?)__/g, '$1')       // 粗体 __xxx__
        .replace(/_(.+?)_/g, '$1')         // 斜体 _xxx_
        .replace(/`(.+?)`/g, '$1')         // 代码 `xxx`
        .replace(/\[(.+?)\]\(.+?\)/g, '$1') // 链接 [xxx](url)
        .replace(/~~(.+?)~~/g, '$1')       // 删除线 ~~xxx~~
        .trim()
      
      // 使用github-slugger生成ID，与rehype-slug保持一致
      const id = slugger(text)
      
      headings.push({ level, text, id })
    }
  })
  
  return headings
}

