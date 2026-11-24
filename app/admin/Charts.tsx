"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const WINE = "#8a2440";
const TURQUOISE = "#2ec4b6";

const tooltipStyle = {
  direction: "rtl" as const,
  borderRadius: 12,
  border: "1px solid #e5d5dd",
  fontSize: 12,
  fontFamily: "inherit",
};

export function RevenueChart({
  data,
}: {
  data: { month: string; revenue: number }[];
}) {
  return (
    <div dir="ltr" className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={TURQUOISE} stopOpacity={0.45} />
              <stop offset="100%" stopColor={TURQUOISE} stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#efe6ea" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#7a5c6b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#7a5c6b" }}
            axisLine={false}
            tickLine={false}
            width={70}
            tickFormatter={(v: number) => v.toLocaleString("fa-IR")}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [
              `${Number(value).toLocaleString("fa-IR")} تومان`,
              "درآمد",
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={TURQUOISE}
            strokeWidth={2.5}
            fill="url(#revenueFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BookingsByClassChart({
  data,
}: {
  data: { title: string; count: number }[];
}) {
  return (
    <div dir="ltr" className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#efe6ea" vertical={false} />
          <XAxis
            dataKey="title"
            tick={{ fontSize: 11, fill: "#7a5c6b" }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={60}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "#7a5c6b" }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={(v: number) => v.toLocaleString("fa-IR")}
          />
          <Tooltip
            cursor={{ fill: "rgba(46, 196, 182, 0.08)" }}
            contentStyle={tooltipStyle}
            formatter={(value) => [`${Number(value).toLocaleString("fa-IR")}`, "رزرو"]}
          />
          <Bar dataKey="count" fill={WINE} radius={[8, 8, 0, 0]} maxBarSize={38} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
