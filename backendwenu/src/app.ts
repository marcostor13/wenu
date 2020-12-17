import express, { Application } from 'express'
import authRoutes from "./routes/auth.route";
import generalRoutes from "./routes/general.routes";
import menusRoutes from "./routes/menus.routes";
import scrapingRoutes from "./routes/scraping.routes";

import morgan from 'morgan'
import * as admin from 'firebase-admin';
import cors from 'cors';

const serviceAccount: any = {
    "type": "service_account",
    "project_id": "wenu-65f63",
    "private_key_id": "fe2574cab7745ba81c16a35a90b9eee8bddaa76d",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCKoyz1coOjnM+G\nAQcYM5AZVljkOi1kkecLuI2cNAY1/PnMRNJbZrl/rgSCuFXu/a1zBYSffFsQJOfs\nqHkY+fBeaDyZbjSOXZAgaEy8t2XjyNkX96UU43EsWDE6lNZopTQ1ziy/YsowrNSj\n4kDlOX1LoSwo0rqWaf6FwiIb21QI/CDx4sq32dSfNkQGk/RBs8LTSV9jcexzY9CS\nSDTbD39T6GhfPcEtkDaJX7DKEQhLs1cW5ND2lMCLYLHXfjIeLvOsUATbJVMaV/UV\nd8cfLQ6llIDvFgxHCBdwLgwrrCWzzUN/dT44d/ezRZpgRarVraVR+7om51BlCIkY\n9Y8tMo2hAgMBAAECggEAAb3tfv8/iA0MprXxOFCwCiB1jRcNylRiuTkKNvToodGm\nFBbmh3lXwfLeWcPeCQrhDLecWCpmZMJY82ZVwK6FwpLn1YPu5z3F1YFn+uxJPIKh\n1ykwdt3pdm2cfzxe4glW2cj3kxdHO/O094LsjrDBajOKB/CHYYPPC9BR0ESqBnOb\nTJyjhahV+NiV+w9rCWvJud0UM5+AeMc8mkcojS/IoNfKd4tQSVhu3ydfa4tIu/Si\nkuGCNobb+0iFJZo+rG9kCgiAkCXki8h218tqttCishMVPNQH4b7J8XVwlHEEYblX\nhrkfwhZVBvPK1veHnu66RjyaycfTkRXMDJpp/E/e8QKBgQC+StdcwPOz6+m6QpmN\nxFZA0o5c+Zv5rDhZ/AwTSyi/nWky7Fs8RZNqoR7KEpu9jUhFVEFgOX29VSkCS0DJ\nmlhehl8w0gV48p4A1FiG6xmo/XYnrEi2RWp+4n8t49M/U9LXdgfLWL04i4diLjsL\nDgLZxlGo/jfVfInjofn40/N+EQKBgQC6gjkltODrOo7K5A0GEOshsiKw5Z++917z\n7hPscqGw9uVlVqlyB0LQ0M1mwJDk7hBvblKAaIE84HMga/XROscumNJjo/FfLoEo\nYmJrjx3d8gYyRYk+XtSBww6NfFaiBTS7zJn4af1vsTaeZfZPqMfRj4yaLmu23C3Z\ntMiwpVfGkQKBgGsNZYz7y94rWOj9MK+Nhcyf55Esp2/VUDpnTk/IV5s8rgME7urA\nZYd2LwEVaOJBSigel0zP6woJj7GHrmH8X7yFsaWgcY2yR+tFiqwUNPJZ7Q+yn5FT\nCe9p8oxZf+0/dfzanNXsDT9zV22HfpXggwAKzsPYiIaksloKNLukWXZRAoGAGb2h\nT3/wTubNEFl7JqwtF4BzY0C91GhltXrVSxvjDv50WJEmX7N62EEJKDZJiR8GK6rp\nPgmuVI2RthbQXWkkVl0HJHNa+8z6TG2PsdKVx60Ah+2q7G3AHIykNIjFmCTpy0WI\nto1CSikGJcRiw0nDEjwipqDjguBOf66AyEh5ndECgYA1GouHvH+/Jq8dy++0zPl1\noNbILZTAos+lW8Y1MyN7rdVuDZS/NCnKQjRQ4/bhgZ0De6rZDBChWjLl8SOZ8Z0z\nk3rZWn6IE0gWeyCViU70GIdqeKoH925nT1c3jjULA/BvIgESB+OTfdrxw5TLQr69\nB0/dZyUgy3aIJxlMjKvM4g==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-iyg89@wenu-65f63.iam.gserviceaccount.com",
    "client_id": "115708423983369954298",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-iyg89%40wenu-65f63.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wenu-65f63.firebaseio.com"
});


const app: Application = express()

//Setting

app.set('port', 3000)
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())

//middlewares

app.use(morgan('dev'))

//Routes

app.use(authRoutes)
app.use(generalRoutes)
app.use(menusRoutes)
app.use(scrapingRoutes)


export default app