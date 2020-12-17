"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthorized = void 0;
function isAuthorized(opts) {
    return (req, res, next) => {
        const { role, email, uid } = res.locals;
        const { id } = req.params;
        if (email === 'marcostor13@gmail.com')
            return next();
        if (opts.allowSameUser && id && uid === id)
            return next();
        if (!role)
            return res.status(403).send();
        if (opts.hasRole.includes(role))
            return next();
        return res.status(403).send();
    };
}
exports.isAuthorized = isAuthorized;
//# sourceMappingURL=authorized.js.map