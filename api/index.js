"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// apps/api/src/vercel/handler.ts
var handler_exports = {};
__export(handler_exports, {
  default: () => handler_default
});
module.exports = __toCommonJS(handler_exports);

// apps/api/src/vercel/bootstrap.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var RUNTIME_DB = "/tmp/vestige.sqlite";
var SEED_CANDIDATES = [
  import_path.default.join(process.cwd(), "apps/api/data/seed.sqlite"),
  import_path.default.join(process.cwd(), "data/seed.sqlite")
];
try {
  if (!import_fs.default.existsSync(RUNTIME_DB)) {
    const seed = SEED_CANDIDATES.find((candidate) => import_fs.default.existsSync(candidate));
    if (seed) import_fs.default.copyFileSync(seed, RUNTIME_DB);
  }
} catch {
}
process.env.DB_CLIENT = process.env.DB_CLIENT || "sqlite3";
process.env.DB_FILENAME = process.env.DB_FILENAME || RUNTIME_DB;

// apps/api/src/app.ts
var import_express12 = __toESM(require("express"));
var import_path4 = __toESM(require("path"));
var import_cors = __toESM(require("cors"));
var import_helmet = __toESM(require("helmet"));
var import_cookie_parser = __toESM(require("cookie-parser"));

// apps/api/src/core/config/env.ts
var import_dotenv = __toESM(require("dotenv"));
var import_zod = require("zod");
import_dotenv.default.config();
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "production", "test"]).default("development"),
  PORT: import_zod.z.coerce.number().default(4e3),
  API_PREFIX: import_zod.z.string().default("/api/v1"),
  DB_CLIENT: import_zod.z.enum(["sqlite3", "pg"]).default("sqlite3"),
  DB_FILENAME: import_zod.z.string().default("./data/vestige.dev.sqlite"),
  DB_HOST: import_zod.z.string().optional(),
  DB_PORT: import_zod.z.coerce.number().optional(),
  DB_USER: import_zod.z.string().optional(),
  DB_PASSWORD: import_zod.z.string().optional(),
  DB_NAME: import_zod.z.string().optional(),
  JWT_ACCESS_SECRET: import_zod.z.string().min(16).default("super-secret-access-key-change-in-production-32chars"),
  JWT_REFRESH_SECRET: import_zod.z.string().min(16).default("super-secret-refresh-key-change-in-production-32chars"),
  JWT_ACCESS_EXPIRES_IN: import_zod.z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: import_zod.z.string().default("7d"),
  LOG_LEVEL: import_zod.z.string().default("info"),
  QR_HMAC_SECRET: import_zod.z.string().default("vestige-qr-signing-secret-key-32chars")
});
var env = envSchema.parse(process.env);

// apps/api/src/core/logger/request-id.middleware.ts
var import_uuid = require("uuid");

// apps/api/src/core/logger/index.ts
var import_pino = __toESM(require("pino"));
var import_async_hooks = require("async_hooks");
var asyncLocalStorage = new import_async_hooks.AsyncLocalStorage();
var logger = (0, import_pino.default)({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === "development" ? { target: "pino-pretty", options: { colorize: true } } : void 0,
  redact: {
    paths: ["password", "token", "authorization", "qr_payload", "payload.password", "headers.authorization"],
    censor: "[REDACTED]"
  },
  mixin() {
    const store = asyncLocalStorage.getStore();
    return store ? { requestId: store.requestId } : {};
  }
});

// apps/api/src/core/logger/request-id.middleware.ts
function requestIdMiddleware(req, res, next) {
  const requestId = req.headers["x-request-id"] || (0, import_uuid.v4)();
  res.setHeader("X-Request-Id", requestId);
  req.requestId = requestId;
  asyncLocalStorage.run({ requestId }, () => {
    const start = Date.now();
    res.on("finish", () => {
      const durationMs = Date.now() - start;
      logger.info({
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs
      }, `${req.method} ${req.originalUrl} finished in ${durationMs}ms`);
    });
    next();
  });
}

// apps/api/src/core/errors/app-error.ts
var AppError = class _AppError extends Error {
  statusCode;
  code;
  details;
  constructor(message, statusCode = 400, code = "BAD_REQUEST", details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
  static badRequest(message = "Requ\xEAte invalide", code = "BAD_REQUEST", details) {
    return new _AppError(message, 400, code, details);
  }
  static unauthorized(message = "Acc\xE8s non autoris\xE9", code = "UNAUTHORIZED") {
    return new _AppError(message, 401, code);
  }
  static forbidden(message = "Permission refus\xE9e", code = "FORBIDDEN") {
    return new _AppError(message, 403, code);
  }
  static notFound(message = "Ressource introuvable", code = "NOT_FOUND") {
    return new _AppError(message, 404, code);
  }
  static conflict(message = "Conflit de ressource", code = "CONFLICT") {
    return new _AppError(message, 409, code);
  }
};

// apps/api/src/core/errors/error-handler.ts
var import_zod2 = require("zod");
function errorHandler(err, req, res, _next) {
  const requestId = req.requestId;
  if (err instanceof AppError) {
    logger.warn({ err, requestId }, `[${err.code}] ${err.message}`);
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        requestId
      }
    });
  }
  if (err instanceof import_zod2.ZodError) {
    logger.warn({ err: err.errors, requestId }, `[VALIDATION_ERROR] Request validation failed`);
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Donn\xE9es de requ\xEAte invalides",
        details: err.errors,
        requestId
      }
    });
  }
  logger.error({ err, requestId }, `[INTERNAL_SERVER_ERROR] ${err.message || "Une erreur inattendue est survenue"}`);
  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Erreur interne du serveur",
      requestId
    }
  });
}

// apps/api/src/modules/auth/auth.routes.ts
var import_express = require("express");

// apps/api/src/modules/auth/auth.service.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_uuid4 = require("uuid");

// apps/api/src/core/database/knex.ts
var import_knex = __toESM(require("knex"));
var import_objection = require("objection");

// apps/api/knexfile.ts
var import_path2 = __toESM(require("path"));
var import_fs2 = __toESM(require("fs"));
var import_dotenv2 = __toESM(require("dotenv"));
import_dotenv2.default.config();
var dbClient = process.env.DB_CLIENT || "sqlite3";
var dbPath = process.env.DB_FILENAME || import_path2.default.join(__dirname, "data/vestige.dev.sqlite");
var dbDir = import_path2.default.dirname(dbPath);
try {
  if (!import_fs2.default.existsSync(dbDir)) import_fs2.default.mkdirSync(dbDir, { recursive: true });
} catch {
}
var config = {
  development: dbClient === "pg" ? {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "vestige_dev"
    },
    pool: { min: 2, max: 10 },
    migrations: {
      directory: import_path2.default.join(__dirname, "src/migrations"),
      extension: "ts"
    },
    seeds: {
      directory: import_path2.default.join(__dirname, "src/seeds"),
      extension: "ts"
    }
  } : {
    client: "sqlite3",
    connection: {
      filename: dbPath
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, cb) => {
        conn.run("PRAGMA foreign_keys = ON;", cb);
      }
    },
    migrations: {
      directory: import_path2.default.join(__dirname, "src/migrations"),
      extension: "ts"
    },
    seeds: {
      directory: import_path2.default.join(__dirname, "src/seeds"),
      extension: "ts"
    }
  },
  // Production : SQLite par défaut (base seedée copiée dans /tmp au démarrage sur
  // Vercel). Bascule automatique vers Postgres si POSTGRES_URL/DATABASE_URL est
  // présent, sans changer le code.
  production: (() => {
    const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    const usePg = process.env.DB_CLIENT === "pg" || Boolean(url);
    if (usePg) {
      return {
        client: "pg",
        connection: url ? { connectionString: url, ssl: { rejectUnauthorized: false } } : {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
        },
        pool: { min: 0, max: 5 },
        migrations: { directory: import_path2.default.join(__dirname, "src/migrations"), extension: "ts" },
        seeds: { directory: import_path2.default.join(__dirname, "src/seeds"), extension: "ts" }
      };
    }
    return {
      client: "sqlite3",
      connection: { filename: process.env.DB_FILENAME || "/tmp/vestige.sqlite" },
      useNullAsDefault: true,
      pool: {
        afterCreate: (conn, cb) => conn.run("PRAGMA foreign_keys = ON;", cb)
      },
      migrations: { directory: import_path2.default.join(__dirname, "src/migrations"), extension: "ts" },
      seeds: { directory: import_path2.default.join(__dirname, "src/seeds"), extension: "ts" }
    };
  })()
};
var knexfile_default = config;

// apps/api/src/core/database/knex.ts
var environment = env.NODE_ENV === "test" ? "development" : env.NODE_ENV;
var knex = (0, import_knex.default)(knexfile_default[environment] || knexfile_default.development);
import_objection.Model.knex(knex);
logger.info(`Base de donn\xE9es initialis\xE9e avec le dialecte: ${env.DB_CLIENT}`);

