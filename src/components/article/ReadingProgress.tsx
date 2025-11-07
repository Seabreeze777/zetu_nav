'use client';

import { useState, useEffect } from 'react';

/**
 * 阅读进度条组件
 * 显示在页面顶部，随滚动显示阅读进度
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 计算阅读进度
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const scrollableDistance = documentHeight - windowHeight;
      const scrollPercentage = (scrollTop / scrollableDistance) * 100;

      setProgress(Math.min(scrollPercentage, 100));
    };

    // 监听滚动事件
    window.addEventListener('scroll', handleScroll);
    
    // 初始化
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-transform duration-300 z-50"
      style={{
        transform: `scaleX(${progress / 100})`,
        transformOrigin: 'left',
      }}
    />
  );
}

