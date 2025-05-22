import * as pulumi from "@pulumi/pulumi";
import { FunctionAppComponent } from "../src/components/FunctionAppComponent";

// Pulumi Mocks for unit testing
class MyMocks implements pulumi.runtime.Mocks {
    newResource(type: string, name: string, inputs: any) {
        return { id: `${name}_id`, state: { ...inputs, name } };
    }
    call(token: string, args: any, provider?: string) {
        return args;
    }
}

pulumi.runtime.setMocks(new MyMocks());

describe("FunctionAppComponent", () => {
    it("creates a Function App and Plan with correct properties", async () => {
        const args = {
            name: "myfunc",
            resourceGroupName: "myrg",
            storageAccountName: "mystorage",
            storageAccountKey: "fakekey",
            appSettings: { CUSTOM: "VALUE" },
            runtime: "node",
            runtimeVersion: "18",
            osType: "linux",
        };

        const component = new FunctionAppComponent(args);

        // App Service Plan
        if (component.appServicePlan) {
            const plan = await pulumi.output(component.appServicePlan).promise();
            expect(plan.kind).toBe("FunctionApp");
            expect(plan.sku).toEqual({ tier: "Dynamic", size: "Y1" });
        }

        // Function App
        const funcApp = await pulumi.output(component.functionApp).promise();
        expect(funcApp.resourceGroupName).toBe("myrg");
        expect(funcApp.storageAccountName).toBe("mystorage");
        expect(funcApp.osType).toBe("linux");
        expect(funcApp.runtime).toBe("node");
        expect(funcApp.runtimeVersion).toBe("18");
        expect(funcApp.httpsOnly).toBe(true);
        expect(funcApp.appSettings.CUSTOM).toBe("VALUE");
        expect(funcApp.appSettings.FUNCTIONS_WORKER_RUNTIME).toBe("node");
    });

    it("uses an existing App Service Plan if provided", async () => {
        const args = {
            name: "func2",
            resourceGroupName: "rg2",
            storageAccountName: "storage2",
            storageAccountKey: "key2",
            appServicePlanId: "existing-plan-id",
            runtime: "python",
            runtimeVersion: "3.10",
            osType: "windows",
        };

        const component = new FunctionAppComponent(args);

        // Should not create a new plan
        expect(component.appServicePlan).toBeUndefined();

        const funcApp = await pulumi.output(component.functionApp).promise();
        expect(funcApp.appServicePlanId).toBe("existing-plan-id");
        expect(funcApp.runtime).toBe("python");
        expect(funcApp.runtimeVersion).toBe("3.10");
        expect(funcApp.osType).toBe("windows");
    });

    it("applies default values when optional args are omitted", async () => {
        const args = {
            name: "func3",
            resourceGroupName: "rg3",
            storageAccountName: "storage3",
            storageAccountKey: "key3",
        };

        const component = new FunctionAppComponent(args);

        const funcApp = await pulumi.output(component.functionApp).promise();
        expect(funcApp.runtime).toBe("node");
        expect(funcApp.runtimeVersion).toBe("14");
        expect(funcApp.osType).toBe("linux");
        expect(funcApp.httpsOnly).toBe(true);
        expect(funcApp.appSettings.FUNCTIONS_WORKER_RUNTIME).toBe("node");
    });

    it("merges custom app settings with defaults", async () => {
        const args = {
            name: "func4",
            resourceGroupName: "rg4",
            storageAccountName: "storage4",
            storageAccountKey: "key4",
            appSettings: {
                CUSTOM1: "VAL1",
                CUSTOM2: "VAL2"
            }
        };

        const component = new FunctionAppComponent(args);

        const funcApp = await pulumi.output(component.functionApp).promise();
        expect(funcApp.appSettings.CUSTOM1).toBe("VAL1");
        expect(funcApp.appSettings.CUSTOM2).toBe("VAL2");
        expect(funcApp.appSettings.FUNCTIONS_WORKER_RUNTIME).toBe("node");
        expect(funcApp.appSettings.AzureWebJobsStorage).toContain("AccountName=storage4");
    });
});