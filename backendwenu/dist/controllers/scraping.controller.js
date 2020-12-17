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
exports.get = void 0;
const admin = __importStar(require("firebase-admin"));
const puppeteer = __importStar(require("puppeteer"));
const gender = require('gender-detection');
// const collection = 'scraping'
const USERNAME_SELECTOR = '#loginForm input[name="username"]';
const PASSWORD_SELECTOR = '#loginForm input[name="password"]';
const CTA_SELECTOR = '#loginForm button[type="submit"]';
const SAVEINFORMATION_SELECTOR = '#react-root > section > main > div > div > div > section > div > button';
const FOLLOWERS_BUTTON_SELECTOR = '#react-root > section > main > div > header > section > ul > li:nth-child(2) > a';
// const FOLLOWERS_UL_SELECTOR = 'div.isgrP > ul';
function get(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { instagramid } = req.params;
        console.log(req.params.instagramid);
        let result;
        try {
            const browser = yield puppeteer.launch({
                headless: true,
                product: 'chrome',
                args: ['--no-sandbox'],
            });
            const page = yield browser.newPage();
            yield page.setViewport({ width: 1366, height: 768 });
            let cookies = yield getCookies();
            if (cookies) {
                cookies = JSON.parse(cookies.data.instagram);
                yield page.setCookie(...cookies);
                const pageLoad = yield page.goto('https://www.instagram.com/' + instagramid);
                console.log('YES COOKIES PAGE LOAD', pageLoad === null || pageLoad === void 0 ? void 0 : pageLoad.status());
                if ((pageLoad === null || pageLoad === void 0 ? void 0 : pageLoad.status()) == 200) {
                    const pageInfo = yield page.goto(`https://www.instagram.com/${instagramid}/?__a=1`);
                    const json = yield (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.json());
                    const endCursor = json.graphql.user.edge_owner_to_timeline_media.page_info.end_cursor;
                    const accountid = json.graphql.user.id;
                    const followersURLs = yield page.goto(`https://www.instagram.com/graphql/query/?query_id=17851374694183129&id=${accountid}&first=1000&after=${endCursor}`);
                    const json2 = yield (followersURLs === null || followersURLs === void 0 ? void 0 : followersURLs.json());
                    let male = 0;
                    let female = 0;
                    let unknown = 0;
                    yield json2.data.user.edge_followed_by.edges.forEach((element) => {
                        const followerName = element.node.full_name;
                        const g = gender.detect(followerName);
                        if (g == 'male') {
                            male++;
                        }
                        else if (g == 'female') {
                            female++;
                        }
                        else if (g == 'unknown') {
                            unknown++;
                        }
                    });
                    const data = {
                        male: male,
                        female: female,
                        unknown: unknown
                    };
                    return res.status(200).send({ result: data });
                }
                else {
                    result = { message: 'YES Cookie Error PAGE LOAD' };
                }
            }
            else {
                const pageLoad = yield page.goto('https://www.instagram.com/' + instagramid);
                console.log('NO COOKIES PAGE LOAD', pageLoad === null || pageLoad === void 0 ? void 0 : pageLoad.status());
                if ((pageLoad === null || pageLoad === void 0 ? void 0 : pageLoad.status()) == 200) {
                    yield page.waitForSelector(FOLLOWERS_BUTTON_SELECTOR).then(() => __awaiter(this, void 0, void 0, function* () {
                        console.log('FOLLOWERS_BUTTON_SELECTOR ISSET');
                        yield page.click(FOLLOWERS_BUTTON_SELECTOR);
                        yield page.waitForSelector(CTA_SELECTOR).then(() => __awaiter(this, void 0, void 0, function* () {
                            console.log('LOGIN START');
                            //LOGIN 
                            console.log('Followes with login');
                            yield page.click(USERNAME_SELECTOR);
                            yield page.keyboard.type('marcostor14@gmail.com');
                            yield page.click(PASSWORD_SELECTOR);
                            yield page.keyboard.type('@Libido2010');
                            yield page.click(CTA_SELECTOR);
                            yield page.waitForNavigation();
                            //SAVE COOKIES
                            const newcookies = yield page.cookies();
                            const saveCookies = yield saveOrUpdateCookies(newcookies);
                            if (saveCookies) {
                                page.waitForSelector(SAVEINFORMATION_SELECTOR, { timeout: 1000 }).then((_) => __awaiter(this, void 0, void 0, function* () {
                                    yield page.screenshot({ path: 'instagram1.png' });
                                    //SAVE INFORMATION BUTTON ISSET 
                                    yield page.click(SAVEINFORMATION_SELECTOR);
                                    yield page.waitForNavigation();
                                    if ((pageLoad === null || pageLoad === void 0 ? void 0 : pageLoad.status()) == 200) {
                                        const pageInfo = yield page.goto(`https://www.instagram.com/${instagramid}/?__a=1`);
                                        const json = yield (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.json());
                                        const endCursor = json.graphql.user.edge_owner_to_timeline_media.page_info.end_cursor;
                                        const accountid = json.graphql.user.id;
                                        const followersURLs = yield page.goto(`https://www.instagram.com/graphql/query/?query_id=17851374694183129&id=${accountid}&first=1000&after=${endCursor}`);
                                        const json2 = yield (followersURLs === null || followersURLs === void 0 ? void 0 : followersURLs.json());
                                        let male = 0;
                                        let female = 0;
                                        let unknown = 0;
                                        yield json2.data.user.edge_followed_by.edges.forEach((element) => {
                                            const followerName = element.node.full_name;
                                            const g = gender.detect(followerName);
                                            if (g == 'male') {
                                                male++;
                                            }
                                            else if (g == 'female') {
                                                female++;
                                            }
                                            else if (g == 'unknown') {
                                                unknown++;
                                            }
                                        });
                                        const data = {
                                            male: male,
                                            female: female,
                                            unknown: unknown
                                        };
                                        result = { data: data };
                                    }
                                    else {
                                        result = { message: 'NO Cookie Error PAGE LOAD' };
                                    }
                                    return res.status(200).send({ result: result });
                                })).catch((error) => __awaiter(this, void 0, void 0, function* () {
                                    console.log('SAVE INFORMATION NO ISSET', error);
                                    yield page.waitForNavigation();
                                    if ((pageLoad === null || pageLoad === void 0 ? void 0 : pageLoad.status()) == 200) {
                                        const pageInfo = yield page.goto(`https://www.instagram.com/${instagramid}/?__a=1`);
                                        const json = yield (pageInfo === null || pageInfo === void 0 ? void 0 : pageInfo.json());
                                        const endCursor = json.graphql.user.edge_owner_to_timeline_media.page_info.end_cursor;
                                        const accountid = json.graphql.user.id;
                                        const followersURLs = yield page.goto(`https://www.instagram.com/graphql/query/?query_id=17851374694183129&id=${accountid}&first=1000&after=${endCursor}`);
                                        const json2 = yield (followersURLs === null || followersURLs === void 0 ? void 0 : followersURLs.json());
                                        let male = 0;
                                        let female = 0;
                                        let unknown = 0;
                                        yield json2.data.user.edge_followed_by.edges.forEach((element) => {
                                            const followerName = element.node.full_name;
                                            const g = gender.detect(followerName);
                                            if (g == 'male') {
                                                male++;
                                            }
                                            else if (g == 'female') {
                                                female++;
                                            }
                                            else if (g == 'unknown') {
                                                unknown++;
                                            }
                                        });
                                        const data = {
                                            male: male,
                                            female: female,
                                            unknown: unknown
                                        };
                                        result = { data: data };
                                    }
                                    else {
                                        result = { message: 'NO Cookie Error PAGE LOAD' };
                                    }
                                    return res.status(200).send({ result: result });
                                }));
                            }
                            else {
                                result = { message: 'Error en SaveCookies' };
                            }
                        }));
                    }));
                }
                else {
                    result = { message: 'No Cookie Error PAGE LOAD' };
                }
            }
            return res.status(200).send(result);
        }
        catch (err) {
            return handleError(res, err);
        }
    });
}
exports.get = get;
function saveOrUpdateCookies(cookies) {
    return __awaiter(this, void 0, void 0, function* () {
        const getCookie = yield getCookies();
        const data = {
            instagram: JSON.stringify(cookies)
        };
        if (getCookie === false) {
            try {
                return yield admin.firestore().collection('cookies').add(data).then(_ => {
                    return true;
                });
            }
            catch (err) {
                return false;
            }
        }
        else {
            try {
                return yield admin.firestore().collection('cookies').doc(getCookie.id).update(data).then(_ => {
                    return true;
                });
            }
            catch (err) {
                return false;
            }
        }
    });
}
function getCookies() {
    return __awaiter(this, void 0, void 0, function* () {
        const snapshot = yield admin.firestore().collection('cookies').get();
        if (snapshot.empty) {
            return false;
        }
        const results = [];
        snapshot.forEach((doc) => {
            results.push({
                id: doc.id,
                data: doc.data()
            });
        });
        return results[0];
    });
}
function handleError(res, err) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
//# sourceMappingURL=scraping.controller.js.map