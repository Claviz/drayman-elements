class CalendarGrid extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const blocksPerRow = 4;
        const blocksPerCol = 3;
        const blockWidth = 7;
        const blockHeight = 8;
        const gap = 1;
        const cellWidth = 40;
        const cellHeight = 20;
        const megaColumns = blocksPerRow * blockWidth + (blocksPerRow - 1) * gap;
        const megaRows = blocksPerCol * blockHeight + (blocksPerCol - 1) * gap;

        this.shadowRoot.innerHTML = '';

        const style = document.createElement('style');
        style.textContent = `
            .calendar {
                display: grid;
                grid-template-columns: repeat(${megaColumns}, ${cellWidth}px);
                grid-template-rows: repeat(${megaRows}, ${cellHeight}px);
                gap: ${gap}px;
            }
            .cell {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .cell.clickable {
                cursor: pointer;
            }
            .cell.header {
                font-weight: bold;
                justify-content: center;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .cell.weekday {
                font-weight: bold;
                background-color: #f0f0f0;
                border-bottom: 1px solid #000;
            }
            .cell.selected {
                background-color: red;
            }
        `;
        this.shadowRoot.appendChild(style);

        const container = document.createElement('div');
        container.classList.add('calendar');
        this.shadowRoot.appendChild(container);

        const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

        for (let m = 1; m <= 12; m++) {
            const monthIdx = m - 1;
            const baseCol = (monthIdx % blocksPerRow) * (blockWidth + gap);
            const baseRow = Math.floor(monthIdx / blocksPerRow) * (blockHeight + gap);

            const firstDate = new Date(this.year, m - 1, 1);
            const monthName = firstDate.toLocaleString('default', { month: 'long' });
            const headerCell = this._createCell(container, baseRow, baseCol, '', monthName, ['cell', 'header']);
            headerCell.style.gridColumnStart = baseCol + 1;
            headerCell.style.gridColumnEnd = baseCol + 1 + blockWidth;

            daysOfWeek.forEach((day, di) => {
                this._createCell(container, baseRow + 1, baseCol + di, '', day, ['cell', 'weekday']);
            });

            for (let i = 0; i < 42; i++) {
                const dayNum = i - ((firstDate.getDay() + 6) % 7) + 1;
                const r = baseRow + 2 + Math.floor(i / 7);
                const c = baseCol + (i % 7);
                let dateStr = '';
                let txt = '';
                if (dayNum > 0 && dayNum <= new Date(this.year, m, 0).getDate()) {
                    const yyyy = this.year;
                    const mm = String(m).padStart(2, '0');
                    const dd = String(dayNum).padStart(2, '0');
                    dateStr = `${yyyy}-${mm}-${dd}`;
                    txt = String(dayNum);
                }

                const classes = ['cell'];
                if (dateStr) classes.push('clickable');
                if (this.selectedDates.includes(dateStr)) classes.push('selected');

                const cell = this._createCell(container, r, c, dateStr, txt, classes);
                if (dateStr) {
                    cell.addEventListener('click', () => {
                        const idx = this.selectedDates.indexOf(dateStr);
                        if (idx > -1) {
                            this.selectedDates.splice(idx, 1);
                            cell.classList.remove('selected');
                        } else {
                            this.selectedDates.push(dateStr);
                            cell.classList.add('selected');
                        }
                        this.onDayClick?.({ date: dateStr });
                    });
                }
            }
        }
    }

    _createCell(container, row, col, date, content, classes) {
        const cell = document.createElement('div');
        cell.textContent = content;
        cell.dataset.date = date;
        cell.classList.add(...classes);
        cell.style.gridRowStart = row + 1;
        cell.style.gridColumnStart = col + 1;
        container.appendChild(cell);
        return cell;
    }
}

customElements.define('drayman-year-calendar', CalendarGrid);