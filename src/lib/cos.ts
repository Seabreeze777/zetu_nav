/**
 * 腾讯云 COS 对象存储工具库
 * 
 * 功能：
 * - 上传文件到COS
 * - 删除COS文件
 * - 获取文件访问URL
 * 
 * 配置优先级：数据库配置 > 环境变量
 */

import COS from 'cos-nodejs-sdk-v5';
import { getConfig } from './config';

// COS 实例（延迟初始化，支持从数据库读取配置）
let cosInstance: COS | null = null;
let bucketCache: string | null = null;
let regionCache: string | null = null;

/**
 * 获取 COS 实例（支持从数据库配置读取）
 */
async function getCosInstance(): Promise<COS> {
  if (cosInstance) {
    return cosInstance;
  }

  // 从数据库或环境变量读取配置
  const secretId = await getConfig('cos', 'COS_SECRET_ID') || process.env.COS_SECRET_ID;
  const secretKey = await getConfig('cos', 'COS_SECRET_KEY') || process.env.COS_SECRET_KEY;

  if (!secretId || !secretKey) {
    throw new Error('COS配置缺失：请在系统配置中设置 SecretId 和 SecretKey');
  }

  cosInstance = new COS({
    SecretId: secretId,
    SecretKey: secretKey,
  });

  return cosInstance;
}

/**
 * 获取 Bucket 配置
 */
async function getBucket(): Promise<string> {
  if (bucketCache) return bucketCache;
  const bucket = await getConfig('cos', 'COS_BUCKET') || process.env.COS_BUCKET;
  if (!bucket) {
    throw new Error('COS配置缺失：请在系统配置中设置 Bucket');
  }
  bucketCache = bucket;
  return bucket;
}

/**
 * 获取 Region 配置
 */
async function getRegion(): Promise<string> {
  if (regionCache) return regionCache;
  const region = await getConfig('cos', 'COS_REGION') || process.env.COS_REGION;
  if (!region) {
    throw new Error('COS配置缺失：请在系统配置中设置 Region');
  }
  regionCache = region;
  return region;
}

/**
 * 上传文件到COS
 * @param file 文件Buffer
 * @param fileName 文件名
 * @param folder 文件夹（默认：uploads）
 * @returns { key, url } COS对象键和访问URL
 */
export async function uploadToCOS(
  file: Buffer,
  fileName: string,
  folder: string = 'uploads'
): Promise<{ key: string; url: string }> {
  const cos = await getCosInstance();
  const bucket = await getBucket();
  const region = await getRegion();

  // 生成唯一文件名
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = fileName.split('.').pop();
  const uniqueFileName = `${timestamp}-${random}.${ext}`;
  const key = `${folder}/${uniqueFileName}`;

  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: key,
        Body: file,
        ContentType: getMimeType(fileName),
      },
      (err, data) => {
        if (err) {
          console.error('❌ COS上传失败:', err);
          reject(err);
        } else {
          // 生成签名URL（私有读写模式）
          const signedUrl = cos.getObjectUrl({
            Bucket: bucket,
            Region: region,
            Key: key,
            Sign: true,
            Expires: 86400, // 24小时
          });
          
          console.log('✅ COS上传成功，生成签名URL');
          resolve({ key, url: signedUrl });
        }
      }
    );
  });
}

/**
 * 获取文件的签名访问URL
 * @param key COS对象键
 * @param expires 过期时间（秒），默认1小时
 * @returns 签名URL
 */
export async function getSignedUrl(key: string, expires: number = 3600): Promise<string> {
  const cos = await getCosInstance();
  const bucket = await getBucket();
  const region = await getRegion();

  return cos.getObjectUrl({
    Bucket: bucket,
    Region: region,
    Key: key,
    Sign: true,
    Expires: expires,
  });
}

/**
 * 从COS删除文件
 * @param key COS对象键
 */
export async function deleteFromCOS(key: string): Promise<void> {
  const cos = await getCosInstance();
  const bucket = await getBucket();
  const region = await getRegion();

  return new Promise((resolve, reject) => {
    cos.deleteObject(
      {
        Bucket: bucket,
        Region: region,
        Key: key,
      },
      (err, data) => {
        if (err) {
          console.error('❌ COS删除失败:', err);
          reject(err);
        } else {
          console.log('✅ COS删除成功:', key);
          resolve();
        }
      }
    );
  });
}

/**
 * 批量删除COS文件
 * @param keys COS对象键数组
 */
export async function batchDeleteFromCOS(keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  const cos = await getCosInstance();
  const bucket = await getBucket();
  const region = await getRegion();

  return new Promise((resolve, reject) => {
    cos.deleteMultipleObject(
      {
        Bucket: bucket,
        Region: region,
        Objects: keys.map(key => ({ Key: key })),
      },
      (err, data) => {
        if (err) {
          console.error('❌ COS批量删除失败:', err);
          reject(err);
        } else {
          console.log('✅ COS批量删除成功:', keys.length, '个文件');
          resolve();
        }
      }
    );
  });
}

/**
 * 获取文件的MIME类型
 */
function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    // 图片
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    // 视频
    mp4: 'video/mp4',
    webm: 'video/webm',
    // 文档
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // 压缩包
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

/**
 * 获取图片尺寸信息
 */
export async function getImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number } | null> {
  try {
    const sharp = require('sharp');
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  } catch (error) {
    console.error('获取图片尺寸失败:', error);
    return null;
  }
}
