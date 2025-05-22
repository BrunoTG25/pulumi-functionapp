import { FunctionAppComponent } from './components/FunctionAppComponent';

const functionApp = new FunctionAppComponent({
    name: 'myFunctionApp',
    resourceGroupName: 'myResourceGroup',
    storageAccountName: 'mystorageaccount',
    storageAccountKey: 'fakekey', // Replace with actual key or secret
    appServicePlanId: 'myAppServicePlan',
    appSettings: {
        CUSTOM_SETTING: 'value'
    },
    runtime: 'node',
    runtimeVersion: '18',
    osType: 'linux'
});

export const output = functionApp.functionApp.name;