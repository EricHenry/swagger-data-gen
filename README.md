_This project is based on [booknds/swagger-data-generator](https://github.com/booknds/swagger-data-generator)_

# swagger-data-gen
A command line interface (CLI) to generate mock test data from a Swagger Doc

**_New_**:
 - Use this project in your code! (still in beta)
 - Tries its best to give you real looking data.

## Usage

### CLI
Generate a json file filled with mock data of your API from your Swagger/OpenAPI Doc.
 - Supports both YAML and JSON Swagger/OpenAPI file formats.
 - Scans the defined definitions and creates the test data based it.
 - creates data for every definition property, not just the required fields.

```shell
# install via npm
$: npm install swagger-data-gen -g

# specified output file will br created if it does not already exist.
$: swagger-data-gen <path-to-input-file> <path-to-output-file>

```

### Library

Install:
```shell
$: npm install -save swagger-data-gen
```

Simplest use case
```ts
// importing entire package
import SwaggerDataGen from 'swagger-data-gen';

let generatedData;

swaggerDataGenerator.build('./samples/PetStore.yaml')
    .then((api: Swagger) => {
        generatedData = SwaggerDataGen.generateData(swaggerObject);
    });

// access genereated data by definition name on swagger doc
const petData = generatedData.pet;

//-----------------------------------------------------------------------------//
// importing specific functions
import { build, generate } from 'swagger-data-gen';

let generatedData;

build('./samples/Perscription.json')
    .then((api: Swagger) => {
        generatedData = generateData(swaggerObject);
    });

// access genereated data by definition name on swagger doc
const customerData = generatedData.customer;
```

## Coming Soon
 - CLI options
    - specify and create multiple random copies of the data
    - each definition getting its own output file
    - option to chose between generating all data or only required data.


## Contribute
 - Found a problem? Submit an issue!
 - Want to contribute? Submit a PR, with a description of what you are trying to add. I would ask to focus on any of the points in **Coming Soon**

