export function createNeuralNetwork() {
    const container = document.getElementById('neuralNetwork')
    const nodeCount = 50

    if (!container) return

    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div')
        node.className = 'neural-node'
        node.style.left = Math.random() * 100 + '%'
        node.style.top = Math.random() * 100 + '%'
        node.style.animationDelay = Math.random() * 3 + 's'
        container.appendChild(node)
    }
}

export function animateAccuracyCircles() {
    const circles = document.querySelectorAll('.accuracy-circle')

    circles.forEach(circle => {
        const el = circle as HTMLElement
        const rawAccuracy = el.style.getPropertyValue('--accuracy')
        const accuracy = parseFloat(rawAccuracy)
        if (isNaN(accuracy)) return

        let current = 0
        const increment = accuracy / 100

        const animation = setInterval(() => {
            current += increment
            if (current >= accuracy) {
                current = accuracy
                clearInterval(animation)
            }
            el.style.setProperty('--accuracy', current.toString())

            const text = circle.querySelector('.accuracy-text')
            if (text) {
                text.textContent = current.toFixed(1) + '%'
            }
        }, 20)
    })
}
