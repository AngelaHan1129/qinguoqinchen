// agetapi.ts

export type AttackModVector = {
    id: string
    model: string
    difficulty: 'MEDIUM' | 'HIGH' | 'VERY_HIGH'
    successRate: string
    scenario: string
    description?: string
}

/**
 * 取得 AI 攻擊模組資料
 */
export async function getAttackMod(): Promise<{ vectors: AttackModVector[] }> {
    try {
        const response = await fetch('/api/ai-attack/vectors')
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`)

        const json = await response.json()
        console.log('[getAttackMod] JSON result:', json)

        return json
    } catch (e) {
        console.error('[getAttackMod] Error:', e)
        throw e
    }
}
