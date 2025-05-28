import { FunctionAppComponent } from './components/FunctionAppComponent';

// Example: Make runtime and version dynamic using environment variables or config
const config = {
    runtime: process.env.FUNCTION_RUNTIME as "node" | "dotnet" | "python" | "java" || "node",
    runtimeVersion: process.env.FUNCTION_RUNTIME_VERSION || "18",
    osType: process.env.FUNCTION_OS_TYPE || "linux"
};

const functionApp = new FunctionAppComponent({
    name: 'myFunctionApp',
    resourceGroupName: 'myResourceGroup',
    storageAccountName: 'mystorageaccount',
    storageAccountKey: 'fakekey', // Replace with actual key or secret
    appServicePlanId: 'myAppServicePlan',
    appSettings: {
        CUSTOM_SETTING: 'value'
    },
    runtime: config.runtime,
    runtimeVersion: config.runtimeVersion,
    osType: config.osType
});

export const output = functionApp.functionApp.name;