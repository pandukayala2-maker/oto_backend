import cors from 'cors';
import express, { Express } from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import router from './common/base_routes';
import connection from './config/database';
import Config from './config/dot_config';
import { envEnum } from './constant/enum';
import ErrorHandler from './middleware/error_handler';
import payloadHandler from './middleware/payload_handler';
import { apiRequestInfo, logger } from './utils/logger';

connection();

const app: Express = express();
const port: string = Config._PORT;

app.use(express.static(path.join(__dirname, '..', 'assets/')));

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiRequestInfo);
app.use(payloadHandler);

app.use('/v1', router);

app.use(ErrorHandler.invalidEndPointHandler);
app.use(ErrorHandler.errorHandler);

if (Config._APP_ENV === envEnum.production || Config._APP_ENV === envEnum.staging) {
    const options: Record<string, unknown> = {
        key: fs.readFileSync('./certificates/key.key'),
        cert: fs.readFileSync('./certificates/cert.csr')
    };
    https.createServer(options, app).listen(port, function () {
        logger.info(`Secure Server Started with SSL at port : ${port}`);
    });
} else {
    app.listen(port, () => {
        logger.info(`Local server started at port : ${port}`);
    });
}
