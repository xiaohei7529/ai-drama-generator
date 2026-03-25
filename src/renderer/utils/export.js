/**
 * 导出工具函数
 */

/**
 * 将剧本列表导出为文件
 * @param {Array} results  - 剧本数组
 * @param {'md'|'txt'|'json'} format - 导出格式
 */
export function batchExport(results, format = 'md') {
  if (!results || results.length === 0) return

  let content = ''
  let mimeType = 'text/plain;charset=utf-8'
  let ext = 'txt'

  if (format === 'json') {
    content = JSON.stringify(results, null, 2)
    mimeType = 'application/json;charset=utf-8'
    ext = 'json'
  } else if (format === 'md') {
    ext = 'md'
    content = results
      .map((item) => {
        const sep = '---'
        const meta = [
          `# ${item.theme ?? '未命名剧本'}`,
          '',
          `- **风格**: ${item.style ?? '-'}`,
          `- **集数**: ${item.episodes ?? '-'} 集`,
          `- **每集时长**: ${item.duration ?? '-'} 分钟`,
          `- **AI 提供商**: ${item.provider ?? '-'}`,
          `- **生成时间**: ${item.timestamp ? new Date(item.timestamp).toLocaleString('zh-CN') : '-'}`,
          '',
          sep,
          '',
        ].join('\n')
        return meta + (item.content ?? '') + '\n\n'
      })
      .join('---\n\n')
  } else {
    content = results
      .map((item) =>
        [
          `主题：${item.theme ?? ''}`,
          `风格：${item.style ?? ''}`,
          `集数：${item.episodes ?? ''}`,
          `时长：${item.duration ?? ''} 分钟`,
          `提供商：${item.provider ?? ''}`,
          `时间：${item.timestamp ?? ''}`,
          '',
          item.content ?? '',
          '',
          '='.repeat(60),
          '',
        ].join('\n')
      )
      .join('\n')
  }

  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-drama-${new Date().toISOString().split('T')[0]}.${ext}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 单条剧本复制到剪贴板
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