// apps/api/src/modules/sponsorship/sponsorship.service.ts
var import_crypto = __toESM(require("crypto"));

// apps/api/src/core/database/base.model.ts
var import_objection2 = require("objection");
var import_uuid2 = require("uuid");
var BaseModel = class extends import_objection2.Model {
  id;
  createdAt;
  updatedAt;
  deletedAt;
  $beforeInsert() {
    if (!this.id) {
      this.id = (0, import_uuid2.v4)();
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }
  $beforeUpdate() {
    this.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  }
  static get idColumn() {
    return "id";
  }
  static get QueryBuilder() {
    return class SoftDeleteQueryBuilder extends import_objection2.QueryBuilder {
      whereNotDeleted() {
        return this.whereNull(`${this.modelClass().tableName}.deleted_at`);
      }
    };
  }
};

// apps/api/src/modules/sponsorship/sponsorship.model.ts
var MemberModel = class _MemberModel extends BaseModel {
  static get tableName() {
    return "members";
  }
  matricule;
  firstName;
  lastName;
  email;
  phone;
  passwordHash;
  status;
  sponsorId;
  treePath;
  treeDepth;
  activatedAt;
  static get relationMappings() {
    return {
      sponsor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: _MemberModel,
        join: {
          from: "members.sponsor_id",
          to: "members.id"
        }
      },
      downline: {
        relation: BaseModel.HasManyRelation,
        modelClass: _MemberModel,
        join: {
          from: "members.id",
          to: "members.sponsor_id"
        }
      }
    };
  }
};
var InvitationModel = class extends BaseModel {
  static get tableName() {
    return "invitations";
  }
  sponsorId;
  targetEmail;
  targetPhone;
  tokenHash;
  status;
  expiresAt;
  usedByMemberId;
  static get relationMappings() {
    return {
      sponsor: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: MemberModel,
        join: {
          from: "invitations.sponsor_id",
          to: "members.id"
        }
      }
    };
  }
};

