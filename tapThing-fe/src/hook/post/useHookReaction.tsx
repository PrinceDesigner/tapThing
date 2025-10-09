import { ByEmoji, Emoji, PostDetail, ResponsePostPaginated } from "@/api/posts/model/post.model"
import { reactToPost } from "@/api/posts/post.service"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type Vars = {
    postId: string
    promptId: string
    emojiShortcode: Emoji
    emojiId: number | null
    action: 'add' | 'remove'
    pageSize: number
}

const ALL: Emoji[] = ['cuore', 'pollice_su', 'pollice_giu']
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

function countsFrom(pd: PostDetail): Record<Emoji, number> {
    const base: Record<Emoji, number> = { cuore: 0, pollice_su: 0, pollice_giu: 0 }
    pd.reactions.byEmoji.forEach(b => { base[b.shortcode] = b.count })
    return base
}
function labelFor(sc: Emoji): ByEmoji['label'] {
    return sc === 'cuore' ? 'cuore' : sc === 'pollice_su' ? 'pollice su' : 'pollice giu'
}

/** genera un nuovo PostDetail aggiornato ottimisticamente */
function computeOptimisticNext(pd: PostDetail, target: Emoji, targetId: number | null, action: 'add' | 'remove') {
    const counts = countsFrom(pd)
    const prev = pd.myReaction.reaction
    let nextSelected: ByEmoji | null = null

    if (action === 'remove') {
        if (prev) counts[prev.shortcode] = Math.max(0, counts[prev.shortcode] - 1)
        nextSelected = null
    } else {
        counts[target] = (counts[target] ?? 0) + 1
        if (prev) counts[prev.shortcode] = Math.max(0, counts[prev.shortcode] - 1)

        const existing = pd.reactions.byEmoji.find(b => b.shortcode === target)
        nextSelected =
            existing ??
            ({ emoji_id: targetId ?? -1, shortcode: target, unicode: target, label: labelFor(target), count: 0 } as ByEmoji)
    }

    const nextByEmoji: ByEmoji[] = ALL.map(sc => {
        const ex = pd.reactions.byEmoji.find(b => b.shortcode === sc)
        return ex ? { ...ex, count: counts[sc] } : ({
            emoji_id: sc === target ? (targetId ?? -1) : -1,
            shortcode: sc, unicode: sc, label: labelFor(sc), count: counts[sc],
        } as ByEmoji)
    })

    return {
        ...pd,
        reactions: { byEmoji: nextByEmoji },
        myReaction: { hasReacted: !!nextSelected, reaction: nextSelected },
    }
}

/** aggiorna un post dentro una infinite query */
function updateInInfinite(
    data: { pages: ResponsePostPaginated[]; pageParams: any[] } | undefined,
    postId: string,
    updater: (pd: PostDetail) => PostDetail
) {
    if (!data) return data
    return {
        ...data,
        pages: data.pages.map(page => ({
            ...page,
            posts: page.posts.map(p => (p.post.id === postId ? updater(p) : p)),
        })),
    }
}

export function useToggleReactionMutation() {
    const qc = useQueryClient()

    return useMutation({
        mutationKey: ['reaction', 'toggle', 'mock'],
        retry: false,
        mutationFn: async (_vars: Vars) => {
            await reactToPost(_vars.emojiId, _vars.action, _vars.postId)
        },
        onMutate: async (vars) => {
            // console.log('Mutate reaction', vars)
            const { postId, promptId, emojiShortcode, emojiId, action, pageSize } = vars
            const feedKey = ['posts', promptId, pageSize] as const

            // stop query correnti del feed
            await qc.cancelQueries({ queryKey: feedKey })

            // snapshot
            const prevFeed = qc.getQueryData<{ pages: ResponsePostPaginated[]; pageParams: any[] }>(feedKey)

            // aggiorna ottimistico
            const nextFeed = updateInInfinite(prevFeed, postId, (pd) =>
                computeOptimisticNext(pd, emojiShortcode, emojiId, action)
            )
            if (nextFeed) qc.setQueryData(feedKey, nextFeed)

            return { prevFeed, feedKey }
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.prevFeed) qc.setQueryData(ctx.feedKey, ctx.prevFeed)
        },
        onSettled: (_data, _err, vars, ctx) => {
            // const feedKey = ['posts', vars.promptId, vars.pageSize] as const
            // qc.invalidateQueries({ queryKey: feedKey })
        },
    })
}
