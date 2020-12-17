import { Request, Response } from "express";
import * as admin from 'firebase-admin'
import * as puppeteer from "puppeteer";

const gender = require('gender-detection');
// const collection = 'scraping'


const USERNAME_SELECTOR = '#loginForm input[name="username"]';
const PASSWORD_SELECTOR = '#loginForm input[name="password"]';
const CTA_SELECTOR = '#loginForm button[type="submit"]';
const SAVEINFORMATION_SELECTOR = '#react-root > section > main > div > div > div > section > div > button';
const FOLLOWERS_BUTTON_SELECTOR = '#react-root > section > main > div > header > section > ul > li:nth-child(2) > a';
// const FOLLOWERS_UL_SELECTOR = 'div.isgrP > ul';



export async function get(req: Request, res: Response) {

    

    const { instagramid } = req.params;
    console.log(req.params.instagramid)

    let result:any; 

    try{
        const browser = await puppeteer.launch({
            headless: true,
            product: 'chrome',
            args: ['--no-sandbox'],

        });
        const page = await browser.newPage();    
        await page.setViewport({ width: 1366, height: 768 });
        let cookies = await getCookies();

        if(cookies){
            cookies = JSON.parse(cookies.data.instagram)
            await page.setCookie(...cookies)
            const pageLoad = await page.goto('https://www.instagram.com/' + instagramid);
            console.log('YES COOKIES PAGE LOAD', pageLoad?.status());  
            
            if (pageLoad?.status() == 200) {

                const pageInfo = await page.goto(`https://www.instagram.com/${instagramid}/?__a=1`); 
                const json:any = await pageInfo?.json()
                const endCursor = json.graphql.user.edge_owner_to_timeline_media.page_info.end_cursor
                const accountid = json.graphql.user.id
                const followersURLs = await page.goto(`https://www.instagram.com/graphql/query/?query_id=17851374694183129&id=${accountid}&first=1000&after=${endCursor}`);
                const json2: any = await followersURLs?.json()

                let male = 0
                let female = 0
                let unknown = 0

                await json2.data.user.edge_followed_by.edges.forEach((element:any) => {
                    const followerName = element.node.full_name
                    const g = gender.detect(followerName);

                    if(g == 'male'){
                        male++
                    } else if (g == 'female'){
                        female++
                    } else if (g == 'unknown') {
                        unknown++
                    }

                });

                const data = {
                    male: male,
                    female: female,
                    unknown: unknown                    
                }

                return res.status(200).send({ result: data});                 
                
            }else{
                result = { message: 'YES Cookie Error PAGE LOAD' }                
            }
    

        }else{
            
            const pageLoad = await page.goto('https://www.instagram.com/' + instagramid);
            console.log('NO COOKIES PAGE LOAD', pageLoad?.status());           

            if (pageLoad?.status() == 200){

                await page.waitForSelector(FOLLOWERS_BUTTON_SELECTOR).then(async ()=>{
                    console.log('FOLLOWERS_BUTTON_SELECTOR ISSET')
                    await page.click(FOLLOWERS_BUTTON_SELECTOR);
                    
                    await page.waitForSelector(CTA_SELECTOR).then(async () => {

                        console.log('LOGIN START')
                        //LOGIN 
                        console.log('Followes with login');
                        await page.click(USERNAME_SELECTOR);
                        await page.keyboard.type('marcostor14@gmail.com');
                        await page.click(PASSWORD_SELECTOR);
                        await page.keyboard.type('@Libido2010');
                        await page.click(CTA_SELECTOR);
                        await page.waitForNavigation();

                        //SAVE COOKIES

                        const newcookies = await page.cookies();
                        const saveCookies = await saveOrUpdateCookies(newcookies);

                        if (saveCookies) {

                            page.waitForSelector(SAVEINFORMATION_SELECTOR, { timeout : 1000}).then(async _=> {  

                                await page.screenshot({ path: 'instagram1.png' });
                                //SAVE INFORMATION BUTTON ISSET 

                                await page.click(SAVEINFORMATION_SELECTOR);
                                await page.waitForNavigation();

                                if (pageLoad?.status() == 200) {

                                    const pageInfo = await page.goto(`https://www.instagram.com/${instagramid}/?__a=1`);
                                    const json: any = await pageInfo?.json()
                                    const endCursor = json.graphql.user.edge_owner_to_timeline_media.page_info.end_cursor
                                    const accountid = json.graphql.user.id
                                    const followersURLs = await page.goto(`https://www.instagram.com/graphql/query/?query_id=17851374694183129&id=${accountid}&first=1000&after=${endCursor}`);
                                    const json2: any = await followersURLs?.json()

                                    let male = 0
                                    let female = 0
                                    let unknown = 0

                                    await json2.data.user.edge_followed_by.edges.forEach((element: any) => {
                                        const followerName = element.node.full_name
                                        const g = gender.detect(followerName);

                                        if (g == 'male') {
                                            male++
                                        } else if (g == 'female') {
                                            female++
                                        } else if (g == 'unknown') {
                                            unknown++
                                        }

                                    });

                                    const data = {
                                        male: male,
                                        female: female,
                                        unknown: unknown
                                    }

                                    result = { data: data }

                                } else {
                                    result = { message: 'NO Cookie Error PAGE LOAD' }                                    
                                }

                                return res.status(200).send({ result: result });
                                
                               
                            }).catch(async (error:any)=>{
                                console.log('SAVE INFORMATION NO ISSET', error)
                                await page.waitForNavigation();

                                if (pageLoad?.status() == 200) {

                                    const pageInfo = await page.goto(`https://www.instagram.com/${instagramid}/?__a=1`);
                                    const json: any = await pageInfo?.json()
                                    const endCursor = json.graphql.user.edge_owner_to_timeline_media.page_info.end_cursor
                                    const accountid = json.graphql.user.id
                                    const followersURLs = await page.goto(`https://www.instagram.com/graphql/query/?query_id=17851374694183129&id=${accountid}&first=1000&after=${endCursor}`);
                                    const json2: any = await followersURLs?.json()

                                    let male = 0
                                    let female = 0
                                    let unknown = 0

                                    await json2.data.user.edge_followed_by.edges.forEach((element: any) => {
                                        const followerName = element.node.full_name
                                        const g = gender.detect(followerName);

                                        if (g == 'male') {
                                            male++
                                        } else if (g == 'female') {
                                            female++
                                        } else if (g == 'unknown') {
                                            unknown++
                                        }

                                    });

                                    const data = {
                                        male: male,
                                        female: female,
                                        unknown: unknown
                                    }

                                    result = { data: data }                                    
                                } else {
                                    result = { message: 'NO Cookie Error PAGE LOAD' }
                                }     
                                
                                return res.status(200).send({ result: result });
                            })
                            

                        } else {
                            result = { message: 'Error en SaveCookies' }                            
                        }

                    });                    
                });                
               
            }else{
                result = { message: 'No Cookie Error PAGE LOAD' }                   
            }                           
        }  
        
        return res.status(200).send(result);             
    } catch (err) {
        return handleError(res, err)
    }

}


async function saveOrUpdateCookies(cookies:any){

    const getCookie = await getCookies()
    const data = {
        instagram: JSON.stringify(cookies)
    }

    if (getCookie === false){
        try {        
            return await admin.firestore().collection('cookies').add(data).then(_ => {
                return true
            })
        } catch (err) {
            return false
        }
    }else{
        try {
            return await admin.firestore().collection('cookies').doc(getCookie.id).update(data).then(_ => {
                return true
            })
        } catch (err) {
            return false
        }
    }

}

async function getCookies() {
    const snapshot = await admin.firestore().collection('cookies').get()
    if (snapshot.empty) {
        return false
    }
    const results: any = [];
    snapshot.forEach((doc) => {
        results.push({
            id: doc.id,
            data: doc.data()
        });
    });
    return results[0];
}

function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}
