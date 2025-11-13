// === BIỂU ĐỒ ĐƠN HÀNG ===
// === LẤY CÁC PHẦN TỬ DOM ===
const orderTimeType = document.getElementById('orderTimeType');
const orderDaySelect = document.getElementById('orderDaySelect');
const orderMonthSelect = document.getElementById('orderMonthSelect');
const orderYearSelect = document.getElementById('orderYearSelect');

// Các ô hiển thị dữ liệu
const orderCard = document.querySelector('.dashboard-card');
const cardValues = orderCard.querySelectorAll('.card-value');
const totalOrders = cardValues[0];
const newOrders = cardValues[1];
const successOrders = cardValues[2];
const canceledOrders = cardValues[3];

// === TẠO BIỂU ĐỒ ĐƠN HÀNG ===
const ctx1 = document.getElementById('orderChart')?.getContext('2d');
let orderChart = null;

// Hàm tạo dữ liệu giả (demo)
function getOrderStats(type, day, month, year) {
    const total = Math.floor(Math.random() * 500) + 100;
    const newO = Math.floor(total * (Math.random() * 0.2 + 0.1));
    const success = Math.floor(total * (Math.random() * 0.5 + 0.2));
    const cancel = Math.max(0, total - success - newO);
    let title = '';

    if (type === 'day') title = `ngày ${day}/${month}/${year}`;
    else if (type === 'month') title = `tháng ${month}/${year}`;
    else title = `năm ${year}`;

    // Dữ liệu biểu đồ giả
    const chartData = Array.from({ length: 31 }, () => Math.floor(Math.random() * total / 5));

    return { total, newO, success, cancel, title, chartData };
}

// Hàm cập nhật danh sách ngày
function updateOrderDays() {
    const month = parseInt(orderMonthSelect.value);
    const year = parseInt(orderYearSelect.value);
    const daysInMonth = new Date(year, month, 0).getDate();
    orderDaySelect.innerHTML = '';
    for (let d = 1; d <= daysInMonth; d++) {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        orderDaySelect.appendChild(opt);
    }
}

