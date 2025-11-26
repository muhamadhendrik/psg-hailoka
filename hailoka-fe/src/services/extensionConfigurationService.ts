import api from "../utils/axios";

export interface ExtensionConfiguration {
    ring_timeout_seconds: number;
    max_concurrent_calls: number;
    is_record_a_call: boolean;
}

export interface UpdateExtensionConfigurationPayload {
    ring_timeout_seconds?: number;
    max_concurrent_calls?: number;
    is_record_a_call?: boolean;
}

export const extensionConfigurationService = {
    getExtensionConfiguration: (organizationId: string) =>
        api.get<ExtensionConfiguration>(
            `/organizations/${organizationId}/extension-configuration`,
            {
                withCredentials: true,
            }
        ),
    updateExtensionConfiguration: (
        organizationId: string,
        data: UpdateExtensionConfigurationPayload
    ) =>
        api.put<ExtensionConfiguration>(
            `/organizations/${organizationId}/extension-configuration`,
            data,
            {
                withCredentials: true,
            }
        ),
};

