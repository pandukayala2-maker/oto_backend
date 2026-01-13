
#!/bin/bash

# Get the current directory name
FOLDER_NAME=$(basename "$PWD")

# Convert folder name to CamelCase (PascalCase)
UPPER_FOLDER_NAME=$(echo "$FOLDER_NAME" | sed -E 's/(^|_)([a-z])/\U\2/g' | sed -E 's/^([a-z])/\U\1/')

# Convert folder name to lowercase (useful for filenames)
LOWER_FOLDER_NAME=$(echo "$FOLDER_NAME" | tr '[:upper:]' '[:lower:]')

# Define the file names based on the folder name
CONTROLLER_FILE="${LOWER_FOLDER_NAME}_controller.ts"
MODEL_FILE="${LOWER_FOLDER_NAME}_model.ts"
VALIDATIONS_FILE="${LOWER_FOLDER_NAME}_validations.ts"
SERVICES_FILE="${LOWER_FOLDER_NAME}_services.ts"
ROUTES_FILE="${LOWER_FOLDER_NAME}_routes.ts"

# Create the controller file with the specified content
cat <<EOL > "$CONTROLLER_FILE"
import { NextFunction, Request, Response } from 'express';
import { ServerIssueError } from '../../common/base_error';
import MediaHandler from '../../middleware/media_handler';
import { baseResponse } from '../../middleware/response_handler';
import { ${UPPER_FOLDER_NAME}Document } from './${LOWER_FOLDER_NAME}_model';
import ${UPPER_FOLDER_NAME}Services from './${LOWER_FOLDER_NAME}_services';

class ${UPPER_FOLDER_NAME}Controller {
    static create = async (req: Request, res: Response, next: NextFunction) => {
        const category: ${UPPER_FOLDER_NAME}Document = req.body;
        const data = await ${UPPER_FOLDER_NAME}Services.create(category);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError());
    };

    static update = async (req: Request, res: Response, next: NextFunction) => {
        const categoryDoc: ${UPPER_FOLDER_NAME}Document = req.body;
        const id: string = req.params.id ?? req.body._id;
        const data = await ${UPPER_FOLDER_NAME}Services.update(categoryDoc, id);
        return data ? baseResponse({ res: res, data: data }) : next(new ServerIssueError('Error while updating'));
    };

    static find = async (req: Request, res: Response, next: NextFunction) => {
        const query: any = {};
        if (req.query.name) query.name = RegExp(\`^\${req.query.name}\`, 'i');
        if (req.query.type) query.type = req.query.type;
        const data: ${UPPER_FOLDER_NAME}Document[] = await ${UPPER_FOLDER_NAME}Services.find(query);
        return baseResponse({ res: res, data: data });
    };

    static delete = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id ?? req.body._id;
        const data = await ${UPPER_FOLDER_NAME}Services.update({ deleted_at: new Date() }, id);
        return data ? baseResponse({ res: res, message: 'Successfully Deleted' }) : next(new ServerIssueError('Error while deleting'));
    };
}

export default ${UPPER_FOLDER_NAME}Controller;
EOL

# Create the model file with the specified content
cat <<EOL > "$MODEL_FILE"
import { Schema, model } from 'mongoose';
import { BaseDocument, baseSchema } from '../../common/base_model';

interface ${UPPER_FOLDER_NAME}Document extends BaseDocument {
    name: string;
}

const ${LOWER_FOLDER_NAME}Schema = new Schema<${UPPER_FOLDER_NAME}Document>({
    name: { type: String, trim: true, required: true }
});

${LOWER_FOLDER_NAME}Schema.add(baseSchema);

const ${UPPER_FOLDER_NAME}Model = model<${UPPER_FOLDER_NAME}Document>('${LOWER_FOLDER_NAME}s', ${LOWER_FOLDER_NAME}Schema);

export { ${UPPER_FOLDER_NAME}Document, ${UPPER_FOLDER_NAME}Model };
EOL

# Create the validation file with the specified content
cat <<EOL > "$VALIDATIONS_FILE"
import BaseValidator from '../../common/base_validator';
import CustomErrorHandler from '../../middleware/error_handler';

class ${UPPER_FOLDER_NAME}Validations extends BaseValidator {
    static create = [this.nameField(), CustomErrorHandler.requestValidator];
}

export default ${UPPER_FOLDER_NAME}Validations;
EOL

# Create the routes file with the specified content
cat <<EOL > "$ROUTES_FILE"
import { Router } from 'express';
import asyncHandler from '../../middleware/async_handler';
import { validateId } from '../../middleware/payload_handler';
import JWTToken from '../../utils/tokens';
import ${UPPER_FOLDER_NAME}Controller from './${LOWER_FOLDER_NAME}_controller';
import ${UPPER_FOLDER_NAME}Validations from './${LOWER_FOLDER_NAME}_validations';

const router = Router();

router.get('/', JWTToken.validateAccessToken, asyncHandler(${UPPER_FOLDER_NAME}Controller.find));
router.post('/', JWTToken.validateAccessToken, ${UPPER_FOLDER_NAME}Validations.create, asyncHandler(${UPPER_FOLDER_NAME}Controller.create));
router.patch('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(${UPPER_FOLDER_NAME}Controller.update));
router.delete('/:id', validateId, JWTToken.validateAccessToken, asyncHandler(${UPPER_FOLDER_NAME}Controller.delete));

export default router;
EOL

# Create the services file with the specified content
cat <<EOL > "$SERVICES_FILE"
import { ${UPPER_FOLDER_NAME}Document, ${UPPER_FOLDER_NAME}Model } from './${LOWER_FOLDER_NAME}_model';

class ${UPPER_FOLDER_NAME}Services {
    static create = async (data: ${UPPER_FOLDER_NAME}Document): Promise<${UPPER_FOLDER_NAME}Document> => await ${UPPER_FOLDER_NAME}Model.create(data);

    static update = async (data: Partial<${UPPER_FOLDER_NAME}Document>, id: string) => await ${UPPER_FOLDER_NAME}Model.findByIdAndUpdate(id, data, { new: true });

    static find = async (filter: any): Promise<${UPPER_FOLDER_NAME}Document[]> => await ${UPPER_FOLDER_NAME}Model.find(filter);

    static findById = async (filter: string) => await ${UPPER_FOLDER_NAME}Model.findById(filter);

    static delete = async (id: string) => await ${UPPER_FOLDER_NAME}Model.findByIdAndDelete(id);
}

export default ${UPPER_FOLDER_NAME}Services;
EOL

# ANSI escape codes for colors
RED="\033[1;31m"
YELLOW="\033[1;33m"
RESET="\033[0m"

echo ""
echo -e "${RED}CHEERS${RESET} to my ${YELLOW}SUNFLOWER 🌻${RESET}"
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