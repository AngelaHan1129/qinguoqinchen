// composables/reports.ts
import { onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

let chartInstance: echarts.ECharts | null = null
let isAnimating = false

function getCssVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function simulateReportGeneration() {
    const processingRows = document.querySelectorAll('.status-processing')

    processingRows.forEach(status => {
        setTimeout(() => {
            status.textContent = '完成'
            status.className = 'report-status status-completed'

            const downloadBtn = status.closest('.reports-grid')?.querySelector('.download-btn') as HTMLButtonElement | null
            if (downloadBtn) {
                downloadBtn.disabled = false
                downloadBtn.style.opacity = '1'
                downloadBtn.textContent = '📥 下載'
            }
        }, Math.random() * 10000 + 5000)
    })
}

function animateStatNumbers() {
    if (isAnimating) return
    isAnimating = true

    const statNumbers = document.querySelectorAll<HTMLElement>('.stat-number')
    const duration = 2500

    statNumbers.forEach((stat, idx) => {
        const target = parseInt(stat.dataset.value || '0', 10)
        let current = 0
        let startTime: number | null = null

        function step(timestamp: number) {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            current = Math.floor(progress * target)
            stat.textContent = current.toString()

            if (progress < 1) {
                requestAnimationFrame(step)
            } else {
                stat.textContent = target.toString()
                if (idx === statNumbers.length - 1) {
                    isAnimating = false
                }
            }
        }

        requestAnimationFrame(step)
    })
}

function initChart() {
    const chartDom = document.getElementById('riskTrendChart')
    if (!chartDom) return

    chartInstance = echarts.init(chartDom)

    const option: echarts.EChartsOption = {
        tooltip: { trigger: 'axis' },
        legend: {
            top: 30,
            textStyle: { color: getCssVar('--brand-gold') }
        },
        xAxis: {
            type: 'category',
            data: ['2025-09-12', '2025-09-13', '2025-09-14', '2025-09-15', '2025-09-16', '2025-09-17'],
            axisLine: { lineStyle: { color: getCssVar('--brand-gold') } },
            axisLabel: { color: getCssVar('--brand-gold') }
        },
        yAxis: {
            type: 'value',
            minInterval: 1,
            axisLine: { lineStyle: { color: getCssVar('--brand-gold') } },
            axisLabel: { color: getCssVar('--brand-gold') }
        },
        series: [
            {
                name: 'Critical',
                type: 'line',
                data: [1, 2, 2, 3, 3, 3],
                itemStyle: { color: '#FF4444' },
                smooth: true
            },
            {
                name: 'High',
                type: 'line',
                data: [8, 10, 11, 12, 12, 12],
                itemStyle: { color: getCssVar('--brand-orange') },
                smooth: true
            },
            {
                name: 'Medium',
                type: 'line',
                data: [20, 22, 25, 27, 28, 28],
                itemStyle: { color: getCssVar('--brand-gold') },
                smooth: true
            },
            {
                name: 'Low',
                type: 'line',
                data: [40, 42, 43, 44, 45, 45],
                itemStyle: { color: getCssVar('--neon-green') },
                smooth: true
            }
        ]
    }

    chartInstance.setOption(option)
}

function handleResize() {
    if (chartInstance) {
        chartInstance.resize()
    }
}

function destroyChart() {
    if (chartInstance) {
        chartInstance.dispose()
        chartInstance = null
    }
}

// 封裝成 composable 方法
export function useReports() {
    // 啟動：模擬 + 動畫 + 圖表初始化 + resize 監聽
    function start() {
        simulateReportGeneration()

        nextTick(() => {
            animateStatNumbers()
        })

        initChart()
        window.addEventListener('resize', handleResize)
    }

    function stop() {
        window.removeEventListener('resize', handleResize)
        destroyChart()
    }

    onUnmounted(() => {
        stop()
    })

    return {
        start,
        stop
    }
}
