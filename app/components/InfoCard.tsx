import { LucideIcon } from "lucide-react"
import formatCurrency from "../functions/formatCurrency"

interface InfoCardProps {
    label: string
    value: number | string
    Icon: LucideIcon
    iconColor?: string
    labelColor?: string
    valueColor?: string
    isCurrency?: boolean
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
    width = "w-full",
    height = "h-auto",
    subtext,
    suffix = "",
}: InfoCardProps) {
    const displayValue =
        typeof value === "number"
            ? isCurrency
                ? formatCurrency(value) + suffix
                : value.toLocaleString() + suffix
            : value

    return (
        <div
            className={`bg-slate-800/50 shadow-md rounded-xl p-5 border border-slate-600 ${width} ${height}`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full bg-slate-900/60`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <span className={`text-base tracking-wide font-semibold font-roboto-sans ${labelColor}`}>
                        {label}
                    </span>
                </div>
                {subtext && (
                    <p className="text-sm font-semibold font-electrolize text-slate-400 whitespace-nowrap">
                        {subtext}
                    </p>
                )}
            </div>
            <p
                className={`text-xl font-semibold font-geist-sans tracking-tight leading-snug ${valueColor}`}
            >
                {displayValue}
            </p>
        </div>
    )
}
