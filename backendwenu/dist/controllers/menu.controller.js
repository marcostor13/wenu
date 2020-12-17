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
const collection = 'menu';
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, observations, days } = req.body;
            yield admin.firestore().collection(collection).add({
                name: name ? name : '',
                observations: observations ? observations : '',
            });
            return res.status(200).send({ message: 'Información creada' });
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
        const snapshot = yield admin.firestore().collection(collection).get();
        if (snapshot.empty) {
            return res.status(200).send([]);
        }
        const results = [];
        snapshot.forEach((doc) => {
            results.push({
                id: doc.id,
                data: doc.data()
            });
        });
        return res.status(200).json(results);
    });
}
exports.all = all;
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const snapshot = yield admin.firestore().collection(collection).where('uid', '==', id).get();
        if (snapshot.empty) {
            return res.status(200).send([]);
        }
        const results = [];
        snapshot.forEach((doc) => {
            results.push({
                id: doc.id,
                data: doc.data()
            });
        });
        return res.status(200).json(results);
    });
}
exports.get = get;
function patch(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { name, observations } = req.body;
            const data = {
                name: name,
                observations: observations
            };
            return yield admin.firestore().collection(collection).doc(id).update(data).then(_ => {
                return res.status(200).send({ message: 'Información actualizada' });
            });
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
            return yield admin.firestore().collection(collection).doc(id).delete().then(_ => {
                return res.status(200).send({ message: 'Información eliminada' });
            });
        }
        catch (err) {
            return handleError(res, err);
        }
    });
}
exports.remove = remove;
//# sourceMappingURL=menu.controller.js.map