// apps/api/src/modules/sponsorship/sponsorship.repository.ts
var SponsorshipRepository = class {
  async createInvitation(data) {
    return InvitationModel.query().insert(data);
  }
  async findInvitationByTokenHash(tokenHash) {
    return InvitationModel.query().findOne({ token_hash: tokenHash });
  }
  async markInvitationUsed(id, memberId, trx) {
    await InvitationModel.query(trx).patchAndFetchById(id, {
      status: "used",
      usedByMemberId: memberId,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async findMemberById(id) {
    return MemberModel.query().findById(id);
  }
  async getTreeForMember(rootPath, maxDepth) {
    return MemberModel.query().where("tree_path", "like", `${rootPath}%`).andWhere("tree_depth", "<=", maxDepth).select("id", "first_name", "last_name", "email", "phone", "status", "sponsor_id", "tree_path", "tree_depth", "created_at");
  }
  async getDownlinePaginated(rootPath, page, limit, filters) {
    let query = MemberModel.query().where("tree_path", "like", `${rootPath}%`).andWhereNot("tree_path", rootPath);
    if (filters?.status) {
      query = query.andWhere("status", filters.status);
    }
    if (filters?.search) {
      const term = `%${filters.search.toLowerCase()}%`;
      query = query.andWhere((q) => {
        q.whereRaw("lower(first_name) like ?", [term]).orWhereRaw("lower(last_name) like ?", [term]).orWhereRaw("lower(email) like ?", [term]);
      });
    }
    return query.page(page - 1, limit);
  }
  async getNetworkStats(memberId, rootPath) {
    const rawResult = await knex.raw(`
      WITH RECURSIVE downline AS (
        SELECT id, sponsor_id, tree_depth FROM members WHERE sponsor_id = ?
        UNION ALL
        SELECT m.id, m.sponsor_id, m.tree_depth FROM members m
        INNER JOIN downline d ON m.sponsor_id = d.id
      )
      SELECT COUNT(*) as total, tree_depth FROM downline GROUP BY tree_depth ORDER BY tree_depth ASC
    `, [memberId]);
    const rows = rawResult.rows || rawResult;
    return rows;
  }
};

// apps/api/src/core/events/event-bus.ts
var import_events = require("events");
var EventBus = class extends import_events.EventEmitter {
  emitEvent(event, payload) {
    logger.debug({ event, payload }, `\xC9v\xE9nement \xE9mis: ${event}`);
    return this.emit(event, payload);
  }
};
var eventBus = new EventBus();

// apps/api/src/core/audit/audit.service.ts
var import_uuid3 = require("uuid");
var AuditService = class {
  static async record(options) {
    try {
      const record = {
        id: (0, import_uuid3.v4)(),
        actor_id: options.actorId || "system",
        actor_ip: options.actorIp || "127.0.0.1",
        action: options.action,
        entity_type: options.entityType,
        entity_id: options.entityId || null,
        before_state: options.before ? JSON.stringify(options.before) : null,
        after_state: options.after ? JSON.stringify(options.after) : null,
        request_id: options.requestId || null,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      await knex("audit_logs").insert(record);
      logger.info({ action: options.action, entityType: options.entityType, entityId: options.entityId }, `Audit enregistr\xE9: ${options.action}`);
    } catch (err) {
      logger.error({ err, options }, `\xC9chec de l'enregistrement du journal d'audit`);
    }
  }
};

// apps/api/src/modules/sponsorship/sponsorship.events.ts
var SPONSORSHIP_EVENTS = {
  INVITATION_CREATED: "sponsorship.invitation_created",
  MEMBER_REGISTERED_VIA_SPONSOR: "sponsorship.member_registered"
};

// apps/api/src/modules/sponsorship/sponsorship.service.ts
var SponsorshipService = class {
  repo = new SponsorshipRepository();
  async createInvitation(sponsorId, input, actorIp) {
    const sponsor = await this.repo.findMemberById(sponsorId);
    if (!sponsor || sponsor.status !== "active") {
      throw AppError.forbidden("Un membre suspendu ou inactif ne peut pas g\xE9n\xE9rer d'invitations.");
    }
    const rawToken = import_crypto.default.randomBytes(32).toString("hex");
    const tokenHash = import_crypto.default.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString();
    const invitation = await this.repo.createInvitation({
      sponsorId,
      targetEmail: input.targetEmail,
      targetPhone: input.targetPhone,
      tokenHash,
      status: "sent",
      expiresAt
    });
    await AuditService.record({
      actorId: sponsorId,
      actorIp,
      action: "invitation.created",
      entityType: "invitation",
      entityId: invitation.id,
      after: { targetEmail: input.targetEmail, expiresAt }
    });
    eventBus.emitEvent(SPONSORSHIP_EVENTS.INVITATION_CREATED, { invitationId: invitation.id, rawToken });
    return {
      invitationId: invitation.id,
      rawToken,
      expiresAt,
      inviteUrl: `/rejoindre?token=${rawToken}`
    };
  }
  async validateInvitationToken(rawToken) {
    const tokenHash = import_crypto.default.createHash("sha256").update(rawToken).digest("hex");
    const invitation = await this.repo.findInvitationByTokenHash(tokenHash);
    if (!invitation || invitation.status !== "sent") {
      throw AppError.badRequest("Jeton d'invitation invalide ou d\xE9j\xE0 utilis\xE9.", "SPONSORSHIP_INVITE_INVALID");
    }
    if (new Date(invitation.expiresAt) < /* @__PURE__ */ new Date()) {
      throw AppError.badRequest("Le jeton d'invitation a expir\xE9.", "SPONSORSHIP_INVITE_EXPIRED");
    }
    const sponsor = await this.repo.findMemberById(invitation.sponsorId);
    return { invitation, sponsor };
  }
  async getTree(memberId, rootId, depth = 10) {
    const currentMember = await this.repo.findMemberById(memberId);
    if (!currentMember) throw AppError.notFound("Membre introuvable");
    let targetRoot = currentMember;
    if (rootId && rootId !== memberId) {
      const requestedMember = await this.repo.findMemberById(rootId);
      if (!requestedMember) throw AppError.notFound("Membre racine demand\xE9 introuvable");
      if (!String(requestedMember.tree_path).startsWith(currentMember.tree_path)) {
        throw AppError.forbidden("Vous n'avez pas acc\xE8s \xE0 cet arbre g\xE9n\xE9alogique.", "SPONSORSHIP_TREE_ACCESS_DENIED");
      }
      targetRoot = requestedMember;
    }
    const maxDepth = targetRoot.tree_depth + depth;
    const rows = await this.repo.getTreeForMember(targetRoot.tree_path, maxDepth);
    const members = rows.map((row) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone ?? null,
      status: row.status,
      sponsorId: row.sponsor_id,
      treePath: row.tree_path,
      treeDepth: row.tree_depth,
      createdAt: row.created_at
    }));
    return { rootId: targetRoot.id, members };
  }
  async getDownline(memberId, page, limit, filters) {
    const currentMember = await this.repo.findMemberById(memberId);
    if (!currentMember) throw AppError.notFound("Membre introuvable");
    return this.repo.getDownlinePaginated(currentMember.treePath, page, limit, filters);
  }
  async getStats(memberId) {
    const currentMember = await this.repo.findMemberById(memberId);
    if (!currentMember) throw AppError.notFound("Membre introuvable");
    return this.repo.getNetworkStats(memberId, currentMember.treePath);
  }
};

// apps/api/src/modules/auth/auth.service.ts
var AuthService = class {
  sponsorshipService = new SponsorshipService();
  async registerWithInvitation(input, actorIp) {
    const { invitation, sponsor } = await this.sponsorshipService.validateInvitationToken(input.token);
    const existingUser = await knex("members").where({ email: input.email }).first();
    if (existingUser) {
      throw AppError.conflict("Cet email est d\xE9j\xE0 utilis\xE9.");
    }
    const memberId = (0, import_uuid4.v4)();
    const matricule = `VEST-${Math.floor(1e5 + Math.random() * 9e5)}`;
    const passwordHash = await import_bcryptjs.default.hash(input.password, 10);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const sponsorTreePath = sponsor ? sponsor.treePath : "/";
    const treePath = `${sponsorTreePath}${memberId}/`;
    const treeDepth = sponsor ? sponsor.treeDepth + 1 : 0;
    await knex.transaction(async (trx) => {
      await trx("members").insert({
        id: memberId,
        matricule,
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone: input.phone || null,
        password_hash: passwordHash,
        status: "active",
        sponsor_id: sponsor ? sponsor.id : null,
        tree_path: treePath,
        tree_depth: treeDepth,
        activated_at: now,
        created_at: now,
        updated_at: now
      });
      const memberRole = await trx("roles").where({ name: "member" }).first();
      if (memberRole) {
        await trx("member_roles").insert({
          member_id: memberId,
          role_id: memberRole.id
        });
      }
      await trx("invitations").where({ id: invitation.id }).update({
        status: "used",
        used_by_member_id: memberId,
        updated_at: now
      });
    });
    await AuditService.record({
      actorId: memberId,
      actorIp,
      action: "auth.registered_via_sponsorship",
      entityType: "member",
      entityId: memberId,
      after: { email: input.email, sponsorId: sponsor?.id }
    });
    return this.generateTokens(memberId, input.email, matricule, input.firstName, input.lastName, ["member"], []);
  }
  async login(email, password, actorIp) {
    const member = await knex("members").where({ email }).whereNull("deleted_at").first();
    if (!member) {
      throw AppError.unauthorized("Identifiants invalides", "AUTH_INVALID_CREDENTIALS");
    }
    if (member.status === "suspended") {
      throw AppError.forbidden("Votre compte est suspendu. Veuillez contacter l'administration.", "ACCOUNT_SUSPENDED");
    }
    const valid = await import_bcryptjs.default.compare(password, member.password_hash);
    if (!valid) {
      throw AppError.unauthorized("Identifiants invalides", "AUTH_INVALID_CREDENTIALS");
    }
    const rolesRes = await knex("member_roles").join("roles", "member_roles.role_id", "roles.id").where({ member_id: member.id }).select("roles.name");
    const roles = rolesRes.map((r) => r.name);
    const isSuperAdmin = roles.includes("super_admin");
    let permissions = [];
    if (!isSuperAdmin) {
      const permsRes = await knex("role_permissions").join("member_roles", "role_permissions.role_id", "member_roles.role_id").join("permissions", "role_permissions.permission_id", "permissions.id").where("member_roles.member_id", member.id).select("permissions.key");
      permissions = Array.from(new Set(permsRes.map((p) => p.key)));
    }
    await AuditService.record({
      actorId: member.id,
      actorIp,
      action: "auth.login_success",
      entityType: "member",
      entityId: member.id
    });
    return this.generateTokens(member.id, member.email, member.matricule, member.first_name, member.last_name, roles, permissions);
  }
  async changePassword(memberId, currentPassword, newPassword) {
    const member = await knex("members").where({ id: memberId }).whereNull("deleted_at").first();
    if (!member) throw AppError.notFound("Membre introuvable");
    const valid = await import_bcryptjs.default.compare(currentPassword, member.password_hash);
    if (!valid) {
      throw AppError.badRequest("Le mot de passe actuel est incorrect.", "AUTH_WRONG_PASSWORD");
    }
    const passwordHash = await import_bcryptjs.default.hash(newPassword, 10);
    await knex("members").where({ id: memberId }).update({
      password_hash: passwordHash,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    await AuditService.record({
      actorId: memberId,
      action: "auth.password_changed",
      entityType: "member",
      entityId: memberId
    });
    return { message: "Mot de passe mis \xE0 jour avec succ\xE8s." };
  }
  generateTokens(id, email, matricule, firstName, lastName, roles, permissions) {
    const payload = { id, email, matricule, firstName, lastName, roles, permissions };
    const accessToken = import_jsonwebtoken.default.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = import_jsonwebtoken.default.sign({ id }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    return { user: payload, accessToken, refreshToken };
  }
};

// apps/api/src/modules/auth/auth.controller.ts
var AuthController = class {
  service = new AuthService();
  register = async (req, res, next) => {
    try {
      const result = await this.service.registerWithInvitation(req.body, req.ip || "127.0.0.1");
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1e3
      });
      res.status(201).json({
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (err) {
      next(err);
    }
  };
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await this.service.login(email, password, req.ip || "127.0.0.1");
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1e3
      });
      res.json({
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (err) {
      next(err);
    }
  };
  me = async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ data: user });
    } catch (err) {
      next(err);
    }
  };
  logout = async (_req, res) => {
    res.clearCookie("refreshToken");
    res.json({ data: { message: "D\xE9connexion r\xE9ussie" } });
  };
  changePassword = async (req, res, next) => {
    try {
      const user = req.user;
      const { currentPassword, newPassword } = req.body;
      const result = await this.service.changePassword(user.id, currentPassword, newPassword);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
};

// apps/api/src/core/http/validate.middleware.ts
function validate(schema) {
  return async (req, _res, next) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      if (parsed && typeof parsed === "object" && "body" in parsed) {
        req.body = parsed.body;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

// apps/api/src/core/http/auth.middleware.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(AppError.unauthorized("Jeton d'authentification manquant"));
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = import_jsonwebtoken2.default.verify(token, env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return next(AppError.unauthorized("Jeton d'acc\xE8s invalide ou expir\xE9", "AUTH_INVALID_TOKEN"));
  }
}

// packages/shared/src/schemas/index.ts
var import_zod3 = require("zod");
var paginationSchema = import_zod3.z.object({
  page: import_zod3.z.coerce.number().int().positive().default(1),
  limit: import_zod3.z.coerce.number().int().positive().max(100).default(20)
});
var inviteMemberSchema = import_zod3.z.object({
  targetEmail: import_zod3.z.string().email().optional(),
  targetPhone: import_zod3.z.string().optional()
}).refine((data) => data.targetEmail || data.targetPhone, {
  message: "Au moins un e-mail ou un t\xE9l\xE9phone est requis pour l'invitation."
});
var registerWithTokenSchema = import_zod3.z.object({
  token: import_zod3.z.string().min(1, "Le jeton d'invitation est requis"),
  firstName: import_zod3.z.string().min(2, "Le pr\xE9nom est requis"),
  lastName: import_zod3.z.string().min(2, "Le nom est requis"),
  email: import_zod3.z.string().email("Adresse email invalide"),
  phone: import_zod3.z.string().optional(),
  password: import_zod3.z.string().min(8, "Le mot de passe doit contenir au moins 8 caract\xE8res")
});

// apps/api/src/modules/auth/auth.routes.ts
var import_zod4 = require("zod");
var router = (0, import_express.Router)();
var controller = new AuthController();
var loginSchema = import_zod4.z.object({
  body: import_zod4.z.object({
    email: import_zod4.z.string().email(),
    password: import_zod4.z.string().min(1)
  })
});
var registerSchema = import_zod4.z.object({
  body: registerWithTokenSchema
});
var changePasswordSchema = import_zod4.z.object({
  body: import_zod4.z.object({
    currentPassword: import_zod4.z.string().min(1),
    newPassword: import_zod4.z.string().min(8)
  })
});
router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.post("/logout", controller.logout);
router.get("/me", authMiddleware, controller.me);
router.post("/change-password", authMiddleware, validate(changePasswordSchema), controller.changePassword);
var auth_routes_default = router;

// apps/api/src/modules/sponsorship/sponsorship.routes.ts
var import_express2 = require("express");

// apps/api/src/modules/sponsorship/sponsorship.controller.ts
var SponsorshipController = class {
  service = new SponsorshipService();
  createInvitation = async (req, res, next) => {
    try {
      const user = req.user;
      const result = await this.service.createInvitation(user.id, req.body, req.ip || "127.0.0.1");
      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  };
  validateToken = async (req, res, next) => {
    try {
      const token = req.params.token;
      const result = await this.service.validateInvitationToken(token);
      res.json({ data: { valid: true, sponsorName: `${result.sponsor?.firstName} ${result.sponsor?.lastName}` } });
    } catch (err) {
      next(err);
    }
  };
  getTree = async (req, res, next) => {
    try {
      const user = req.user;
      const depth = Number(req.query.depth) || 2;
      const rootId = req.query.rootId;
      const result = await this.service.getTree(user.id, rootId, depth);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
  getDownline = async (req, res, next) => {
    try {
      const user = req.user;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const status = req.query.status;
      const search = req.query.search;
      const result = await this.service.getDownline(user.id, page, limit, { status, search });
      res.json({ data: result.results, meta: { total: result.total, page, limit } });
    } catch (err) {
      next(err);
    }
  };
  getStats = async (req, res, next) => {
    try {
      const user = req.user;
      const result = await this.service.getStats(user.id);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
};

// apps/api/src/core/http/rbac.middleware.ts
function requirePermission(requiredPermission) {
  return (req, _res, next) => {
    const user = req.user;
    if (!user) {
      return next(AppError.unauthorized("Utilisateur non authentifi\xE9"));
    }
    const permissions = user.permissions || [];
    const roles = user.roles || [];
    if (roles.includes("super_admin")) {
      return next();
    }
    if (!permissions.includes(requiredPermission)) {
      return next(AppError.forbidden(`Permission requise: ${requiredPermission}`, "PERMISSION_DENIED"));
    }
    next();
  };
}

// apps/api/src/modules/sponsorship/sponsorship.routes.ts
var router2 = (0, import_express2.Router)();
var controller2 = new SponsorshipController();
router2.get("/invitations/validate/:token", controller2.validateToken);
router2.use(authMiddleware);
router2.post("/invitations", requirePermission("sponsorship.invite"), controller2.createInvitation);
router2.get("/tree", controller2.getTree);
router2.get("/downline", controller2.getDownline);
router2.get("/stats", controller2.getStats);
var sponsorship_routes_default = router2;

// apps/api/src/modules/cms/cms.routes.ts
var import_express3 = require("express");

// apps/api/src/modules/cms/cms.service.ts
var import_uuid5 = require("uuid");
var CmsService = class {
  async getContentBlock(key, locale = "fr") {
    const block = await knex("content_blocks").where({ key, locale }).first();
    return block ? block.content : null;
  }
  async getAllBlocks() {
    return knex("content_blocks").select("*");
  }
  async upsertContentBlock(key, content, updatedBy, locale = "fr") {
    const existing = await knex("content_blocks").where({ key, locale }).first();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (existing) {
      const newVersion = existing.version + 1;
      await knex("content_blocks").where({ id: existing.id }).update({
        content,
        version: newVersion,
        updated_by: updatedBy,
        updated_at: now
      });
      await AuditService.record({
        actorId: updatedBy,
        action: "cms.block_updated",
        entityType: "content_block",
        entityId: existing.id,
        before: { content: existing.content },
        after: { content }
      });
      return { key, content, version: newVersion };
    } else {
      const id = (0, import_uuid5.v4)();
      await knex("content_blocks").insert({
        id,
        key,
        locale,
        content,
        version: 1,
        updated_by: updatedBy,
        status: "published",
        created_at: now,
        updated_at: now
      });
      await AuditService.record({
        actorId: updatedBy,
        action: "cms.block_created",
        entityType: "content_block",
        entityId: id,
        after: { key, content }
      });
      return { key, content, version: 1 };
    }
  }
  async getOpportunityPlaylist() {
    const playlist = await knex("video_playlists").first();
    if (!playlist) return { items: [] };
    const items = await knex("playlist_items").where({ playlist_id: playlist.id }).orderBy("position", "asc");
    return { playlist, items };
  }
};

// apps/api/src/modules/cms/cms.controller.ts
var CmsController = class {
  service = new CmsService();
  getBlock = async (req, res, next) => {
    try {
      const { key } = req.params;
      const locale = req.query.locale || "fr";
      const content = await this.service.getContentBlock(key, locale);
      res.json({ data: { key, content } });
    } catch (err) {
      next(err);
    }
  };
  getAllBlocks = async (_req, res, next) => {
    try {
      const blocks = await this.service.getAllBlocks();
      res.json({ data: blocks });
    } catch (err) {
      next(err);
    }
  };
  upsertBlock = async (req, res, next) => {
    try {
      const user = req.user;
      const { key, content, locale } = req.body;
      const result = await this.service.upsertContentBlock(key, content, user.id, locale || "fr");
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
  getOpportunityPlaylist = async (_req, res, next) => {
    try {
      const playlistData = await this.service.getOpportunityPlaylist();
      res.json({ data: playlistData });
    } catch (err) {
      next(err);
    }
  };
};

// apps/api/src/modules/cms/cms.routes.ts
var router3 = (0, import_express3.Router)();
var controller3 = new CmsController();
router3.get("/blocks/:key", controller3.getBlock);
router3.get("/opportunity-playlist", controller3.getOpportunityPlaylist);
router3.use(authMiddleware);
router3.get("/blocks", requirePermission("cms.edit"), controller3.getAllBlocks);
router3.post("/blocks", requirePermission("cms.edit"), controller3.upsertBlock);
var cms_routes_default = router3;

// apps/api/src/modules/newsletter/newsletter.routes.ts
var import_express4 = require("express");

// apps/api/src/modules/newsletter/newsletter.service.ts
var import_uuid6 = require("uuid");
var NewsletterService = class {
  async subscribe(email) {
    const existing = await knex("newsletter_subscriptions").where({ email }).first();
    if (existing) {
      if (existing.status === "subscribed") {
        return { message: "Vous \xEAtes d\xE9j\xE0 inscrit \xE0 la newsletter." };
      }
      await knex("newsletter_subscriptions").where({ email }).update({
        status: "subscribed",
        subscribed_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      return { message: "Inscriptions \xE0 la newsletter r\xE9activ\xE9e avec succ\xE8s." };
    }
    await knex("newsletter_subscriptions").insert({
      id: (0, import_uuid6.v4)(),
      email,
      status: "subscribed",
      subscribed_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    return { message: "Inscription \xE0 la newsletter effectu\xE9e avec succ\xE8s." };
  }
  async getSubscribers() {
    return knex("newsletter_subscriptions").select("id", "email", "status", "subscribed_at").orderBy("subscribed_at", "desc");
  }
  async createCampaign(subject, content, actorId) {
    const id = (0, import_uuid6.v4)();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await knex("newsletter_campaigns").insert({
      id,
      subject,
      content,
      status: "draft",
      created_at: now,
      updated_at: now
    });
    await AuditService.record({
      actorId,
      action: "newsletter.campaign_created",
      entityType: "newsletter_campaign",
      entityId: id,
      after: { subject }
    });
    return { id, subject, status: "draft" };
  }
  async sendCampaign(id, actorId) {
    const campaign = await knex("newsletter_campaigns").where({ id }).first();
    if (!campaign) throw AppError.notFound("Campagne introuvable");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await knex("newsletter_campaigns").where({ id }).update({
      status: "sent",
      sent_at: now,
      updated_at: now
    });
    await AuditService.record({
      actorId,
      action: "newsletter.campaign_sent",
      entityType: "newsletter_campaign",
      entityId: id
    });
    return { message: "Campagne newsletter envoy\xE9e avec succ\xE8s aux abonn\xE9s." };
  }
};

// apps/api/src/modules/newsletter/newsletter.controller.ts
var NewsletterController = class {
  service = new NewsletterService();
  subscribe = async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: { message: "L'email est obligatoire" } });
      const result = await this.service.subscribe(email);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
  getSubscribers = async (req, res, next) => {
    try {
      const subscribers = await this.service.getSubscribers();
      res.json({ data: subscribers });
    } catch (err) {
      next(err);
    }
  };
  createCampaign = async (req, res, next) => {
    try {
      const user = req.user;
      const { subject, content } = req.body;
      const campaign = await this.service.createCampaign(subject, content, user.id);
      res.status(201).json({ data: campaign });
    } catch (err) {
      next(err);
    }
  };
  sendCampaign = async (req, res, next) => {
    try {
      const user = req.user;
      const { id } = req.params;
      const result = await this.service.sendCampaign(id, user.id);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
};

// apps/api/src/modules/newsletter/newsletter.routes.ts
var router4 = (0, import_express4.Router)();
var controller4 = new NewsletterController();
router4.post("/subscribe", controller4.subscribe);
router4.use(authMiddleware);
router4.get("/subscribers", requirePermission("newsletter.manage"), controller4.getSubscribers);
router4.post("/campaigns", requirePermission("newsletter.manage"), controller4.createCampaign);
router4.post("/campaigns/:id/send", requirePermission("newsletter.manage"), controller4.sendCampaign);
var newsletter_routes_default = router4;

// apps/api/src/modules/admin/admin.routes.ts
var import_express5 = require("express");

// apps/api/src/modules/admin/admin.service.ts
var AdminService = class {
  async getDashboardStats() {
    const totalMembersRes = await knex("members").count("* as count").first();
    const activeMembersRes = await knex("members").where({ status: "active" }).count("* as count").first();
    const suspendedMembersRes = await knex("members").where({ status: "suspended" }).count("* as count").first();
    const pendingModerationRes = await knex("moderation_requests").where({ status: "pending" }).count("* as count").first();
    const newsletterSubscribersRes = await knex("newsletter_subscriptions").where({ status: "subscribed" }).count("* as count").first();
    const totalEventsRes = await knex("events").count("* as count").first();
    const totalCoursesRes = await knex("courses").count("* as count").first();
    return {
      totalMembers: Number(totalMembersRes?.count || 0),
      activeMembers: Number(activeMembersRes?.count || 0),
      suspendedMembers: Number(suspendedMembersRes?.count || 0),
      pendingModerations: Number(pendingModerationRes?.count || 0),
      newsletterSubscribers: Number(newsletterSubscribersRes?.count || 0),
      totalEvents: Number(totalEventsRes?.count || 0),
      totalCourses: Number(totalCoursesRes?.count || 0)
    };
  }
  async getMembersList(page = 1, limit = 20, search) {
    let query = knex("members").whereNull("deleted_at");
    if (search) {
      const term = `%${search.toLowerCase()}%`;
      query = query.where((q) => {
        q.whereRaw("lower(first_name) like ?", [term]).orWhereRaw("lower(last_name) like ?", [term]).orWhereRaw("lower(email) like ?", [term]).orWhereRaw("lower(matricule) like ?", [term]);
      });
    }
    const totalRes = await query.clone().count("* as count").first();
    const members = await query.select("id", "matricule", "first_name", "last_name", "email", "phone", "status", "tree_depth", "created_at").orderBy("created_at", "desc").offset((page - 1) * limit).limit(limit);
    return { members, total: Number(totalRes?.count || 0), page, limit };
  }
  async updateMemberStatus(memberId, status, actorId, reason) {
    const member = await knex("members").where({ id: memberId }).first();
    if (!member) throw AppError.notFound("Membre introuvable");
    await knex("members").where({ id: memberId }).update({
      status,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    await AuditService.record({
      actorId,
      action: status === "suspended" ? "member.suspended" : "member.activated",
      entityType: "member",
      entityId: memberId,
      before: { status: member.status },
      after: { status, reason }
    });
    return { message: `Statut du membre mis \xE0 jour : ${status}` };
  }
  async grantPermissionToAdmin(memberId, permissionKey, actorId) {
    const member = await knex("members").where({ id: memberId }).first();
    if (!member) throw AppError.notFound("Membre introuvable");
    const permission = await knex("permissions").where({ key: permissionKey }).first();
    if (!permission) throw AppError.notFound("Permission introuvable");
    const existing = await knex("member_permissions").where({ member_id: memberId, permission_id: permission.id }).first();
    if (!existing) {
      await knex("member_permissions").insert({
        member_id: memberId,
        permission_id: permission.id
      });
    }
    await AuditService.record({
      actorId,
      action: "rbac.permission_granted",
      entityType: "member",
      entityId: memberId,
      after: { permissionKey }
    });
    return { message: `Permission ${permissionKey} accord\xE9e avec succ\xE8s \xE0 ${member.first_name} ${member.last_name}` };
  }
  async getModerationQueue() {
    return knex("moderation_requests").join("members", "moderation_requests.submitted_by", "members.id").select(
      "moderation_requests.*",
      "members.first_name as author_first_name",
      "members.last_name as author_last_name",
      "members.email as author_email"
    ).orderBy("moderation_requests.created_at", "desc");
  }
  async reviewModerationItem(id, status, actorId, comment) {
    const req = await knex("moderation_requests").where({ id }).first();
    if (!req) throw AppError.notFound("Demande de mod\xE9ration introuvable");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await knex("moderation_requests").where({ id }).update({
      status,
      reviewed_by: actorId,
      reviewed_at: now,
      comment: comment || null,
      updated_at: now
    });
    await AuditService.record({
      actorId,
      action: `moderation.${status}`,
      entityType: req.entity_type,
      entityId: req.entity_id,
      after: { status, comment }
    });
    return { message: `\xC9l\xE9ment de mod\xE9ration marqu\xE9 comme ${status}` };
  }
  async getAuditLogs(page = 1, limit = 50) {
    const totalRes = await knex("audit_logs").count("* as count").first();
    const logs = await knex("audit_logs").orderBy("created_at", "desc").offset((page - 1) * limit).limit(limit);
    return { logs, total: Number(totalRes?.count || 0), page, limit };
  }
};

// apps/api/src/modules/admin/admin.controller.ts
var AdminController = class {
  service = new AdminService();
  getDashboardStats = async (_req, res, next) => {
    try {
      const stats = await this.service.getDashboardStats();
      res.json({ data: stats });
    } catch (err) {
      next(err);
    }
  };
  getMembersList = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const search = req.query.search;
      const result = await this.service.getMembersList(page, limit, search);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
  updateMemberStatus = async (req, res, next) => {
    try {
      const user = req.user;
      const { memberId, status, reason } = req.body;
      const result = await this.service.updateMemberStatus(memberId, status, user.id, reason);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
  grantPermission = async (req, res, next) => {
    try {
      const user = req.user;
      const { memberId, permissionKey } = req.body;
      const result = await this.service.grantPermissionToAdmin(memberId, permissionKey, user.id);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
  getModerationQueue = async (_req, res, next) => {
    try {
      const queue = await this.service.getModerationQueue();
      res.json({ data: queue });
    } catch (err) {
      next(err);
    }
  };
  reviewModerationItem = async (req, res, next) => {
    try {
      const user = req.user;
      const { id } = req.params;
      const { status, comment } = req.body;
      const result = await this.service.reviewModerationItem(id, status, user.id, comment);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
  getAuditLogs = async (req, res, next) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;
      const result = await this.service.getAuditLogs(page, limit);
      res.json({ data: result });
    } catch (err) {
      next(err);
    }
  };
};

// apps/api/src/modules/admin/admin.routes.ts
var router5 = (0, import_express5.Router)();
var controller5 = new AdminController();
router5.use(authMiddleware);
router5.get("/dashboard/stats", requirePermission("admin.dashboard"), controller5.getDashboardStats);
router5.get("/members", requirePermission("members.manage"), controller5.getMembersList);
router5.post("/members/status", requirePermission("members.manage"), controller5.updateMemberStatus);
router5.get("/moderation/queue", requirePermission("admin.dashboard"), controller5.getModerationQueue);
router5.post("/moderation/:id/review", requirePermission("admin.dashboard"), controller5.reviewModerationItem);
router5.post("/permissions/grant", requirePermission("members.manage"), controller5.grantPermission);
router5.get("/audit-logs", requirePermission("admin.dashboard"), controller5.getAuditLogs);
var admin_routes_default = router5;

// apps/api/src/modules/articles/articles.routes.ts
var import_express6 = require("express");

// apps/api/src/modules/articles/articles.service.ts
var import_uuid7 = require("uuid");

// apps/api/src/core/utils/slug.ts
function slugify(input) {
  return input.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 200) || "element";
}
async function uniqueSlug(table, title, ignoreId) {
  const base = slugify(title);
  let candidate = base;
  let suffix = 1;
  while (true) {
    const query = knex(table).where({ slug: candidate });
    if (ignoreId) query.whereNot({ id: ignoreId });
    const existing = await query.first();
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

// apps/api/src/modules/articles/articles.service.ts
function toDto(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    status: row.status,
    author: row.author_name ?? void 0,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
var ArticlesService = class {
  /** Articles publiés, visibles publiquement. */
  async listPublished() {
    const rows = await knex("articles").leftJoin("members", "articles.author_id", "members.id").whereNull("articles.deleted_at").where("articles.status", "published").orderBy("articles.published_at", "desc").select("articles.*", knex.raw("members.first_name || ' ' || members.last_name as author_name"));
    return rows.map(toDto);
  }
  async getPublishedBySlug(slug) {
    const row = await knex("articles").leftJoin("members", "articles.author_id", "members.id").whereNull("articles.deleted_at").where("articles.status", "published").where("articles.slug", slug).select("articles.*", knex.raw("members.first_name || ' ' || members.last_name as author_name")).first();
    if (!row) throw AppError.notFound("Article introuvable");
    return toDto(row);
  }
  /** Tous les articles de l'auteur (brouillons compris) — pour le back-office. */
  async listMine(authorId) {
    const rows = await knex("articles").where({ author_id: authorId }).whereNull("deleted_at").orderBy("created_at", "desc");
    return rows.map(toDto);
  }
  async create(authorId, input) {
    const id = (0, import_uuid7.v4)();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const slug = await uniqueSlug("articles", input.title);
    await knex("articles").insert({
      id,
      author_id: authorId,
      title: input.title,
      slug,
      summary: input.summary ?? "",
      content: input.content,
      cover_image_url: input.coverImageUrl ?? null,
      status: input.status,
      published_at: input.status === "published" ? now : null,
      created_at: now,
      updated_at: now
    });
    await AuditService.record({
      actorId: authorId,
      action: "article.created",
      entityType: "article",
      entityId: id,
      after: { title: input.title, status: input.status }
    });
    return this.getOwned(id, authorId);
  }
  async update(id, authorId, input) {
    const article = await this.requireOwned(id, authorId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const patch = { updated_at: now };
    if (input.title !== void 0) {
      patch.title = input.title;
      patch.slug = await uniqueSlug("articles", input.title, id);
    }
    if (input.summary !== void 0) patch.summary = input.summary;
    if (input.content !== void 0) patch.content = input.content;
    if (input.coverImageUrl !== void 0) patch.cover_image_url = input.coverImageUrl;
    if (input.status !== void 0) {
      patch.status = input.status;
      if (input.status === "published" && !article.published_at) patch.published_at = now;
    }
    await knex("articles").where({ id }).update(patch);
    await AuditService.record({
      actorId: authorId,
      action: "article.updated",
      entityType: "article",
      entityId: id,
      after: patch
    });
    return this.getOwned(id, authorId);
  }
  async remove(id, authorId) {
    await this.requireOwned(id, authorId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await knex("articles").where({ id }).update({ deleted_at: now, updated_at: now });
    await AuditService.record({
      actorId: authorId,
      action: "article.deleted",
      entityType: "article",
      entityId: id
    });
    return { message: "Article supprim\xE9." };
  }
  async requireOwned(id, authorId) {
    const article = await knex("articles").where({ id }).whereNull("deleted_at").first();
    if (!article) throw AppError.notFound("Article introuvable");
    if (article.author_id !== authorId) {
      throw AppError.forbidden("Vous ne pouvez modifier que vos propres articles.");
    }
    return article;
  }
  async getOwned(id, authorId) {
    const article = await this.requireOwned(id, authorId);
    return toDto(article);
  }
};

// apps/api/src/modules/articles/articles.controller.ts
var ArticlesController = class {
  service = new ArticlesService();
  listPublished = async (_req, res, next) => {
    try {
      res.json({ data: await this.service.listPublished() });
    } catch (err) {
      next(err);
    }
  };
  getBySlug = async (req, res, next) => {
    try {
      res.json({ data: await this.service.getPublishedBySlug(req.params.slug) });
    } catch (err) {
      next(err);
    }
  };
  listMine = async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ data: await this.service.listMine(user.id) });
    } catch (err) {
      next(err);
    }
  };
  create = async (req, res, next) => {
    try {
      const user = req.user;
      const article = await this.service.create(user.id, req.body);
      res.status(201).json({ data: article });
    } catch (err) {
      next(err);
    }
  };
  update = async (req, res, next) => {
    try {
      const user = req.user;
      const article = await this.service.update(req.params.id, user.id, req.body);
      res.json({ data: article });
    } catch (err) {
      next(err);
    }
  };
  remove = async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ data: await this.service.remove(req.params.id, user.id) });
    } catch (err) {
      next(err);
    }
  };
};

// apps/api/src/modules/articles/articles.schema.ts
var import_zod5 = require("zod");
var createArticleSchema = import_zod5.z.object({
  body: import_zod5.z.object({
    title: import_zod5.z.string().min(3).max(255),
    summary: import_zod5.z.string().max(2e3).optional().default(""),
    content: import_zod5.z.string().min(1),
    coverImageUrl: import_zod5.z.string().max(500).optional(),
    status: import_zod5.z.enum(["draft", "published"]).default("draft")
  })
});
var updateArticleSchema = import_zod5.z.object({
  params: import_zod5.z.object({ id: import_zod5.z.string().min(1) }),
  body: import_zod5.z.object({
    title: import_zod5.z.string().min(3).max(255).optional(),
    summary: import_zod5.z.string().max(2e3).optional(),
    content: import_zod5.z.string().min(1).optional(),
    coverImageUrl: import_zod5.z.string().max(500).optional(),
    status: import_zod5.z.enum(["draft", "published"]).optional()
  })
});

// apps/api/src/modules/articles/articles.routes.ts
var router6 = (0, import_express6.Router)();
var controller6 = new ArticlesController();
router6.get("/", controller6.listPublished);
router6.get("/mine", authMiddleware, controller6.listMine);
router6.post("/", authMiddleware, validate(createArticleSchema), controller6.create);
router6.patch("/:id", authMiddleware, validate(updateArticleSchema), controller6.update);
router6.delete("/:id", authMiddleware, controller6.remove);
router6.get("/:slug", controller6.getBySlug);
var articles_routes_default = router6;

// apps/api/src/modules/courses/courses.routes.ts
var import_express7 = require("express");

// apps/api/src/modules/courses/courses.service.ts
var import_uuid8 = require("uuid");
function parseTags(raw) {
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function toDto2(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    duration: row.duration,
    tags: parseTags(row.tags),
    thumbnailUrl: row.thumbnail_url,
    introVideoUrl: row.intro_video_url,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
var CoursesService = class {
  async listPublished() {
    const rows = await knex("courses").whereNull("deleted_at").where("status", "published").orderBy("created_at", "desc");
    return rows.map(toDto2);
  }
  async getPublishedBySlug(slug) {
    const row = await knex("courses").whereNull("deleted_at").where({ slug, status: "published" }).first();
    if (!row) throw AppError.notFound("Formation introuvable");
    return toDto2(row);
  }
  async listMine(authorId) {
    const rows = await knex("courses").where({ author_id: authorId }).whereNull("deleted_at").orderBy("created_at", "desc");
    return rows.map(toDto2);
  }
  async create(authorId, input) {
    const id = (0, import_uuid8.v4)();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const slug = await uniqueSlug("courses", input.title);
    await knex("courses").insert({
      id,
      author_id: authorId,
      title: input.title,
      slug,
      description: input.description ?? "",
      duration: input.duration ?? "",
      tags: JSON.stringify(input.tags ?? []),
      thumbnail_url: input.thumbnailUrl ?? null,
      intro_video_url: input.introVideoUrl ?? "",
      content: input.content ?? "",
      level: "all",
      status: input.status,
      created_at: now,
      updated_at: now
    });
    await AuditService.record({
      actorId: authorId,
      action: "course.created",
      entityType: "course",
      entityId: id,
      after: { title: input.title, status: input.status }
    });
    return toDto2(await this.requireOwned(id, authorId));
  }
  async update(id, authorId, input) {
    await this.requireOwned(id, authorId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const patch = { updated_at: now };
    if (input.title !== void 0) {
      patch.title = input.title;
      patch.slug = await uniqueSlug("courses", input.title, id);
    }
    if (input.description !== void 0) patch.description = input.description;
    if (input.duration !== void 0) patch.duration = input.duration;
    if (input.tags !== void 0) patch.tags = JSON.stringify(input.tags);
    if (input.thumbnailUrl !== void 0) patch.thumbnail_url = input.thumbnailUrl;
    if (input.introVideoUrl !== void 0) patch.intro_video_url = input.introVideoUrl;
    if (input.content !== void 0) patch.content = input.content;
    if (input.status !== void 0) patch.status = input.status;
    await knex("courses").where({ id }).update(patch);
    await AuditService.record({
      actorId: authorId,
      action: "course.updated",
      entityType: "course",
      entityId: id,
      after: patch
    });
    return toDto2(await this.requireOwned(id, authorId));
  }
  async remove(id, authorId) {
    await this.requireOwned(id, authorId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await knex("courses").where({ id }).update({ deleted_at: now, updated_at: now });
    await AuditService.record({ actorId: authorId, action: "course.deleted", entityType: "course", entityId: id });
    return { message: "Formation supprim\xE9e." };
  }
  async requireOwned(id, authorId) {
    const course = await knex("courses").where({ id }).whereNull("deleted_at").first();
    if (!course) throw AppError.notFound("Formation introuvable");
    if (course.author_id !== authorId) {
      throw AppError.forbidden("Vous ne pouvez modifier que vos propres formations.");
    }
    return course;
  }
};

// apps/api/src/modules/courses/courses.controller.ts
var CoursesController = class {
  service = new CoursesService();
  listPublished = async (_req, res, next) => {
    try {
      res.json({ data: await this.service.listPublished() });
    } catch (err) {
      next(err);
    }
  };
  getBySlug = async (req, res, next) => {
    try {
      res.json({ data: await this.service.getPublishedBySlug(req.params.slug) });
    } catch (err) {
      next(err);
    }
  };
  listMine = async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ data: await this.service.listMine(user.id) });
    } catch (err) {
      next(err);
    }
  };
  create = async (req, res, next) => {
    try {
      const user = req.user;
      res.status(201).json({ data: await this.service.create(user.id, req.body) });
    } catch (err) {
      next(err);
    }
  };
  update = async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ data: await this.service.update(req.params.id, user.id, req.body) });
    } catch (err) {
      next(err);
    }
  };
  remove = async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ data: await this.service.remove(req.params.id, user.id) });
    } catch (err) {
      next(err);
    }
  };
};

// apps/api/src/modules/courses/courses.schema.ts
var import_zod6 = require("zod");
var createCourseSchema = import_zod6.z.object({
  body: import_zod6.z.object({
    title: import_zod6.z.string().min(3).max(255),
    description: import_zod6.z.string().max(4e3).optional().default(""),
    duration: import_zod6.z.string().max(50).optional().default(""),
    tags: import_zod6.z.array(import_zod6.z.string().max(60)).max(10).optional().default([]),
    thumbnailUrl: import_zod6.z.string().max(500).optional(),
    introVideoUrl: import_zod6.z.string().max(500).optional().default(""),
    content: import_zod6.z.string().optional().default(""),
    status: import_zod6.z.enum(["draft", "published", "done"]).default("draft")
  })
});
var updateCourseSchema = import_zod6.z.object({
  params: import_zod6.z.object({ id: import_zod6.z.string().min(1) }),
  body: import_zod6.z.object({
    title: import_zod6.z.string().min(3).max(255).optional(),
    description: import_zod6.z.string().max(4e3).optional(),
    duration: import_zod6.z.string().max(50).optional(),
    tags: import_zod6.z.array(import_zod6.z.string().max(60)).max(10).optional(),
    thumbnailUrl: import_zod6.z.string().max(500).optional(),
    introVideoUrl: import_zod6.z.string().max(500).optional(),
    content: import_zod6.z.string().optional(),
    status: import_zod6.z.enum(["draft", "published", "done"]).optional()
  })
});

// apps/api/src/modules/courses/courses.routes.ts
var router7 = (0, import_express7.Router)();
var controller7 = new CoursesController();
router7.get("/", controller7.listPublished);
router7.get("/mine", authMiddleware, controller7.listMine);
router7.post("/", authMiddleware, validate(createCourseSchema), controller7.create);
router7.patch("/:id", authMiddleware, validate(updateCourseSchema), controller7.update);
router7.delete("/:id", authMiddleware, controller7.remove);
router7.get("/:slug", controller7.getBySlug);
var courses_routes_default = router7;

// apps/api/src/modules/events/events.routes.ts
var import_express8 = require("express");

// apps/api/src/modules/events/events.service.ts
var import_uuid9 = require("uuid");
function displayStatus(row, ticketsSold) {
  if (row.end_date && row.end_date < (/* @__PURE__ */ new Date()).toISOString()) return "expired";
  if (row.capacity > 0 && ticketsSold >= row.capacity) return "full";
  return null;
}
var EventsService = class {
  toDto(row, ticketsSold) {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      eventType: row.event_type,
      priceCents: row.price_cents,
      location: row.location,
      date: row.start_date,
      capacity: row.capacity,
      coverImageUrl: row.cover_image_url,
      description: row.description,
      content: row.content,
      status: row.status,
      ticketsSold,
      displayStatus: displayStatus(row, ticketsSold),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
  /** Nombre de billets non annulés par évènement (via orders). */
  async ticketsSoldByEvent(eventIds) {
    if (eventIds.length === 0) return {};
    const rows = await knex("tickets").join("orders", "tickets.order_id", "orders.id").whereIn("orders.event_id", eventIds).whereNot("tickets.status", "cancelled").groupBy("orders.event_id").select("orders.event_id").count({ count: "tickets.id" });
    return Object.fromEntries(rows.map((r) => [r.event_id, Number(r.count)]));
  }
  async decorate(rows) {
    const counts = await this.ticketsSoldByEvent(rows.map((r) => r.id));
    return rows.map((row) => this.toDto(row, counts[row.id] ?? 0));
  }
  async listPublished() {
    const rows = await knex("events").whereNull("deleted_at").where("status", "published").orderBy("start_date", "asc");
    return this.decorate(rows);
  }
  async listMine(organizerId) {
    const rows = await knex("events").where({ organizer_id: organizerId }).whereNull("deleted_at").orderBy("start_date", "desc");
    return this.decorate(rows);
  }
  async create(organizerId, input) {
    const id = (0, import_uuid9.v4)();
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const slug = await uniqueSlug("events", input.title);
    await knex("events").insert({
      id,
      organizer_id: organizerId,
      title: input.title,
      slug,
      description: input.description ?? "",
      location: input.location,
      start_date: input.date,
      end_date: input.date,
      capacity: input.capacity ?? 0,
      visibility: "public",
      status: input.status,
      category: input.category ?? "",
      event_type: input.eventType,
      price_cents: input.eventType === "paid" ? input.priceCents ?? 0 : 0,
      cover_image_url: input.coverImageUrl ?? null,
      content: input.content ?? "",
      created_at: now,
      updated_at: now
    });
    await AuditService.record({
      actorId: organizerId,
      action: "event.created",
      entityType: "event",
      entityId: id,
      after: { title: input.title, status: input.status }
    });
    return this.toDto(await this.requireOwned(id, organizerId), 0);
  }
  async update(id, organizerId, input) {
    await this.requireOwned(id, organizerId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const patch = { updated_at: now };
    if (input.title !== void 0) {
      patch.title = input.title;
      patch.slug = await uniqueSlug("events", input.title, id);
    }
    if (input.category !== void 0) patch.category = input.category;
    if (input.eventType !== void 0) patch.event_type = input.eventType;
    if (input.priceCents !== void 0) patch.price_cents = input.priceCents;
    if (input.location !== void 0) patch.location = input.location;
    if (input.date !== void 0) {
      patch.start_date = input.date;
      patch.end_date = input.date;
    }
    if (input.capacity !== void 0) patch.capacity = input.capacity;
    if (input.coverImageUrl !== void 0) patch.cover_image_url = input.coverImageUrl;
    if (input.description !== void 0) patch.description = input.description;
    if (input.content !== void 0) patch.content = input.content;
    if (input.status !== void 0) patch.status = input.status;
    await knex("events").where({ id }).update(patch);
    await AuditService.record({
      actorId: organizerId,
      action: "event.updated",
      entityType: "event",
      entityId: id,
      after: patch
    });
    const counts = await this.ticketsSoldByEvent([id]);
    return this.toDto(await this.requireOwned(id, organizerId), counts[id] ?? 0);
  }
  async remove(id, organizerId) {
    await this.requireOwned(id, organizerId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    await knex("events").where({ id }).update({ deleted_at: now, updated_at: now });
    await AuditService.record({ actorId: organizerId, action: "event.deleted", entityType: "event", entityId: id });
    return { message: "\xC9v\xE8nement supprim\xE9." };
  }
  async requireOwned(id, organizerId) {
    const event = await knex("events").where({ id }).whereNull("deleted_at").first();
    if (!event) throw AppError.notFound("\xC9v\xE8nement introuvable");
    if (event.organizer_id !== organizerId) {
      throw AppError.forbidden("Vous ne pouvez modifier que vos propres \xE9v\xE8nements.");
    }
    return event;
  }
};

// apps/api/src/modules/events/events.controller.ts
var EventsController = class {
  service = new EventsService();
  listPublished = async (_req, res, next) => {
    try {
      res.json({ data: await this.service.listPublished() });
    } catch (err) {
      next(err);
    }
  };
  listMine = async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ data: await this.service.listMine(user.id) });
    } catch (err) {
      next(err);
    }
  };
  create = async (req, res, next) => {
    try {
      const user = req.user;
      res.status(201).json({ data: await this.service.create(user.id, req.body) });
    } catch (err) {
      next(err);
    }
  };
  update = async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ data: await this.service.update(req.params.id, user.id, req.body) });
    } catch (err) {
      next(err);
    }
  };
  remove = async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ data: await this.service.remove(req.params.id, user.id) });
    } catch (err) {
      next(err);
    }
  };
};

