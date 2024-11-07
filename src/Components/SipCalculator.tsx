import React, { useState, useEffect, useMemo } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { IndianRupee, TrendingUp, Calendar } from "lucide-react";
// import { ChartOptions } from 'chart.js';
// import { TooltipItem } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const SipCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const calculateSIP = () => {
    try {
      const monthlyRate = expectedReturn / (12 * 100);
      const months = timePeriod * 12;
      const invested = monthlyInvestment * months;

      const futureValue =
        monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);

      setTotalInvestment(invested);
      setEstimatedReturns(Math.max(0, Math.round(futureValue - invested)));
      setTotalValue(Math.max(invested, Math.round(futureValue)));
    } catch (error) {
      console.error("Calculation error:", error);
      // Set safe default values
      setTotalInvestment(monthlyInvestment * timePeriod * 12);
      setEstimatedReturns(0);
      setTotalValue(monthlyInvestment * timePeriod * 12);
    }
  };

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const chartData = useMemo(
    () => ({
      labels: Array.from({ length: timePeriod + 1 }, (_, i) => i),
      datasets: [
        {
          label: "Investment Value",
          data: Array.from({ length: timePeriod + 1 }, (_, i) => {
            try {
              const monthlyRate = expectedReturn / (12 * 100);
              const months = i * 12;
              if (months === 0) return 0;
              return Math.round(
                monthlyInvestment *
                  ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
                  (1 + monthlyRate),
              );
            } catch {
              return i * monthlyInvestment * 12;
            }
          }),
          borderColor: "#6366f1",
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          fill: true,
        },
        {
          label: "Amount Invested",
          data: Array.from(
            { length: timePeriod + 1 },
            (_, i) => i * monthlyInvestment * 12,
          ),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
        },
      ],
    }),
    [timePeriod, expectedReturn, monthlyInvestment],
  );

  const distributionData = useMemo(
    () => ({
      labels: ["Invested Amount", "Est. Returns"],
      datasets: [
        {
          data: [totalInvestment, estimatedReturns],
          backgroundColor: [
            "rgba(99, 102, 241, 0.8)",
            "rgba(199, 210, 254, 0.8)",
          ],
          borderColor: ["rgba(99, 102, 241, 1)", "rgba(199, 210, 254, 1)"],
          borderWidth: 1,
        },
      ],
    }),
    [totalInvestment, estimatedReturns],
  );

  const distributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
      title: {
        display: true,
        text: "Investment Distribution",
        font: {
          size: window.innerWidth < 768 ? 14 : 16,
        },
      },
    },
    cutout: "60%",
  };

  // const chartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       position: "top" as const,
  //       labels: {
  //         font: {
  //           size: window.innerWidth < 768 ? 10 : 12,
  //         },
  //       },
  //     },
  //     title: {
  //       display: true,
  //       text: "Wealth Growth Projection",
  //       font: {
  //         size: window.innerWidth < 768 ? 14 : 16,
  //       },
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label: (context: TooltipItem<'line'>) => { // Specify type for context
  //           let label = context.dataset.label || "";
  //           if (label) {
  //             label += ": ";
  //           }
  //           if (context.parsed.y !== null) {
  //             label += formatCurrency(context.parsed.y);
  //           }
  //           return label;
  //         },
  //       },
  //     },
  //   },
  //   scales: {
  //     y: {
  //       ticks: {
  //         callback: (value: number) => {
  //           if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  //           if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  //           return `₹${value.toLocaleString()}`;
  //         },
  //         font: {
  //           size: window.innerWidth < 768 ? 10 : 12,
  //         },
  //       },
  //     },
  //     x: {
  //       title: {
  //         display: true,
  //         text: "Years",
  //         font: {
  //           size: window.innerWidth < 768 ? 10 : 12,
  //         },
  //       },
  //       ticks: {
  //         font: {
  //           size: window.innerWidth < 768 ? 10 : 12,
  //         },
  //       },
  //     },
  //   },
  // };

  const formatCurrency = (amount: number) => {
    try {
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
      return `₹${amount.toLocaleString()}`;
    } catch {
      return "₹0";
    }
  };

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(Number(e.target.value), 500), 100000);
    setMonthlyInvestment(value);
  };

  const handleReturnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(Number(e.target.value), 1), 30);
    setExpectedReturn(value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(Number(e.target.value), 1), 30);
    setTimePeriod(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            SIP Calculator
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Plan your financial future with our SIP calculator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="flex items-center text-gray-700 text-sm sm:text-base mb-2">
                  <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Monthly Investment
                </label>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={monthlyInvestment}
                  onChange={handleInvestmentChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-xs sm:text-sm">
                  <span className="text-gray-500">₹500</span>
                  <span className="font-medium text-indigo-600">
                    ₹{monthlyInvestment.toLocaleString()}
                  </span>
                  <span className="text-gray-500">₹1,00,000</span>
                </div>
              </div>

              <div>
                <label className="flex items-center text-gray-700 text-sm sm:text-base mb-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Expected Return Rate (% p.a)
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={expectedReturn}
                  onChange={handleReturnChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-xs sm:text-sm">
                  <span className="text-gray-500">1%</span>
                  <span className="font-medium text-indigo-600">
                    {expectedReturn}%
                  </span>
                  <span className="text-gray-500">30%</span>
                </div>
              </div>

              <div>
                <label className="flex items-center text-gray-700 text-sm sm:text-base mb-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Time Period (Years)
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={timePeriod}
                  onChange={handleTimeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-xs sm:text-sm">
                  <span className="text-gray-500">1 Year</span>
                  <span className="font-medium text-indigo-600">
                    {timePeriod} Years
                  </span>
                  <span className="text-gray-500">30 Years</span>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Total Investment
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatCurrency(totalInvestment)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Est. Returns
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatCurrency(estimatedReturns)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Total Value
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatCurrency(totalValue)}
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 h-48 sm:h-64">
              <Doughnut data={distributionData} options={distributionOptions} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="h-[400px] sm:h-[500px]">
              <Line data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SipCalculator;