function updateOrderInfo() {
    const type = orderTimeType.value;
    const day = parseInt(orderDaySelect.value);
    const month = parseInt(orderMonthSelect.value);
    const year = parseInt(orderYearSelect.value);

    // Sinh dữ liệu giả
    const data = getOrderStats(type, day, month, year);

    // Cập nhật ô thống kê
    totalOrders.textContent = `${data.total} đơn hàng`;
    newOrders.textContent = `${data.newO} đơn hàng`;
    successOrders.textContent = `${data.success} đơn hàng`;
    canceledOrders.textContent = `${data.cancel} đơn hàng`;

    // Nếu đang xem theo "ngày" => không cập nhật biểu đồ
    if (type === "day") {
        orderDaySelect.style.display = "inline-block";
        orderMonthSelect.style.display = "inline-block";
        orderYearSelect.style.display = "inline-block";
        return;
    }

    // Tạo labels cho chart
    let labels = [];
    if (type === "year") {
        labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
    } else if (type === "month") {
        const month = parseInt(orderMonthSelect.value);
        const year = parseInt(orderYearSelect.value);
        const daysInMonth = new Date(year, month, 0).getDate(); // lấy số ngày trong tháng
        labels = Array.from({ length: daysInMonth }, (_, i) => `Ngày ${i + 1}`);
    }


    const newData = Array.from({ length: labels.length }, () =>
        Math.floor(Math.random() * data.total / 10)
    );
    const oldData = Array.from({ length: labels.length }, () =>
        Math.floor(Math.random() * data.total / 10)
    );

    if (!ctx1) return;

    if (orderChart) {
        // Cập nhật dữ liệu nếu chart đã tồn tại
        orderChart.data.labels = labels;
        orderChart.data.datasets[0].data = newData;
        orderChart.data.datasets[1].data = oldData;

        // Cập nhật label legend tùy chế độ
        if (type === "year") {
            orderChart.data.datasets[0].label = "Năm này";
            orderChart.data.datasets[1].label = "Năm trước";
        } else {
            orderChart.data.datasets[0].label = "Tháng này";
            orderChart.data.datasets[1].label = "Tháng trước";
        }

        orderChart.update();
        // <-- **ĐÃ LOẠI BỎ return ở đây** để phần ẩn/hiện select ở cuối được chạy
    } else {
        // Nếu biểu đồ chưa có → khởi tạo mới
        orderChart = new Chart(ctx1, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: type === "year" ? "Năm này" : "Tháng này",
                        data: newData,
                        backgroundColor: "rgba(94, 23, 235, 1)",
                        borderColor: "rgba(94, 23, 235, 1)",
                        fill: false,
                    },
                    {
                        label: type === "year" ? "Năm trước" : "Tháng trước",
                        data: oldData,
                        backgroundColor: "rgba(255, 99, 132, 1)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        fill: false,
                    }
                ],
            },
            options: {
                responsive: true,
                animation: { duration: 100, easing: "easeOutQuart" },
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        displayColors: true,
                        callbacks: {
                            title: function (context) {
                                if (!context || context.length === 0) return "";
                                const item = context[0];
                                const labelIndex = item.dataIndex + 1;
                                const chart = item.chart;
                                const isYearMode = Array.isArray(chart.data.labels) && chart.data.labels.length === 12;
                                const dsLabel = (item.dataset && item.dataset.label) ? String(item.dataset.label) : "";
                                if (!isYearMode) return `Ngày ${labelIndex}`;
                                const dsLower = dsLabel.toLowerCase();
                                if (dsLower.includes("năm này") || dsLower.includes("nam nay")) return `Tháng ${labelIndex}`;
                                if (dsLower.includes("năm trước") || dsLower.includes("nam truoc")) return `Tháng ${labelIndex}`;
                                return `Tháng ${labelIndex}`;
                            },
                            label: function (context) {
                                const dsLabel = context.dataset && context.dataset.label ? context.dataset.label : "";
                                const value = context.formattedValue;
                                return `${dsLabel}: ${value} đơn hàng`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            callback: function (value, index, ticks) {
                                // Lấy kiểu thời gian hiện tại (day / month / year)
                                const type = document.getElementById("orderTimeType").value;

                                // === Nếu đang ở chế độ "tháng" ===
                                if (type === "month") {
                                    // Hiển thị các ngày lẻ: 1, 3, 5, 7, ...
                                    const label = parseInt(this.getLabelForValue(value).replace("Ngày ", ""));
                                    return label % 2 === 1 ? label : "";
                                }

                                // === Nếu đang ở chế độ "năm" ===
                                if (type === "year") {
                                    // Hiển thị tất cả tháng dạng "thg 1", "thg 2", ...
                                    const label = this.getLabelForValue(value);
                                    const monthNumber = parseInt(label.replace(/\D/g, "")); // lấy số trong "Tháng 1"
                                    return `thg ${monthNumber}`;
                                }

                                // === Nếu là chế độ khác (VD: ngày) thì hiển thị bình thường ===
                                return this.getLabelForValue(value);
                            },
                            autoSkip: false, // Không tự động bỏ bớt nhãn
                            maxRotation: 0,  // Không xoay nhãn
                            minRotation: 0
                        },
                    }
                }

            }
        });
    }

    // === Ẩn/hiện các ô chọn thời gian ===
    if (type === "month") {
        orderDaySelect.style.display = "none";
        orderMonthSelect.style.display = "inline-block";
        orderYearSelect.style.display = "inline-block";
    } else if (type === "year") {
        orderDaySelect.style.display = "none";
        orderMonthSelect.style.display = "none";
        orderYearSelect.style.display = "inline-block";
    }
}

// === GẮN SỰ KIỆN ===
orderTimeType.addEventListener('change', updateOrderInfo);
orderDaySelect.addEventListener('change', updateOrderInfo);
orderMonthSelect.addEventListener('change', () => {
    updateOrderDays();
    updateOrderInfo();
});
orderYearSelect.addEventListener('change', () => {
    updateOrderDays();
    updateOrderInfo();
});

// === KHỞI TẠO BAN ĐẦU ===
updateOrderDays();
updateOrderInfo();


// Biểu đồ khách hàng

function randomData(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 10) + 1);
}