// apps/api/src/modules/events/events.schema.ts
var import_zod7 = require("zod");
var createEventSchema = import_zod7.z.object({
  body: import_zod7.z.object({
    title: import_zod7.z.string().min(3).max(255),
    category: import_zod7.z.string().max(100).optional().default(""),
    eventType: import_zod7.z.enum(["free", "paid"]).default("free"),
    priceCents: import_zod7.z.coerce.number().int().min(0).optional().default(0),
    location: import_zod7.z.string().min(2).max(255),
    date: import_zod7.z.string().min(4),
    // ISO (AAAA-MM-JJ)
    capacity: import_zod7.z.coerce.number().int().min(0).optional().default(0),
    coverImageUrl: import_zod7.z.string().max(500).optional(),
    description: import_zod7.z.string().max(4e3).optional().default(""),
    content: import_zod7.z.string().optional().default(""),
    status: import_zod7.z.enum(["draft", "published"]).default("draft")
  })
});
var updateEventSchema = import_zod7.z.object({
  params: import_zod7.z.object({ id: import_zod7.z.string().min(1) }),
  body: import_zod7.z.object({
    title: import_zod7.z.string().min(3).max(255).optional(),
    category: import_zod7.z.string().max(100).optional(),
    eventType: import_zod7.z.enum(["free", "paid"]).optional(),
    priceCents: import_zod7.z.coerce.number().int().min(0).optional(),
    location: import_zod7.z.string().min(2).max(255).optional(),
    date: import_zod7.z.string().min(4).optional(),
    capacity: import_zod7.z.coerce.number().int().min(0).optional(),
    coverImageUrl: import_zod7.z.string().max(500).optional(),
    description: import_zod7.z.string().max(4e3).optional(),
    content: import_zod7.z.string().optional(),
    status: import_zod7.z.enum(["draft", "published"]).optional()
  })
});

