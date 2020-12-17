import { Request, Response } from "express";
import * as admin from 'firebase-admin'


export async function create(req: Request, res: Response) {
    try {
        const { data, collection } = req.body
        await admin.firestore().collection(collection).add(JSON.parse(data))
        return res.status(200).send({ message: 'Información creada' })
    } catch (err) {
        return handleError(res, err)
    }
}


function handleError(res: Response, err: any) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}

export async function all(req: Request, res: Response) {
    const { collection } = req.body
    const snapshot = await admin.firestore().collection(collection).get()
    if (snapshot.empty) {
        return res.status(200).send([])
    }
    const results: any = [];
    snapshot.forEach((doc) => {
        results.push({
            id: doc.id,
            data: doc.data()
        });
    });
    return res.status(200).json(results);
}

export async function get(req: Request, res: Response) {
    const { collection, id } = req.params
    const snapshot = await admin.firestore().collection(collection).doc(id).get()    
    const results: any = {
        id: snapshot.id,
        data: snapshot.data()
    }
    return res.status(200).json(results);
}

export async function patch(req: Request, res: Response) {

    
    try {
        const { collection, id } = req.params
        const { data } = req.body
        return await admin.firestore().collection(collection).doc(id).update(JSON.parse(data)).then(_ => {
            return res.status(200).send({ message: 'Información actualizada' })
        })
    } catch (err) {
        return handleError(res, err)
    }
}

export async function remove(req: Request, res: Response) {
    try {
        const { collection, id } = req.params
        return await admin.firestore().collection(collection).doc(id).delete().then(_ => {
            return res.status(200).send({ message: 'Información eliminada' })
        })
    } catch (err) {
        return handleError(res, err)
    }
}