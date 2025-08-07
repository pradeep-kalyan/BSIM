import { LucideIcon } from "lucide-react"

interface InfoCardProps {
    label: string
    value: number | string
    Icon: LucideIcon
    iconColor?: string
    labelColor?: string
    valueColor?: string
    isCurrency?: boolean
    currencyCode?: string
    width?: string
    height?: string
    subtext?: string
    suffix?: string
}

export default function InfoCard({
    label,
    value,
    Icon,
    iconColor = "text-yellow-400",
    labelColor = "text-white",
    valueColor = "text-white",
    isCurrency = false,
    currencyCode = "INR",
    width = "w-full",
    height = "h-auto",
    subtext,
    suffix = "",
}: InfoCardProps) {
    const displayValue =
        typeof value === "number"
            ? isCurrency
                ? value.toLocaleString("en-IN", {
                    style: "currency",
                    currency: currencyCode,
                    maximumFractionDigits: 0,
                })
                : value.toLocaleString() + suffix
            : value

    return (
        <div
            className={`bg-slate-800/50 shadow-md rounded-xl p-5 shadow-md border border-slate-600 ${width} ${height}`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-slate-900/60`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <span className={`text-base font-semibold tracking-wide ${labelColor}`}>
                        {label}
                    </span>
                </div>
                {subtext && (
                    <p className="text-sm font-medium text-slate-400 whitespace-nowrap">
                        {subtext}
                    </p>
                )}
            </div>
            <p
                className={`text-2xl font-extrabold tracking-tight leading-snug ${valueColor}`}
            >
                {displayValue}
            </p>
        </div>
    )
}
