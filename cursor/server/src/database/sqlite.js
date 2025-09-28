import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SQLiteDatabase {
  constructor() {
    this.db = null;
    this.isConnected = false;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, '../../data/aggregation_platform.db');
      
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('SQLite连接失败:', err);
          reject(err);
        } else {
          console.log('SQLite连接成功');
          this.isConnected = true;
          this.initTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async initTables() {
    const createTables = `
      -- 用户表
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('product_manager', 'project_manager', 'delivery_manager', 'developer', 'tester', 'designer')),
        department TEXT,
        skills TEXT DEFAULT '[]',
        phone TEXT,
        avatar TEXT,
        is_active BOOLEAN DEFAULT 1,
        last_active DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- 项目表
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        budget DECIMAL(15,2),
        actual_cost DECIMAL(15,2) DEFAULT 0,
        progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
        status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'testing', 'completed', 'cancelled')),
        manager_id INTEGER,
        risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
        quality_score DECIMAL(3,2) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (manager_id) REFERENCES users(id)
      );

      -- 应用表
      CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        version TEXT,
        status TEXT DEFAULT 'development' CHECK (status IN ('development', 'testing', 'production', 'maintenance')),
        project_id INTEGER,
        repository_url TEXT,
        deployment_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id)
      );

      -- 性能指标表
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER,
        metric_name TEXT NOT NULL,
        metric_value DECIMAL(10,4) NOT NULL,
        metric_unit TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (application_id) REFERENCES applications(id)
      );

      -- 错误日志表
      CREATE TABLE IF NOT EXISTS error_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER,
        error_type TEXT NOT NULL,
        error_message TEXT NOT NULL,
        stack_trace TEXT,
        filename TEXT,
        line_number INTEGER,
        column_number INTEGER,
        user_agent TEXT,
        url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (application_id) REFERENCES applications(id)
      );

      -- 人员评价表
      CREATE TABLE IF NOT EXISTS evaluations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        evaluator_id INTEGER,
        technical_ability INTEGER CHECK (technical_ability >= 1 AND technical_ability <= 5),
        work_attitude INTEGER CHECK (work_attitude >= 1 AND work_attitude <= 5),
        teamwork INTEGER CHECK (teamwork >= 1 AND teamwork <= 5),
        project_contribution INTEGER CHECK (project_contribution >= 1 AND project_contribution <= 5),
        knowledge_sharing INTEGER CHECK (knowledge_sharing >= 1 AND knowledge_sharing <= 5),
        overall_score DECIMAL(3,2),
        comments TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (evaluator_id) REFERENCES users(id)
      );

      -- 人员流动表
      CREATE TABLE IF NOT EXISTS personnel_movements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        movement_type TEXT NOT NULL CHECK (movement_type IN ('transfer', 'promotion', 'demotion', 'resignation', 'hire')),
        from_project_id INTEGER,
        to_project_id INTEGER,
        reason TEXT,
        effective_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (from_project_id) REFERENCES projects(id),
        FOREIGN KEY (to_project_id) REFERENCES projects(id)
      );

      -- 创建索引
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_projects_manager ON projects(manager_id);
      CREATE INDEX IF NOT EXISTS idx_applications_project ON applications(project_id);
      CREATE INDEX IF NOT EXISTS idx_performance_metrics_app ON performance_metrics(application_id);
      CREATE INDEX IF NOT EXISTS idx_performance_metrics_time ON performance_metrics(timestamp);
      CREATE INDEX IF NOT EXISTS idx_error_logs_app ON error_logs(application_id);
      CREATE INDEX IF NOT EXISTS idx_error_logs_time ON error_logs(created_at);
    `;

    return new Promise((resolve, reject) => {
      this.db.exec(createTables, (err) => {
        if (err) {
          console.error('创建表失败:', err);
          reject(err);
        } else {
          console.log('数据库表初始化完成');
          resolve();
        }
      });
    });
  }

  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve({ rows, rowCount: rows.length });
        }
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ 
            lastID: this.lastID, 
            changes: this.changes,
            rowCount: this.changes 
          });
        }
      });
    });
  }

  close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('关闭数据库连接失败:', err);
          } else {
            console.log('数据库连接已关闭');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

export default new SQLiteDatabase();
