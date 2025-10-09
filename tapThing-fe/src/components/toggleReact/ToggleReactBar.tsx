// ReactionBar.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { ToggleButton, Text, useTheme } from 'react-native-paper'
import type { Emoji, PostDetail } from '@/api/posts/model/post.model'


export type PressPayload = {
    action: 'add' | 'remove'
    emoji: Emoji
    emojiId: number | null         // preso da post.reactions.byEmoji (mai fallback)
    prevEmoji: Emoji | null        // se c’era una reaction selezionata prima
    prevEmojiId: number | null
}

type Props = {
    post: PostDetail
    onPress: (payload: PressPayload) => void
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    highlightColors?: Partial<Record<Emoji, string>>
    cooldownMs?: number            // blocco ripetuti tap per N ms (default 1000ms)
}

const ICONS: Record<Emoji, string> = {
    cuore: 'heart',
    pollice_su: 'thumb-up',
    pollice_giu: 'thumb-down',
}

const DEFAULT_HIGHLIGHT: Record<Emoji, string> = {
    cuore: 'red',
    pollice_su: 'rgba(41, 146, 226, 1)',
    pollice_giu: 'rgba(235, 118, 83, 0.99)',
}

const ORDER: Emoji[] = ['cuore', 'pollice_su', 'pollice_giu']

export const ReactionBar: React.FC<Props> = ({
    post,
    onPress,
    size = 'sm',
    disabled,
    highlightColors,
    cooldownMs = 800,                  // 👈 default 500ms
}) => {
    const theme = useTheme()
    const colors = { ...DEFAULT_HIGHLIGHT, ...highlightColors }

    // --- cooldown state ---
    const [isCooling, setIsCooling] = useState(false)
    const tRef = useRef<NodeJS.Timeout | null>(null)
    useEffect(() => () => { if (tRef.current) clearTimeout(tRef.current) }, [])

    // conteggi totali per emoji
    const counts = useMemo(() => {
        const base = { cuore: 0, pollice_su: 0, pollice_giu: 0 } as Record<Emoji, number>
        post.reactions.byEmoji.forEach(b => { base[b.shortcode] = b.count })
        return base
    }, [post.reactions.byEmoji])

    // mappa shortcode → emoji_id (catalogo hardcoded nel tuo esempio)
    const idByShortcode = useMemo(() => {
        const m = new Map<Emoji, number>()
            ;[
                { shortcode: 'cuore' as Emoji, emoji_id: 2 },
                { shortcode: 'pollice_su' as Emoji, emoji_id: 1 },
                { shortcode: 'pollice_giu' as Emoji, emoji_id: 3 },
            ].forEach(b => m.set(b.shortcode, b.emoji_id))
        return m
    }, [])

    const selected = post.myReaction.reaction?.shortcode ?? null
    const selectedId = post.myReaction.reaction?.emoji_id ?? null
    const dimension = size === 'lg' ? 36 : size === 'sm' ? 24 : 30

    const handlePress = (target: Emoji) => {
        // blocca spam durante il cooldown
        if (isCooling) return

        const isSame = selected === target
        const targetId = idByShortcode.get(target) ?? null

        onPress({
            action: isSame ? 'remove' : 'add',
            emoji: target,
            emojiId: isSame ? null : targetId,
            prevEmoji: selected,
            prevEmojiId: selectedId,
        })

        // avvia cooldown (non blocca l’optimistic; blocca solo altri tap)
        setIsCooling(true)
        if (tRef.current) clearTimeout(tRef.current)
        tRef.current = setTimeout(() => setIsCooling(false), cooldownMs)
    }

    const isDisabled = disabled

    return (
        <View style={styles.row} accessibilityRole="toolbar" accessibilityLabel="Reazioni al post">
            {ORDER.map(sc => {
                const active = selected === sc
                return (
                    <View key={sc} style={styles.stat}>
                        <ToggleButton
                            icon={ICONS[sc]}
                            value={sc}
                            size={dimension}
                            rippleColor="transparent"
                            onPress={() => handlePress(sc)}
                            iconColor={active ? colors[sc] : undefined}
                            style={[styles.btn, active && { borderColor: theme.colors.outline }]}
                            disabled={isDisabled}               // 👈 blocco durante cooldown
                        />
                        <Text accessibilityLabel={`Conteggio ${sc.replace('_', ' ')}`}>
                            {counts[sc] ?? 0}
                        </Text>
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    stat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    btn: { borderRadius: 999 },
})




export default ReactionBar
