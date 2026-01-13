import mongoose from 'mongoose';
import Config from './dot_config';

const database_url: string = Config._DB_URL;
const database_name: string = Config._DB_NAME;
mongoose.connect(database_url, { dbName: database_name });
const connection = (): void => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', function () {
        console.log('Connected to the database.');
    });
};

export default connection;
