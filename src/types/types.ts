export interface Class {
    id: string;
    name: string;
    description: string | undefined;
    created_at: string;
}

export interface Homework {
    id: string | undefined;
    class_id: string | undefined;
    title: string;
    description: string | undefined;
    file_url: string | undefined;
    created_at: string | undefined;
    due_date: string | undefined;
}