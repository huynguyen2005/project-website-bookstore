// === ĐƠN HÀNG ===
const orderTimeType = document.getElementById('orderTimeType');
const orderDaySelect = document.getElementById('orderDaySelect');
const orderMonthSelect = document.getElementById('orderMonthSelect');
const orderYearSelect = document.getElementById('orderYearSelect');

const orderCard = document.querySelector('.dashboard-card');
const cardValues = orderCard.querySelectorAll('.card-value');
const totalOrdersCard = cardValues[0];
const newOrdersCard = cardValues[1];
const successOrdersCard = cardValues[2];
const canceledOrdersCard = cardValues[3];

const ctxOrder = document.getElementById('orderChart')?.getContext('2d');
let orderChart = null;

// Hàm cập nhật thống kê đơn hàng từ controller
function updateOrderInfo() {
    // Cập nhật ô thống kê
    totalOrdersCard.textContent = `${window.totalOrders} đơn hàng`;
    newOrdersCard.textContent = `${window.newOrders} đơn hàng`;
    successOrdersCard.textContent = `${window.successOrders} đơn hàng`;
    canceledOrdersCard.textContent = `${window.cancelOrders} đơn hàng`;

    // Biểu đồ
    if (!ctxOrder) return;

    if (!orderChart) {
        orderChart = new Chart(ctxOrder, {
            type: "line",
            data: {
                labels: window.orderChartLabels,
                datasets: [{
                    label: "Đơn hàng",
                    data: window.orderChartData,
                    backgroundColor: "rgba(94,23,235,0.2)",
                    borderColor: "rgba(94,23,235,1)",
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "bottom" },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Đơn hàng: ${context.formattedValue}`;
                            }
                        }
                    }
                }
            }
        });
    } else {
        orderChart.data.labels = window.orderChartLabels;
        orderChart.data.datasets[0].data = window.orderChartData;
        orderChart.update();
    }

    // Ẩn/hiện các ô chọn ngày/tháng/năm theo type
    const type = orderTimeType.value;
    if (type === "month") {
        orderDaySelect.style.display = "none";
        orderMonthSelect.style.display = "inline-block";
        orderYearSelect.style.display = "inline-block";
    } else if (type === "year") {
        orderDaySelect.style.display = "none";
        orderMonthSelect.style.display = "none";
        orderYearSelect.style.display = "inline-block";
    } else {
        orderDaySelect.style.display = "inline-block";
        orderMonthSelect.style.display = "inline-block";
        orderYearSelect.style.display = "inline-block";
    }
}

// Cập nhật danh sách ngày cho select
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

// Gắn sự kiện
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

// Khởi tạo
updateOrderDays();
updateOrderInfo();

// === KHÁCH HÀNG ===
const timeType = document.getElementById('timeType');
const daySelect = document.getElementById('daySelect');
const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');

const ctxCustomer = document.getElementById('customerChart')?.getContext('2d');
let customerChart = null;

// Khởi tạo biểu đồ khách hàng từ controller
function initCustomerChart() {
    if (!ctxCustomer) return;

    customerChart = new Chart(ctxCustomer, {
        type: 'bar',
        data: {
            labels: window.customerChartLabels,
            datasets: [{
                label: 'Số lượng khách hàng',
                data: window.customerChartData,
                backgroundColor: '#5E17EB'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Thống kê khách hàng' }
            },
            scales: {
                x: { ticks: { maxRotation: 0, minRotation: 0 } },
                y: { beginAtZero: true }
            }
        }
    });
}

// Cập nhật biểu đồ khách hàng (nếu muốn dynamic theo thời gian)
function updateCustomerChart() {
    if (!customerChart) return;
    customerChart.data.labels = window.customerChartLabels;
    customerChart.data.datasets[0].data = window.customerChartData;
    customerChart.update();

    const type = timeType.value;
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

// Gắn sự kiện
timeType.addEventListener('change', updateCustomerChart);
daySelect.addEventListener('change', updateCustomerChart);
monthSelect.addEventListener('change', updateCustomerChart);
yearSelect.addEventListener('change', updateCustomerChart);

// Khởi tạo
initCustomerChart();
updateCustomerChart();
