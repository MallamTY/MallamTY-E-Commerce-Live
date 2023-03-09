
import express, {Request, Response, NextFunction} from 'express';
import { MONGO_URI, configType, PORT} from './accessories/configuration';
import connectDB from './db/dbConnect';
import morgan from 'morgan';
import routes from './route';
import { StatusCodes } from 'http-status-codes';

const app = express();
app.use(morgan('common'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/ecommerce/v1', routes);


class App {
    private port: configType;

    constructor() {
        this.port =  PORT;
        this.startUp();
        this.home();
        this.errorHander();
    }

    private startUp = async() => {
        try {
            const port: configType = PORT || 9000;
            await connectDB(MONGO_URI)
            app.listen(port,() => console.log(`\neCommerce-API running on port ${port}...`))
                    
         } catch (error: any) {
             console.log(`${error.message} was encountered while trying to connect to the database`);
             process.exit(1)
             
         } 
    }

    private home(): void {
        app.get('*', (req, res) => {
            return res.status(StatusCodes.OK).json({
                status: `success`,
                messgae: `Welcome to MallamTY E-Commerce Page`
            })
        })
    }

    private errorHander(): void {
        app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: err.message
            })  
        });
    }
}

export default new App();