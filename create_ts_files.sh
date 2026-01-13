#!/bin/bash

# Get the current directory name
FOLDER_NAME=$(basename "$PWD")

# Define the file names based on the folder name
CONTROLLER_FILE="${FOLDER_NAME}_controller.ts"
MODEL_FILE="${FOLDER_NAME}_model.ts"
VALIDATIONS_FILE="${FOLDER_NAME}_validations.ts"
SERVICES_FILE="${FOLDER_NAME}_services.ts"
ROUTES_FILE="${FOLDER_NAME}_routes.ts"

# Create the controller file with the specified content
cat <<EOL > "$CONTROLLER_FILE"
import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import MediaHandler from '../../middleware/media_handler';
import { baseResponse } from '../../middleware/response_handler';
import { ${FOLDER_NAME^}Document } from './${FOLDER_NAME,,}_model';
import ${FOLDER_NAME^}Services from './${FOLDER_NAME,,}_services';

class ${FOLDER_NAME^}Controller {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const category: ${FOLDER_NAME^}Document = req.body;
        const data = await ${FOLDER_NAME^}Services.create(category);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const categoryDoc: ${FOLDER_NAME^}Document = req.body;
        const id: string = req.params.id ?? req.body._id;
        // if (categoryDoc.image) {
        //     const previousData = await ${FOLDER_NAME^}Services.findById(id);
        //     const fullPath: string = MediaHandler.getRootPath() + previousData?.image;
        //     await MediaHandler.removeFile(fullPath);
        // }
        const data = await ${FOLDER_NAME^}Services.update(categoryDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(\`^\${req.query.name}\`, 'i');
        if (req.query.type) query.type = req.query.type;
        const data: ${FOLDER_NAME^}Document[] = await ${FOLDER_NAME^}Services.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await ${FOLDER_NAME^}Services.update({ deleted_at: new Date() }, id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default ${FOLDER_NAME^}Controller;
EOL

# Create the model file with the specified content
cat <<EOL > "$MODEL_FILE"
import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface ${FOLDER_NAME^}Document extends BaseDocument {
    name: string;
}

const ${FOLDER_NAME,,}Schema = new Schema<${FOLDER_NAME^}Document>({
    name: { type: String, trim: true, required: true }
});

${FOLDER_NAME,,}Schema.add(baseSchema);

//${FOLDER_NAME,,}Schema.index({ name: 1, deleted_at: 1, type: 1 }, { unique: true });

const ${FOLDER_NAME^}Model = model<${FOLDER_NAME^}Document>('${FOLDER_NAME,,}s', ${FOLDER_NAME,,}Schema);

export { ${FOLDER_NAME^}Document, ${FOLDER_NAME^}Model };
EOL

# Create the validation file with the specified content
cat <<EOL > "$VALIDATIONS_FILE"
import BaseValidator from '../../common/base_validator';
import CustomErrorHandler from '../../middleware/error_handler';

class ${FOLDER_NAME^}Validations extends BaseValidator {
    static create = [this.nameField(), CustomErrorHandler.requestValidator];
}

export default ${FOLDER_NAME^}Validations;
EOL

# Create the routes file with the specified content
cat <<EOL > "$ROUTES_FILE"
import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import ${FOLDER_NAME^}Controller from './${FOLDER_NAME,,}_controller';
import ${FOLDER_NAME^}Validations from './${FOLDER_NAME,,}_validations';

const router = Router();

router.get('/', JWTToken.validateAccessToken, asyncHandler(${FOLDER_NAME^}Controller.find));
router.post('/', JWTToken.validateAccessToken, ${FOLDER_NAME^}Validations.create, asyncHandler(${FOLDER_NAME^}Controller.create));
router.patch('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(${FOLDER_NAME^}Controller.update));
router.delete('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(${FOLDER_NAME^}Controller.delete));

export default router;
EOL

# Create the services file with the specified content
cat <<EOL > "$SERVICES_FILE"
import { ${FOLDER_NAME^}Document, ${FOLDER_NAME^}Model } from './${FOLDER_NAME,,}_model';

class ${FOLDER_NAME^}Services {
    static create = async (data: ${FOLDER_NAME^}Document): Promise<${FOLDER_NAME^}Document> => await ${FOLDER_NAME^}Model.create(data);

    static update = async (data: Partial<${FOLDER_NAME^}Document>, id: string) => await ${FOLDER_NAME^}Model.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any): Promise<${FOLDER_NAME^}Document[]> => await ${FOLDER_NAME^}Model.find(filter);

    static findById = async (filter: string) => await ${FOLDER_NAME^}Model.findById(filter);

    static delete = async (id: string) => await ${FOLDER_NAME^}Model.findByIdAndDelete(id); 
}

export default ${FOLDER_NAME^}Services;
EOL

# ANSI escape codes for colors
RED="\033[1;31m"
YELLOW="\033[1;33m"
RESET="\033[0m"


echo ""
echo -e "${RED}CHEERS${RESET} to my ${YELLOW}SUNFLOWER 🌻${RESET}"
echo ""
echo ""


echo "Created files:"

echo "$CONTROLLER_FILE"
echo "$MODEL_FILE"
echo "$VALIDATIONS_FILE"
echo "$SERVICES_FILE"
echo "$ROUTES_FILE"
echo ""


#### steps ####

#to create
#nano ~/create_ts_files.sh

#to give premisiion
#chmod +x ~/create_ts_files.sh

#to move to global path
#sudo mv ~/create_ts_files.sh /usr/local/bin/create_ts_files

#to restart
#source ~/.bashrc


# and now to create open terminal of the folder and run
#create_ts_files

# this will create [controllers,validators,models,routes,service] ts files inside the folder with folders name