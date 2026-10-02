/** 颜色工具函数 **/

/** #abc → #aabbcc；补 `#`；统一小写 */
export function normalizeHex(s: string): string {
    let t = s.trim();
    if (!t.startsWith('#')) t = `#${t}`;
    if (/^#[0-9a-fA-F]{3}$/.test(t)) t = `#${t[1]}${t[1]}${t[2]}${t[2]}${t[3]}${t[3]}`;
    return t.toLowerCase();
}

/** 把后端值统一成数组：支持 "#a,#b"（逗号串）、["#a","#b"]（VO 的 String[]）、单个 "#abc" */
export function toColours(v: unknown): string[] {
    const raw = Array.isArray(v) ? v : typeof v === 'string' ? v.split(/[,，]/) : [];
    return raw.map((s) => String(s ?? '')).filter((s) => s.trim() !== '').map(normalizeHex);
}

/** 多色 → 线性渐变；单色 → 纯色；空 → 透明 */
export function colourBackground(v: unknown): string {
    const list = toColours(v);
    if (list.length === 0) return 'transparent';
    if (list.length === 1) return list[0];
    return `linear-gradient(90deg, ${list.join(', ')})`;
}

/** 按平均亮度决定标签文字用黑还是白，避免浅色底白字看不清 */
export function contrastText(v: unknown): string {
    const list = toColours(v);
    if (list.length === 0) return 'var(--el-text-color-primary)';
    const avg = list.reduce((sum, c) => {
        const n = parseInt(c.slice(1, 7), 16);
        const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
        return sum + (0.299 * r + 0.587 * g + 0.114 * b);
    }, 0) / list.length;
    return avg > 160 ? '#000000' : '#ffffff';
}