// apps/api/src/modules/events/events.routes.ts
var router8 = (0, import_express8.Router)();
var controller8 = new EventsController();
router8.get("/", controller8.listPublished);
router8.get("/mine", authMiddleware, controller8.listMine);
router8.post("/", authMiddleware, validate(createEventSchema), controller8.create);
router8.patch("/:id", authMiddleware, validate(updateEventSchema), controller8.update);
router8.delete("/:id", authMiddleware, controller8.remove);
var events_routes_default = router8;

// apps/api/src/modules/uploads/uploads.routes.ts
var import_express9 = require("express");

// apps/api/src/modules/uploads/uploads.controller.ts
var import_promises = require("fs/promises");
var import_path3 = __toESM(require("path"));
var import_uuid10 = require("uuid");
var UPLOADS_DIR = import_path3.default.join(process.cwd(), "uploads");
var EXT_BY_MIME = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg"
};
var MAX_BYTES = 15e5;
var UploadsController = class {
  upload = async (req, res, next) => {
    try {
      const { dataUrl } = req.body;
      const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl ?? "");
      if (!match) {
        throw AppError.badRequest("Image invalide : un data URL base64 est attendu.", "UPLOAD_INVALID");
      }
      const [, mime, base64] = match;
      const ext = EXT_BY_MIME[mime];
      if (!ext) throw AppError.badRequest("Format d\u2019image non pris en charge.", "UPLOAD_UNSUPPORTED");
      const buffer = Buffer.from(base64, "base64");
      if (buffer.byteLength > MAX_BYTES) {
        throw AppError.badRequest("Image trop volumineuse (max 1 mo).", "UPLOAD_TOO_LARGE");
      }
      await (0, import_promises.mkdir)(UPLOADS_DIR, { recursive: true });
      const filename = `${(0, import_uuid10.v4)()}.${ext}`;
      await (0, import_promises.writeFile)(import_path3.default.join(UPLOADS_DIR, filename), buffer);
      res.status(201).json({ data: { url: `/uploads/${filename}` } });
    } catch (err) {
      next(err);
    }
  };
};

