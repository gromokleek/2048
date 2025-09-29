class Game2048 {
    constructor() {
        this.size = 4;
        this.score = 0;
        this.grid = [];
        this.start();
    }

    start() {
        this.grid = this.createEmptyGrid();
        this.score = 0;
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
        this.bindEvents();
        
        console.log("🎮 Игра запущена!");
    }

    createEmptyGrid() {
        let grid = [];
        for (let i = 0; i < this.size; i++) {
            grid[i] = [0, 0, 0, 0];
        }
        return grid;
    }

    addRandomTile() {
        let emptyCells = [];
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (this.grid[x][y] === 0) {
                    emptyCells.push({x: x, y: y});
                }
            }
        }

        if (emptyCells.length > 0) {
            let cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[cell.x][cell.y] = Math.random() < 0.9 ? 2 : 4;
            return true;
        }
        return false;
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
                this.move(e.key);
            }
        });

        // Кнопка "Попробовать снова"
        document.querySelector('.retry-button').addEventListener('click', () => {
            this.restart();
        });
    }

    move(direction) {
        let moved = false;
        const size = this.size;

        // Поворачиваем сетку для удобства обработки
        let grid = this.grid;
        
        if (direction === 'ArrowLeft') {
            for (let x = 0; x < size; x++) {
                // Сдвигаем влево и объединяем
                let row = grid[x].filter(cell => cell !== 0);
                for (let i = 0; i < row.length - 1; i++) {
                    if (row[i] === row[i + 1]) {
                        row[i] *= 2;
                        this.score += row[i];
                        row.splice(i + 1, 1);
                    }
                }
                // Заполняем нулями
                while (row.length < size) {
                    row.push(0);
                }
                if (JSON.stringify(grid[x]) !== JSON.stringify(row)) {
                    moved = true;
                }
                grid[x] = row;
            }
        }
        else if (direction === 'ArrowRight') {
            for (let x = 0; x < size; x++) {
                let row = grid[x].filter(cell => cell !== 0);
                for (let i = row.length - 1; i > 0; i--) {
                    if (row[i] === row[i - 1]) {
                        row[i] *= 2;
                        this.score += row[i];
                        row.splice(i - 1, 1);
                    }
                }
                while (row.length < size) {
                    row.unshift(0);
                }
                if (JSON.stringify(grid[x]) !== JSON.stringify(row)) {
                    moved = true;
                }
                grid[x] = row;
            }
        }
        else if (direction === 'ArrowUp') {
            for (let y = 0; y < size; y++) {
                let column = [];
                for (let x = 0; x < size; x++) {
                    if (grid[x][y] !== 0) column.push(grid[x][y]);
                }
                for (let i = 0; i < column.length - 1; i++) {
                    if (column[i] === column[i + 1]) {
                        column[i] *= 2;
                        this.score += column[i];
                        column.splice(i + 1, 1);
                    }
                }
                while (column.length < size) {
                    column.push(0);
                }
                for (let x = 0; x < size; x++) {
                    if (grid[x][y] !== column[x]) moved = true;
                    grid[x][y] = column[x];
                }
            }
        }
        else if (direction === 'ArrowDown') {
            for (let y = 0; y < size; y++) {
                let column = [];
                for (let x = 0; x < size; x++) {
                    if (grid[x][y] !== 0) column.push(grid[x][y]);
                }
                for (let i = column.length - 1; i > 0; i--) {
                    if (column[i] === column[i - 1]) {
                        column[i] *= 2;
                        this.score += column[i];
                        column.splice(i - 1, 1);
                    }
                }
                while (column.length < size) {
                    column.unshift(0);
                }
                for (let x = 0; x < size; x++) {
                    if (grid[x][y] !== column[x]) moved = true;
                    grid[x][y] = column[x];
                }
            }
        }

        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            
            // Проверяем победу
            if (this.checkWin()) {
                this.showMessage("Ты выиграл!", true);
            }
            // Проверяем поражение
            else if (this.isGameOver()) {
                this.showMessage("Игра окончена!", false);
            }
        }
    }

    checkWin() {
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (this.grid[x][y] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    isGameOver() {
        // Проверяем есть ли пустые клетки
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                if (this.grid[x][y] === 0) {
                    return false;
                }
            }
        }
        
        // Проверяем возможные ходы
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const current = this.grid[x][y];
                if ((x < this.size - 1 && this.grid[x + 1][y] === current) ||
                    (y < this.size - 1 && this.grid[x][y + 1] === current)) {
                    return false;
                }
            }
        }
        
        return true;
    }

    updateDisplay() {
        this.updateTiles();
        this.updateScore();
    }

    updateTiles() {
        const container = document.querySelector('.tile-container');
        container.innerHTML = '';

        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                const value = this.grid[x][y];
                if (value !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${value}`;
                    tile.textContent = value;
                    tile.style.transform = `translate(${y * 121}px, ${x * 121}px)`;
                    container.appendChild(tile);
                }
            }
        }
    }

    updateScore() {
        document.querySelector('.score-container').textContent = this.score;
    }

    showMessage(text, isWin) {
        const message = document.querySelector('.game-message');
        message.querySelector('p').textContent = text;
        message.classList.add(isWin ? 'game-won' : 'game-over');
        
        // Отправляем результаты на сервер
        this.sendResults();
    }

    sendResults() {
        fetch('/api/save_score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                score: this.score,
                won: this.checkWin(),
                timestamp: new Date().toISOString()
            })
        }).catch(err => console.log('Ошибка отправки результатов:', err));
    }

    restart() {
        const message = document.querySelector('.game-message');
        message.classList.remove('game-won', 'game-over');
        this.start();
    }
}

// Запускаем игру когда страница загрузится
document.addEventListener('DOMContentLoaded', () => {
    console.log("🔄 Страница загружена, запускаем игру...");
    window.game = new Game2048();
});