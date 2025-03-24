<template>
    <div class="p-10">
        <section>
            <h6 class="mb-6 text-xl font-medium text-center">Thông tin chung</h6>
            <div v-if="statisticGeneral && statisticGeneral.length > 0" class="grid grid-cols-12 w-full gap-6">
                <div class="col-span-4" v-for="(item, index) in statisticGeneral" :key="index">
                    <div class="flex items-center justify-between p-5 bg-green-200 rounded-lg shadow-sm">
                        <div>
                            <h6 class="text-lg font-medium">{{ item.name }}</h6>
                            <p class="text-3xl font-semibold">{{
                                item.name == 'Tổng doanh thu' ? formatCurrency(item.value) : item.value
                            }}</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>

        <div>
            <div class="flex gap-5 items-center my-10 border-y py-10">
                <!--thống kê theo thời gian-->
                <h6>
                    Thống kê tổng quan :
                </h6>
                <a-select v-model:value="timeSelection" style="width: 300px" size="large">
                    <a-select-option v-for="item in timeOptions" :key="item.value" :value="item.value">{{ item.label
                        }}</a-select-option>
                </a-select>
            </div> 
            <section>
                <h6 class="mb-6 text-xl font-medium text-center">Biểu đồ thống kê</h6>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <div v-for="(chart, index) in charts" :key="index" class="chart-container">
                        <canvas :id="chart.id"></canvas>
                        <div class="text-center mt-4 text-xl font-medium">
                            {{ chart.name ?? 'null' }}
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div>
            <div class="flex gap-5 items-center my-10 border-y py-10">
                <!--thống kê theo thời gian-->
                <h6>
                    Thống kê theo ngày chỉ định :
                </h6>
              
                <a-range-picker v-model:value="dateRangeSelect" @change="handleCheckChangeDateRange"/>
            </div> 
            <section>
                <h6 class="mb-6 text-xl font-medium text-center">Biểu đồ thống kê</h6>
                <div class="">
                    <div v-for="(chart, index) in chartsV2" :key="index" class="chart-container">
                        <canvas :id="chart.id"></canvas>
                        <div class="text-center mt-4 text-xl font-medium">
                            {{ chart.name ?? 'null' }}
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <section class="mt-32">
            <div class="grid grid-cols-12 w-full gap-20">
                <div class="col-span-6">
                    <h6 class="mb-6 text-xl font-medium text-center">Top 10 sản phẩm bán chạy nhất</h6>
                    <a-table :columns="tableBestSellerColumns" :dataSource="productBestSeller ?? []" rowKey="id"
                        :pagination="false" bordered>
                        <template #bodyCell="{ column, record, text }">
                            <template v-if="column.dataIndex == 'total_amount'">
                                <span>{{ formatCurrency(Number.parseInt(text) * record.total_quantity) }}</span>
                            </template>
                        </template>
                    </a-table>
                </div>
                <div class="col-span-6">
                    <h6 class="mb-6 text-xl font-medium text-center">Top 10 khách hàng mua nhiều nhất</h6>

                    <a-table :columns="tableUserBestSellerColumns" :dataSource="userBestSeller ?? []" rowKey="id"
                        :pagination="false" bordered>
                        <template #bodyCell="{ column, record, text }">
                            <template v-if="column.dataIndex == 'full_name'">
                                <div class="flex items-center gap-4">
                                    <a-avatar size="large" :src="record.avatar" />
                                    <span>{{ text }}</span>
                                </div>
                            </template>
                        </template>
                    </a-table>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, reactive, computed } from 'vue';
import { Chart, registerables, type ChartType } from 'chart.js';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { IProduct } from '~/interfaces/product';
type RangeValue = [Dayjs, Dayjs];

const dateRangeSelect = ref<RangeValue>(
    [dayjs().startOf('year'), dayjs().endOf('year')]
);

const authStore = useAuthStore();

const accessToken = computed(() => {
    return authStore.accessToken;
});

Chart.register(...registerables);