// apps/api/src/modules/uploads/uploads.routes.ts
var router9 = (0, import_express9.Router)();
var controller9 = new UploadsController();
router9.post("/", authMiddleware, controller9.upload);
var uploads_routes_default = router9;

// apps/api/src/modules/contact/contact.routes.ts
var import_express10 = require("express");
var import_zod8 = require("zod");

// apps/api/src/modules/contact/contact.service.ts
var import_uuid11 = require("uuid");
var ContactService = class {
  async submit(input) {
    await knex("contact_messages").insert({
      id: (0, import_uuid11.v4)(),
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      subject: input.subject,
      message: input.message,
      status: "new",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    return { message: "Votre message a bien \xE9t\xE9 envoy\xE9. Notre \xE9quipe vous r\xE9pondra rapidement." };
  }
};

// apps/api/src/modules/contact/contact.controller.ts
var ContactController = class {
  service = new ContactService();
  submit = async (req, res, next) => {
    try {
      res.status(201).json({ data: await this.service.submit(req.body) });
    } catch (err) {
      next(err);
    }
  };
};

// apps/api/src/modules/contact/contact.routes.ts
var router10 = (0, import_express10.Router)();
var controller10 = new ContactController();
var contactSchema = import_zod8.z.object({
  body: import_zod8.z.object({
    name: import_zod8.z.string().min(2).max(150),
    email: import_zod8.z.string().email().max(255),
    phone: import_zod8.z.string().max(50).optional(),
    subject: import_zod8.z.string().min(3).max(255),
    message: import_zod8.z.string().min(10).max(5e3)
  })
});
router10.post("/", validate(contactSchema), controller10.submit);
var contact_routes_default = router10;

// apps/api/src/modules/members/members.routes.ts
var import_express11 = require("express");
var import_zod9 = require("zod");

// apps/api/src/modules/members/members.service.ts
function toProfileDto(row) {
  return {
    id: row.id,
    matricule: row.matricule,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    createdAt: row.created_at,
    activatedAt: row.activated_at
  };
}
var MembersService = class {
  async getProfile(memberId) {
    const member = await knex("members").where({ id: memberId }).whereNull("deleted_at").first();
    if (!member) throw AppError.notFound("Membre introuvable");
    return toProfileDto(member);
  }
  async updateProfile(memberId, input) {
    const member = await knex("members").where({ id: memberId }).whereNull("deleted_at").first();
    if (!member) throw AppError.notFound("Membre introuvable");
    if (input.email && input.email !== member.email) {
      const taken = await knex("members").where({ email: input.email }).whereNot({ id: memberId }).first();
      if (taken) throw AppError.conflict("Cet email est d\xE9j\xE0 utilis\xE9.");
    }
    const patch = { updated_at: (/* @__PURE__ */ new Date()).toISOString() };
    if (input.firstName !== void 0) patch.first_name = input.firstName;
    if (input.lastName !== void 0) patch.last_name = input.lastName;
    if (input.email !== void 0) patch.email = input.email;
    if (input.phone !== void 0) patch.phone = input.phone || null;
    await knex("members").where({ id: memberId }).update(patch);
    await AuditService.record({
      actorId: memberId,
      action: "member.profile_updated",
      entityType: "member",
      entityId: memberId,
      after: patch
    });
    return this.getProfile(memberId);
  }
};

// apps/api/src/modules/members/members.controller.ts
var MembersController = class {
  service = new MembersService();
  me = async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ data: await this.service.getProfile(user.id) });
    } catch (err) {
      next(err);
    }
  };
  updateMe = async (req, res, next) => {
    try {
      const user = req.user;
      res.json({ data: await this.service.updateProfile(user.id, req.body) });
    } catch (err) {
      next(err);
    }
  };
};

