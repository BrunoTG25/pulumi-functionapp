import { FunctionAppComponent } from './components/FunctionAppComponent';

// Obtenemos configuraciones desde variables de entorno
const config = {
    runtime: process.env.FUNCTION_RUNTIME as "node" | "dotnet" | "python" | "java" || "node",
    runtimeVersion: process.env.FUNCTION_RUNTIME_VERSION || "18",
    osType: process.env.FUNCTION_OS_TYPE || "linux"
};

// 🔹 Function App en plan de consumo (Dynamic - Y1)
const functionAppConsumption = new FunctionAppComponent({
    name: 'function-consumption',
    resourceGroupName: 'myResourceGroup',
    storageAccountName: 'mystorageaccount1',
    storageAccountKey: 'fakekey1', // Usá Azure Key Vault en producción
    appSettings: {
        CUSTOM_SETTING: 'consumption-mode'
    },
    runtime: config.runtime,
    runtimeVersion: config.runtimeVersion,
    osType: config.osType
    // No se pasa appServicePlanId → se crea automáticamente con tier "Dynamic"
});

// 🔹 Function App con App Service Plan (por ejemplo S1)
const functionAppDedicated = new FunctionAppComponent({
    name: 'function-dedicated',
    resourceGroupName: 'myResourceGroup',
    storageAccountName: 'mystorageaccount2',
    storageAccountKey: 'fakekey2',
    appServicePlanId: 'myAppServicePlan', // Debe existir o crearse antes
    appSettings: {
        CUSTOM_SETTING: 'dedicated-plan-mode'
    },
    runtime: config.runtime,
    runtimeVersion: config.runtimeVersion,
    osType: config.osType
});

// 🔸 Exportar nombres de ambas funciones
export const consumptionAppName = functionAppConsumption.functionApp.name;
export const dedicatedAppName = functionAppDedicated.functionApp.name;
