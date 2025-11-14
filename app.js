class WaterUsageTracker {
    constructor() {
        this.history = this.loadHistory();
        this.form = document.getElementById('waterForm');
        this.resultDiv = document.getElementById('resultDiv');
        this.historyDiv = document.getElementById('historyDiv');
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.displayHistory();
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {
            shower: parseFloat(formData.get('shower')) || 0,
            cooking: parseFloat(formData.get('cooking')) || 0,
            washing: parseFloat(formData.get('washing')) || 0,
            other: parseFloat(formData.get('other')) || 0
        };

        const total = this.calculateTotal(data);
        const today = new Date().toLocaleDateString();
        
        this.history.push({
            date: today,
            total: total,
            breakdown: data
        });
        
        this.saveHistory();
        this.displayResult(data, total);
        this.displayHistory();
        this.form.reset();
    }

    calculateTotal(data) {
        return parseFloat((data.shower + data.cooking + data.washing + data.other).toFixed(1));
    }

    displayResult(breakdown, total) {
        const resultHTML = `
            <div class="result">
                <h2>📊 Total Water Used Today: ${total} liters</h2>
                <ul class="breakdown">
                    <li><strong>Shower:</strong> ${breakdown.shower} L</li>
                    <li><strong>Cooking:</strong> ${breakdown.cooking} L</li>
                    <li><strong>Washing:</strong> ${breakdown.washing} L</li>
                    <li><strong>Other:</strong> ${breakdown.other} L</li>
                </ul>
            </div>
        `;
        this.resultDiv.innerHTML = resultHTML;
    }

    displayHistory() {
        if (this.history.length === 0) return;
        
        const averageUsage = (this.history.reduce((sum, entry) => sum + entry.total, 0) / this.history.length).toFixed(1);
        
        let historyHTML = `
            <div class="history">
                <h3>📈 Past Entries (Average: ${averageUsage} L)</h3>
                <ul class="history-list">
        `;
        
        this.history.slice().reverse().forEach(entry => {
            historyHTML += `<li>${entry.date}: <strong>${entry.total} liters</strong></li>`;
        });
        
        historyHTML += `</ul></div>`;
        this.historyDiv.innerHTML = historyHTML;
    }

    saveHistory() {
        localStorage.setItem('waterHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('waterHistory');
        return saved ? JSON.parse(saved) : [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WaterUsageTracker();
});
