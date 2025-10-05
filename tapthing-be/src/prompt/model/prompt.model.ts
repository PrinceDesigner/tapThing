export type Prompt = {
    prompt_id: string;
    title: string;
    starts_at: string;
    ends_at: string;
    has_posted: boolean;
    posted_id: string | null;
    posted_at: string | null;
};