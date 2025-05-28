// This file exports a class `FunctionAppComponent` that encapsulates the logic for creating an Azure Function using Pulumi.

import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure";

export interface FunctionAppComponentArgs {
    name: string;
    resourceGroupName: pulumi.Input<string>;
    storageAccountName: pulumi.Input<string>;
    storageAccountKey: pulumi.Input<string>;
    appServicePlanId?: pulumi.Input<string>;
    appSettings?: pulumi.Input<{ [key: string]: pulumi.Input<string> }>;
    runtime?: pulumi.Input<"node" | "dotnet" | "python" | "java">;
    runtimeVersion?: pulumi.Input<string>;
    osType?: pulumi.Input<string>;
}

export class FunctionAppComponent {
    public readonly functionApp: azure.appservice.FunctionApp;
    public readonly appServicePlan: azure.appservice.Plan | undefined;

    constructor(args: FunctionAppComponentArgs) {
        let appServicePlanId = args.appServicePlanId;

        if (!appServicePlanId) {
            const plan = new azure.appservice.Plan(`${args.name}-plan`, {
                resourceGroupName: args.resourceGroupName,
                sku: {
                    tier: "Dynamic",
                    size: "Y1",
                },
                kind: "FunctionApp",
            });
            this.appServicePlan = plan;
            appServicePlanId = plan.id;
        }

        const defaultAppSettings = {
            "AzureWebJobsStorage": pulumi.interpolate`DefaultEndpointsProtocol=https;AccountName=${args.storageAccountName};AccountKey=${args.storageAccountKey};EndpointSuffix=core.windows.net`,
            "FUNCTIONS_WORKER_RUNTIME": args.runtime ?? "node",
        };

        this.functionApp = new azure.appservice.FunctionApp(args.name, {
            resourceGroupName: args.resourceGroupName,
            storageAccountName: args.storageAccountName,
            appServicePlanId: appServicePlanId,
            version: "~3",
            osType: args.osType ?? "linux",
            httpsOnly: true,
            runtime: args.runtime ?? "node",
            runtimeVersion: args.runtimeVersion ?? "14",
            appSettings: {
                ...defaultAppSettings,
                ...args.appSettings,
            },
        });
    }
}