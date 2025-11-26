interface Extention {
    id: string;
    name: string;
}

interface ExtensionRule {
    id: string;
    organization_id: string;
    extension: Extention;
    extension_destination: Extention;
    timescope: "any" | "work_hours" | "off_hours"; // Defined as a union type based on ENUM options
    condition: "always" | "busy" | "no_answer" | "unreachable"; // Defined as a union type based on ENUM options
    created_by: string;
    created_at: string; // Assuming standard ISO date/time string
    updated_by: string | null;
    updated_at: string | null;
    deleted_by: string | null;
    deleted_at: string | null;
}

export const extension_rules: ExtensionRule[] = [
    {
        id: "79fgfgy-fd76g8d7-df7g8df78fd",
        extension: {
            id: "89df79-dfg9d-4kj56kj",
            name: "Loundry"
        },
        extension_destination: {
            id: "89df79-dfg9d-fdg6d87",
            name: "Receptionis"
        },
        organization_id: "151044dd-5df4-41b8-805b-892c27298193",
        timescope: "work_hours", // ( ENUM || any / work_hours / off_hours )
        condition: "no_answer", // ( ENUM || always / busy / no_answer / unreachable )
        created_by: "f6g8f8-df8g8dg-df8g8f7",
        created_at: "2025-10-02 18:40:10",
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null,
    },
    {
        id: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
        organization_id: "151044dd-5df4-41b8-805b-892c27298193",
        extension: {
            id: "89df79-dfg9d-rty79t",
            name: "Kitchen"
        },
        extension_destination: {
            id: "89df79-dfg9d-fdg6d87",
            name: "Receptionis"
        },
        timescope: "any", // Rule applies regardless of time
        condition: "busy", // If the extension is busy, redirect
        created_by: "g9h0i1-j2k3l4-m5n6o7",
        created_at: "2025-10-03 09:15:30",
        updated_by: "g9h0i1-j2k3l4-m5n6o7",
        updated_at: "2025-10-03 10:00:00",
        deleted_by: null,
        deleted_at: null,
    },
    {
        id: "q7r8s9t0-u1v2-w3x4-y5z6-a7b8c9d0e1f2",
        organization_id: "151044dd-5df4-41b8-805b-892c27298193",
        extension: {
            id: "89df79-dfg9d-87df8g6",
            name: "Room Service"
        },
        extension_destination: {
            id: "89df79-dfg9d-fdg6d87",
            name: "Receptionis"
        },
        timescope: "off_hours", // Rule applies outside work hours
        condition: "always", // Always forward during off-hours
        created_by: "f6g8f8-df8g8dg-df8g8f7",
        created_at: "2025-10-01 22:05:45",
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null,
    }
];