class ChartDetails {
    constructor(style) {
        this.types = style['type'];
        this.labels = style['labels'];
        this.labelOfTable = style['label'];
        this.datas = [0];
        this.bgc = style['bgc'];
        this.bdc = style['bdc'];
        this.bdw = style['bdw'];
    }
    // To output to Chart object
    chartDetailInJson() {
        return {
            type: this.types,
            data: {
                labels: this.labels,
                datasets: [{
                    label: this.labelOfTable,
                    data: this.datas,
                    backgroundColor: this.bgc,
                    borderColor: this.bdc,
                    borderWidth: this.bdw
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        }
    }
}

module.exports = ChartDetails;