const timeOptions = [
    { label: 'Hôm nay', value: 'today' },
    { label: 'Hôm qua', value: 'yesterday' },
    { label: 'Tuần này', value: 'this_week' },
    { label: 'Tháng này', value: 'this_month' },
    { label: 'Năm nay', value: 'this_year' },
    { label: 'Tất cả', value: 'all' }
];

const timeSelection = ref('this_year');

const charts = ref([
    {
        id: 'chart1',
        type: 'bar',
        name: 'Biểu đồ cột doanh thu',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
                {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        }
    },
    {
        id: 'chart2',
        type: 'line',
        name: 'Biểu đồ đường doanh thu',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [
                {
                    label: 'Sales',
                    data: [65, 59, 80, 81, 56, 55],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }
            ]
        }
    }
]);

const chartsV2 = ref([
    {
        id: 'chartV2_1',
        type: 'bar',
        name: 'Biểu đồ cột doanh thu',
        data: {
            labels: [],
            datasets: [
                {
                    label: '# of Votes',
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        }
    },
]);

const chartInstances = ref<Chart[] | any>([]);

const updateChartLabels = () => {
    const timeLabel = timeOptions.find(option => option.value === timeSelection.value)?.label || '';
    charts.value.forEach(chart => {
        chart.data.datasets[0].label = `# of Votes (${timeLabel})`;
    });

    chartsV2.value.forEach(chart => {
        chart.data.datasets[0].label = `# of Votes (${statisticOrderQuery.dateTimeDetail.start} - ${statisticOrderQuery.dateTimeDetail.end})` ;
    });

    switch (timeSelection.value) {
        case 'today':
            charts.value[0].data.labels = ['0h', '3h', '6h', '9h', '12h', '15h', '18h', '21h', '24h'];
            charts.value[0].data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            charts.value[1].data.labels = ['0h', '3h', '6h', '9h', '12h', '15h', '18h', '21h', '24h'];
            charts.value[1].data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            break;
        case 'yesterday':
            charts.value[0].data.labels = ['0h', '3h', '6h', '9h', '12h', '15h', '18h', '21h', '24h'];
            charts.value[1].data.labels = ['0h', '3h', '6h', '9h', '12h', '15h', '18h', '21h', '24h'];
            break;
        case 'this_week':
            charts.value[0].data.labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
            charts.value[1].data.labels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
            break;
        case 'this_month':
            charts.value[0].data.labels = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
            charts.value[1].data.labels = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
            break;
        case 'this_year':
            charts.value[0].data.labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
            charts.value[1].data.labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
            break;
        case 'all':
            charts.value[0].data.labels = Array.from({ length: 7 }, (_, i) => (dayjs().year() - 6 + i).toString());
            charts.value[1].data.labels = Array.from({ length: 7 }, (_, i) => (dayjs().year() - 6 + i).toString());
            break;
    }
};

const { data: productBestSeller } = await useFetch<any[]>('/api/statistics/top-10-best-seller', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken.value}`
    },
    baseURL: useRuntimeConfig().public.baseURLAPI
});

const renderCharts = () => {
    // Destroy existing chart instances
    chartInstances.value.forEach((instance: any) => instance.destroy());
    chartInstances.value = [];

    // Create new chart instances
    charts.value.forEach(chart => {
        const ctx = document.getElementById(chart.id) as HTMLCanvasElement;
        const chartInstance = new Chart(ctx, {
            type: chart.type as ChartType,
            data: chart.data,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        chartInstances.value.push(chartInstance);
    });

    chartsV2.value.forEach(chart => {
        const ctx = document.getElementById(chart.id) as HTMLCanvasElement;
        const chartInstance = new Chart(ctx, {
            type: chart.type as ChartType,
            data: chart.data,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
        chartInstances.value.push(chartInstance);
    });
};

const updateChartData = (newData: any) => {
    const chart1 = charts.value.find(chart => chart.id === 'chart1');
    if (chart1) {
        chart1.data.datasets[0].data = newData;
    }

    const chart2 = charts.value.find(chart => chart.id === 'chart2');
    if (chart2) {
        chart2.data.datasets[0].data = newData;
    }
};

//update chart2 
const updateChartDataV2 = (newData: any) => {
    const chart1 = chartsV2.value.find(chart => chart.id === 'chartV2_1');
    if (chart1) {
        chart1.data.labels = newData.labels;
        chart1.data.datasets[0].data = newData.data;
    }

    // const chart2 = chartsV2.value.find(chart => chart.id === 'chartV2_2');
    // if (chart2) {
    //     chart2.data.labels = newData.labels;
    //     chart2.data.datasets[0].data = newData.data;
    // }
};
// const addData = (chart: Chart, label: string, newData: number) => {
//     chart.data.labels.push(label);
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.push(newData);
//     });
//     chart.update();
// };

// const removeData = (chart: Chart) => {
//     chart.data.labels.pop();
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.pop();
//     });
//     chart.update();
// };

watch(timeSelection, async () => {
    statisticOrderQuery.optionShow = timeSelection.value;
    updateChartLabels();
    await fetchDataAndUpdateCharts();
});

onMounted(async () => {
    updateChartLabels();
    await fetchDataAndUpdateCharts();
});


const statisticOrderQuery = reactive({
    optionShow: timeSelection.value,
    dateTimeDetail : {
        start: dateRangeSelect.value[0].format('YYYY-MM-DD'),
        end: dateRangeSelect.value[1].format('YYYY-MM-DD')
    }
});

const fetchDataAndUpdateCharts = async () => {
    let statisticOrder = await $fetch<{
        labels: string[];
        dataChartV1: any[];
        dataChartV2: {
            labels: string[];
            data: number[];
        };
    }>('/api/statistics/revenue', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken.value}`
        },
        baseURL: useRuntimeConfig().public.baseURLAPI,
        query: statisticOrderQuery
    });

    if (statisticOrder) {
        updateChartData(statisticOrder.dataChartV1);
        updateChartDataV2(statisticOrder.dataChartV2);
        renderCharts();
    }
};

const tableBestSellerColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '10%'
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'title',
        key: 'title',
        width: '30%'
    },
    {
        title: 'Đã bán',
        dataIndex: 'total_quantity',
        key: 'total_quantity',
        width: '15%'
    },
    {
        title: 'Số lượng còn lại',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '15%'
    },
    // {
    //     title: 'Doanh thu (chưa tính phí vận chuyển)',
    //     dataIndex: 'total_amount',
    //     key: 'total_amount',
    //     width: '15%'
    // }
    // {
    //     title: 'Doanh thu',
    //     dataIndex: 'total_amount',
    //     key: 'total_amount',
    //     width: '15%'
    // }
]


// get top 10 user mua nhieu nhat

const { data: userBestSeller } = await useFetch<any[]>('/api/statistics/top-10-customer', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken.value}`
    },
    baseURL: useRuntimeConfig().public.baseURLAPI
});

const tableUserBestSellerColumns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '10%'
    },
    {
        title: 'Tên khách hàng',
        dataIndex: 'full_name',
        key: 'fu_name',
        width: '20%'
    },
    {
        title: 'Mua nhiều đơn hàng nhất',
        dataIndex: 'total_order',
        key: 'total_order',
        width: '15%'
    }
]

//Thống kê thông tin chung
const { data: statisticGeneral } = await useFetch<any>('/api/statistics', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken.value}`
    },
    baseURL: useRuntimeConfig().public.baseURLAPI
});

const handleCheckChangeDateRange = async (value: [any, any]) => {
    statisticOrderQuery.dateTimeDetail.start = value[0].format('YYYY-MM-DD');
    statisticOrderQuery.dateTimeDetail.end = value[1].format('YYYY-MM-DD');

    await fetchDataAndUpdateCharts();
}

</script>

<style scoped>
.chart-container {
    height: 300px;
}
</style>