// apps/api/src/modules/members/members.routes.ts
var router11 = (0, import_express11.Router)();
var controller11 = new MembersController();
var updateProfileSchema = import_zod9.z.object({
  body: import_zod9.z.object({
    firstName: import_zod9.z.string().min(2).max(100).optional(),
    lastName: import_zod9.z.string().min(2).max(100).optional(),
    email: import_zod9.z.string().email().max(255).optional(),
    phone: import_zod9.z.string().max(50).optional()
  })
});
router11.use(authMiddleware);
router11.get("/me", controller11.me);
router11.patch("/me", validate(updateProfileSchema), controller11.updateMe);
var members_routes_default = router11;

// apps/api/src/app.ts
var app = (0, import_express12.default)();
app.use((0, import_helmet.default)({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use((0, import_cors.default)({ origin: true, credentials: true }));
app.use(import_express12.default.json({ limit: "2mb" }));
app.use((0, import_cookie_parser.default)());
app.use(requestIdMiddleware);
app.use("/uploads", import_express12.default.static(import_path4.default.join(process.cwd(), "uploads")));
app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() }));
var prefix = env.API_PREFIX;
app.use(`${prefix}/auth`, auth_routes_default);
app.use(`${prefix}/members`, members_routes_default);
app.use(`${prefix}/sponsorship`, sponsorship_routes_default);
app.use(`${prefix}/cms`, cms_routes_default);
app.use(`${prefix}/newsletter`, newsletter_routes_default);
app.use(`${prefix}/admin`, admin_routes_default);
app.use(`${prefix}/articles`, articles_routes_default);
app.use(`${prefix}/courses`, courses_routes_default);
app.use(`${prefix}/events`, events_routes_default);
app.use(`${prefix}/uploads`, uploads_routes_default);
app.use(`${prefix}/contact`, contact_routes_default);
app.use(errorHandler);

// apps/api/src/vercel/handler.ts
var handler_default = app;
