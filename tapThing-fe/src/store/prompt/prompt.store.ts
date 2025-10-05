// store/user/UserStore.ts
import { Prompt } from '@/api/prompt/model/prompt.model';
import { User } from '@/api/users/model/user.model';
import { zustandReactotron } from '@/config/reactotron';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PromptState = {
    prompt: Prompt | null;
    isLoading: boolean;
    error: string | null;
    setPrompt: (p: Prompt | null) => void;
    setHasPostedOnPrompt: (hasPosted: boolean) => void;
    setPostedIdOnPrompt: (postId: string) => void;
    setPostedAtOnPrompt: (postedAt: string | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (e: string | null) => void;
    reset: () => void;
};

export const usePromptStore = create<PromptState>()(
    persist(
        zustandReactotron(
            (set: (
                partial: Partial<PromptState> |
                    ((state: PromptState) => Partial<PromptState>),
                replace?: boolean,
                action?: string
            ) => void,
                get: () => PromptState, api: any) => ({
                    prompt: {
                        prompt_id: '',
                        title: '',
                        starts_at: '',
                        ends_at: '',
                        hasPost: false,
                        posted_id: null,
                        posted_at: null,
                    },
                    isLoading: false,
                    error: null,
                    setPrompt: (p: Prompt | null) => set({ prompt: p }),
                    setHasPostedOnPrompt: (hasPosted: boolean) =>
                        set(state => ({
                            prompt: state.prompt
                                ? { ...state.prompt, has_posted: hasPosted }
                                : null
                        }), false, 'prompt/setHasPostedOnPrompt'),
                    setPostedIdOnPrompt: (postId: string) =>
                        set(state => ({
                            prompt: state.prompt
                                ? { ...state.prompt, posted_id: postId }
                                : null
                        }), false, 'prompt/setPostedIdOnPrompt'),
                    setPostedAtOnPrompt: (postedAt: string | null) =>
                        set(state => ({
                            prompt: state.prompt
                                ? { ...state.prompt, posted_at: postedAt }
                                : null
                        }), false, 'prompt/setPostedAtOnPrompt'),
                    setLoading: (loading: boolean) => set({ isLoading: loading }),
                    setError: (e: string | null) => set({ error: e }),
                    reset: () => set({ prompt: null, isLoading: false, error: null }),
                }),
        ),
        {
            name: 'user-store',
        }
    )
);
