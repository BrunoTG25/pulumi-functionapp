# Azure Function Component

This project provides a reusable Azure Function component built using Pulumi. It encapsulates the logic for creating Azure Functions, including defining triggers and configuring bindings.

## Project Structure

```
azure-function-component
├── src
│   ├── components
│   │   └── FunctionAppComponent.ts
│   └── index.ts
├── tests
│   └── FunctionAppComponent.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd azure-function-component
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Pulumi:**
   Ensure you have Pulumi installed and configured with your Azure account.

4. **Set up your environment:**
   You may need to set environment variables for your Azure credentials.

## Usage

To deploy the Azure Function, run the following command:

```bash
pulumi up
```

This command will initialize the `FunctionAppComponent` and deploy the Azure Function based on the defined configuration.

## Running Tests

To run the unit tests for the `FunctionAppComponent`, use the following command:

```bash
npm test
```

This will execute the tests defined in `tests/FunctionAppComponent.test.ts` to verify the functionality of the component.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.