function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function getChartData(type, day, month, year) {
    if (type === 'day') {
        return {
            labels: ['Khách mới', 'Khách cũ', 'Không hoạt động'],
            data: randomData(3),
            title: `Thống kê khách hàng ngày ${day}/${month}/${year}`,
            type: 'day'
        };
    } else if (type === 'month') {
        const days = getDaysInMonth(month, year);
        return {
            labels: Array.from({ length: days }, (_, i) => `${i + 1}`),
            data: randomData(days),
            title: `Thống kê khách hàng trong tháng ${month}/${year}`,
            type: 'month'
        };
    } else {
        return {
            labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
            data: randomData(12),
            title: `Thống kê khách hàng trong năm ${year}`,
            type: 'year'
        };
    }
}

// === Lấy các phần tử DOM ===
const timeType = document.getElementById('timeType');
const daySelect = document.getElementById('daySelect');
const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');

// === Hàm cập nhật danh sách ngày ===
function updateDayOptions() {
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);
    const daysInMonth = getDaysInMonth(month, year);

    daySelect.innerHTML = '';
    for (let d = 1; d <= daysInMonth; d++) {
        const option = document.createElement('option');
        option.value = d;
        option.textContent = d;
        daySelect.appendChild(option);
    }
}

// === Khởi tạo biểu đồ ===
const ctx = document.getElementById('customerChart').getContext('2d');
let chartInfo = getChartData('month', 1, 10, 2025);

let customerChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: chartInfo.labels,
        datasets: [{
            label: 'Số lượng khách hàng',
            data: chartInfo.data,
            backgroundColor: '#5E17EB',
            arThickness: chartInfo.type === 'day' ? 60 : 10,
            maxBarThickness: 80,
            categoryPercentage: 0.8,
            barPercentage: 0.7
        }]
    },
    options: {
        responsive: true,
        animation: {
            duration: 550,
            easing: 'easeOutQuart'
        },
        plugins: {
            legend: { display: false },
            title: { display: true, text: chartInfo.title }
        },
        scales: {
            x: {
                ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                    callback: function (value, index) {
                        const label = chartInfo.labels[index];
                        if (chartInfo.type === 'month') return (index + 1) % 2 === 1 ? label : '';
                        if (chartInfo.type === 'year') return "thg " + (index + 1);
                        return label;
                    }
                }
            },
            y: { beginAtZero: true }
        }
    }
});

// === Hàm cập nhật biểu đồ ===
function updateChart() {
    const type = timeType.value;
    const day = parseInt(daySelect.value);
    const month = parseInt(monthSelect.value);
    const year = parseInt(yearSelect.value);

    chartInfo = getChartData(type, day, month, year);
    customerChart.data.labels = chartInfo.labels;
    customerChart.data.datasets[0].data = chartInfo.data;
    // 🎨 Điều chỉnh độ rộng cột tùy theo loại biểu đồ
    if (chartInfo.type === 'day') {
        customerChart.data.datasets[0].barThickness = 40; // cột to cho 3 loại khách
        customerChart.data.datasets[0].barPercentage = 0.6;
    }
    else if (chartInfo.type === 'month') {
        customerChart.data.datasets[0].barThickness = 11; // mảnh hơn vì có nhiều ngày
        customerChart.data.datasets[0].barPercentage = 0.9;
    }
    else {
        customerChart.data.datasets[0].barThickness = 25; // vừa phải cho 12 tháng
        customerChart.data.datasets[0].barPercentage = 0.8;
    }
    customerChart.options.plugins.title.text = chartInfo.title;
    customerChart.update();

    if (type === 'day') {
        daySelect.style.display = 'inline-block';
        monthSelect.style.display = 'inline-block';
        yearSelect.style.display = 'inline-block';
    } else if (type === 'month') {
        daySelect.style.display = 'none';
        monthSelect.style.display = 'inline-block';
        yearSelect.style.display = 'inline-block';
    } else {
        daySelect.style.display = 'none';
        monthSelect.style.display = 'none';
        yearSelect.style.display = 'inline-block';
    }
}

// === Gắn sự kiện thay đổi ===
timeType.addEventListener('change', updateChart);
daySelect.addEventListener('change', updateChart);
monthSelect.addEventListener('change', () => {
    updateDayOptions();
    updateChart();
});
yearSelect.addEventListener('change', () => {
    updateDayOptions();
    updateChart();
});

// === Khởi tạo ban đầu ===
updateDayOptions();
updateChart();






