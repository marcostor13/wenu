"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.patch = exports.get = exports.all = exports.create = void 0;
const admin = __importStar(require("firebase-admin"));
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { displayName, password, email, role } = req.body;
            if (!displayName || !password || !email || !role) {
                return res.status(400).send({ message: 'Missing fields' });
            }
            const { uid } = yield admin.auth().createUser({
                displayName,
                password,
                email
            });
            yield admin.auth().setCustomUserClaims(uid, { role });
            return res.status(201).send({ uid });
        }
        catch (err) {
            return handleError(res, err);
        }
    });
}
exports.create = create;
function handleError(res, err) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
function all(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const listUsers = yield admin.auth().listUsers();
            const users = listUsers.users.map(mapUser);
            return res.status(200).send({ users });
        }
        catch (err) {
            return handleError(res, err);
        }
    });
}
exports.all = all;
function mapUser(user) {
    const customClaims = (user.customClaims || { role: '' });
    const role = customClaims.role ? customClaims.role : '';
    return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        role: role,
        lastSignInTime: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime
    };
}
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const user = yield admin.auth().getUser(id);
            return res.status(200).send({ user: mapUser(user) });
        }
        catch (err) {
            return handleError(res, err);
        }
    });
}
exports.get = get;
function patch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { displayName, password, email, role } = req.body;
            if (!id || !displayName || !password || !email || !role) {
                return res.status(400).send({ message: 'Missing fields' });
            }
            yield admin.auth().updateUser(id, { displayName, password, email });
            yield admin.auth().setCustomUserClaims(id, { role });
            const user = yield admin.auth().getUser(id);
            return res.status(204).send({ user: mapUser(user) });
        }
        catch (err) {
            return handleError(res, err);
        }
    });
}
exports.patch = patch;
function remove(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield admin.auth().deleteUser(id);
            return res.status(204).send({});
        }
        catch (err) {
            return handleError(res, err);
        }
    });
}
exports.remove = remove;
//# sourceMappingURL=auth.controller.js.map