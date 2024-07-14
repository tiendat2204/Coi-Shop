import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../../api/categoryApi";
import { getAllUsers } from "../../../api/usersApi";
import { getAllProducts } from "../../../api/productApi";
import { getAllOrders } from "../../../api/orderApi";
import Chart from "react-apexcharts";

const DashboardAdmin = () => {
  const [dashboardSummary, setDashboardSummary] = useState({
    usersCount: 0,
    productsCount: 0,
    categoriesCount: 0,
  });
  const [orderStats, setOrderStats] = useState({
    Pending: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  });
  const [dailyOrderData, setDailyOrderData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month

  const fetchOrderData = async () => {
    try {
      const orders = await getAllOrders();
      const stats = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {
        Pending: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0,
      });

      const dailyData = orders.reduce((acc, order) => {
        const date = new Date(order.createdAt);
        const month = date.getMonth();
        if (month === selectedMonth) {
          const day = date.getDate();
          acc[day] = (acc[day] || 0) + 1;
        }
        return acc;
      }, {});

      setOrderStats(stats);
      setDailyOrderData(dailyData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchDashboardStatistics = async () => {
    try {
      const [users, products, categories] = await Promise.all([
        getAllUsers(),
        getAllProducts(),
        getAllCategories(),
      ]);
      setDashboardSummary({
        usersCount: users.length,
        productsCount: products.length,
        categoriesCount: categories.length,
      });
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
    }
  };

  useEffect(() => {
    fetchDashboardStatistics();
    fetchOrderData();
  }, [selectedMonth]);

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const daysInMonth = new Date(2024, selectedMonth + 1, 0).getDate();
  const chartData = {
    height: 240,

    series: [
      {
        name: "Orders",
        data: Array.from({ length: daysInMonth }, (_, index) => dailyOrderData[index + 1] || 0),
      },
    ],
    options: {
      chart: {
        type: 'line',
        toolbar: {
          show: true,
        },
      },
      title: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617"],
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: Array.from({ length: daysInMonth }, (_, index) => index + 1),
      },
      yaxis: {
        max: 30, 
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };

  return (
    <div className="p-6 border-2 rounded-md bg-gray-400">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-6">
            <div>
              <div className="flex items-center mb-1">
                <div className="text-2xl font-semibold">
                  {dashboardSummary.usersCount}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-400">Users</div>
            </div>
          </div>
          <a
            href="/admin/users"
            className="text-[#f84525] font-medium text-sm hover:text-red-800"
          >
            View
          </a>
        </div>
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-4">
            <div>
              <div className="flex items-center mb-1">
                <div className="text-2xl font-semibold">{dashboardSummary.productsCount}</div>
                <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[12px] font-semibold leading-none ml-2">
                  +30%
                </div>
              </div>
              <div className="text-sm font-medium text-gray-400">Product</div>
            </div>
          </div>
          <a
            href="/dierenartsen"
            className="text-[#f84525] font-medium text-sm hover:text-red-800"
          >
            View
          </a>
        </div>
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-2xl font-semibold mb-1">{dashboardSummary.categoriesCount}</div>
              <div className="text-sm font-medium text-gray-400">Category</div>
            </div>
          </div>
          <a
            href="/admin/category"
            className="text-[#f84525] font-medium text-sm hover:text-red-800"
          >
            View
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-3">
          <div className="flex justify-between mb-4 items-start">
            <div className="font-medium">Order Statistics</div>
            <div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="p-2 px-7 rounded border"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {Object.entries(orderStats).map(([status, count]) => (
              <div key={status} className="rounded-md border border-dashed border-gray-200 p-4">
                <div className="flex items-center mb-0.5">
                  <div className="text-xl font-semibold">{count}</div>
                </div>
                <span className="text-gray-400 text-sm">{status}</span>
              </div>
            ))}
          </div>
          <div className="border rounded-md p-3">
            <Chart {...chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
