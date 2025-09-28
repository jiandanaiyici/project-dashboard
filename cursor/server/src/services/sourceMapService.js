import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SourceMapService {
  constructor() {
    this.sourceMapCache = new Map();
    this.sourceMapDir = path.join(__dirname, '../../uploads/sourcemaps');
    this.ensureSourceMapDir();
  }

  // 确保Source Map目录存在
  async ensureSourceMapDir() {
    try {
      await fs.access(this.sourceMapDir);
    } catch (error) {
      await fs.mkdir(this.sourceMapDir, { recursive: true });
      logger.info('Source Map目录已创建:', this.sourceMapDir);
    }
  }

  // 上传Source Map文件
  async uploadSourceMap(applicationId, version, sourceMapData) {
    try {
      const fileName = `${applicationId}-${version}.map`;
      const filePath = path.join(this.sourceMapDir, fileName);
      
      await fs.writeFile(filePath, JSON.stringify(sourceMapData, null, 2));
      
      // 缓存Source Map
      this.sourceMapCache.set(fileName, sourceMapData);
      
      logger.info(`Source Map上传成功: ${fileName}`);
      
      return {
        success: true,
        fileName,
        filePath
      };
    } catch (error) {
      logger.error('Source Map上传失败:', error);
      throw error;
    }
  }

  // 获取Source Map
  async getSourceMap(applicationId, version) {
    const fileName = `${applicationId}-${version}.map`;
    
    // 先从缓存获取
    if (this.sourceMapCache.has(fileName)) {
      return this.sourceMapCache.get(fileName);
    }

    try {
      const filePath = path.join(this.sourceMapDir, fileName);
      const sourceMapData = JSON.parse(await fs.readFile(filePath, 'utf8'));
      
      // 缓存Source Map
      this.sourceMapCache.set(fileName, sourceMapData);
      
      return sourceMapData;
    } catch (error) {
      logger.warn(`Source Map文件不存在: ${fileName}`);
      return null;
    }
  }

  // 映射错误到源码位置
  async mapError(applicationId, version, filename, line, column) {
    try {
      const sourceMap = await this.getSourceMap(applicationId, version);
      if (!sourceMap) {
        return null;
      }

      // 查找对应的源文件
      const sourceFile = this.findSourceFile(sourceMap, filename);
      if (!sourceFile) {
        return null;
      }

      // 映射位置
      const mapping = this.findMapping(sourceMap, sourceFile, line, column);
      if (!mapping) {
        return null;
      }

      return {
        source: mapping.source,
        line: mapping.originalLine,
        column: mapping.originalColumn,
        name: mapping.name
      };
    } catch (error) {
      logger.error('Source Map映射失败:', error);
      return null;
    }
  }

  // 查找源文件
  findSourceFile(sourceMap, filename) {
    if (!sourceMap.sources || !sourceMap.sourcesContent) {
      return null;
    }

    const sourceIndex = sourceMap.sources.findIndex(source => 
      source.includes(path.basename(filename))
    );

    if (sourceIndex === -1) {
      return null;
    }

    return {
      index: sourceIndex,
      source: sourceMap.sources[sourceIndex],
      content: sourceMap.sourcesContent[sourceIndex]
    };
  }

  // 查找映射位置
  findMapping(sourceMap, sourceFile, line, column) {
    if (!sourceMap.mappings) {
      return null;
    }

    // 解析mappings字符串
    const mappings = this.parseMappings(sourceMap.mappings);
    
    // 查找最接近的映射
    let bestMapping = null;
    let minDistance = Infinity;

    for (const mapping of mappings) {
      if (mapping.sourceIndex === sourceFile.index) {
        const distance = Math.abs(mapping.generatedLine - line) + 
                        Math.abs(mapping.generatedColumn - column);
        
        if (distance < minDistance) {
          minDistance = distance;
          bestMapping = mapping;
        }
      }
    }

    return bestMapping;
  }

  // 解析mappings字符串
  parseMappings(mappingsString) {
    const mappings = [];
    const lines = mappingsString.split(';');
    let generatedLine = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line) {
        generatedLine++;
        continue;
      }

      const segments = line.split(',');
      let generatedColumn = 0;
      let sourceIndex = 0;
      let sourceLine = 0;
      let sourceColumn = 0;
      let nameIndex = 0;

      for (const segment of segments) {
        const decoded = this.decodeVLQ(segment);
        
        if (decoded.length === 1) {
          // 只有生成列
          generatedColumn += decoded[0];
        } else if (decoded.length === 4) {
          // 生成列、源索引、源行、源列
          generatedColumn += decoded[0];
          sourceIndex += decoded[1];
          sourceLine += decoded[2];
          sourceColumn += decoded[3];
        } else if (decoded.length === 5) {
          // 生成列、源索引、源行、源列、名称索引
          generatedColumn += decoded[0];
          sourceIndex += decoded[1];
          sourceLine += decoded[2];
          sourceColumn += decoded[3];
          nameIndex += decoded[4];
        }

        mappings.push({
          generatedLine,
          generatedColumn,
          sourceIndex,
          sourceLine,
          sourceColumn,
          nameIndex
        });
      }

      generatedLine++;
    }

    return mappings;
  }

  // 解码VLQ (Variable Length Quantity)
  decodeVLQ(str) {
    const result = [];
    let shift = 0;
    let value = 0;

    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      const digit = this.base64ToInt(c);
      
      value += (digit & 0x1f) << shift;
      
      if (digit & 0x20) {
        shift += 5;
      } else {
        const sign = value & 1 ? -1 : 1;
        value = (value >> 1) * sign;
        result.push(value);
        value = 0;
        shift = 0;
      }
    }

    return result;
  }

  // Base64字符转整数
  base64ToInt(c) {
    if (c >= 'A' && c <= 'Z') return c.charCodeAt(0) - 'A'.charCodeAt(0);
    if (c >= 'a' && c <= 'z') return c.charCodeAt(0) - 'a'.charCodeAt(0) + 26;
    if (c >= '0' && c <= '9') return c.charCodeAt(0) - '0'.charCodeAt(0) + 52;
    if (c === '+') return 62;
    if (c === '/') return 63;
    return 0;
  }

  // 获取源码内容
  async getSourceContent(applicationId, version, sourcePath) {
    try {
      const sourceMap = await this.getSourceMap(applicationId, version);
      if (!sourceMap || !sourceMap.sources || !sourceMap.sourcesContent) {
        return null;
      }

      const sourceIndex = sourceMap.sources.findIndex(source => 
        source.includes(path.basename(sourcePath))
      );

      if (sourceIndex === -1) {
        return null;
      }

      return sourceMap.sourcesContent[sourceIndex];
    } catch (error) {
      logger.error('获取源码内容失败:', error);
      return null;
    }
  }

  // 清理过期的Source Map文件
  async cleanupExpiredSourceMaps(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30天
    try {
      const files = await fs.readdir(this.sourceMapDir);
      const now = Date.now();

      for (const file of files) {
        if (!file.endsWith('.map')) continue;

        const filePath = path.join(this.sourceMapDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          this.sourceMapCache.delete(file);
          logger.info(`清理过期Source Map文件: ${file}`);
        }
      }
    } catch (error) {
      logger.error('清理Source Map文件失败:', error);
    }
  }

  // 获取Source Map统计信息
  async getSourceMapStats() {
    try {
      const files = await fs.readdir(this.sourceMapDir);
      const mapFiles = files.filter(file => file.endsWith('.map'));
      
      let totalSize = 0;
      const stats = {
        totalFiles: mapFiles.length,
        totalSize: 0,
        files: []
      };

      for (const file of mapFiles) {
        const filePath = path.join(this.sourceMapDir, file);
        const fileStats = await fs.stat(filePath);
        
        totalSize += fileStats.size;
        stats.files.push({
          name: file,
          size: fileStats.size,
          modified: fileStats.mtime
        });
      }

      stats.totalSize = totalSize;
      return stats;
    } catch (error) {
      logger.error('获取Source Map统计信息失败:', error);
      return null;
    }
  }
}

export default new SourceMapService();
