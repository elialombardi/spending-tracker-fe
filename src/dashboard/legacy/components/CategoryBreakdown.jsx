import React from 'react'
import { formatPercent, formatMoney, formatDate } from '../lib/formatters'

function getPreviousCycleComparisonTone(currentAmount, previousAmount) {
    if (previousAmount > currentAmount) {
        return 'is-higher'
    }

    if (previousAmount < currentAmount) {
        return 'is-lower'
    }

    return ''
}

export default function CategoryBreakdown({ monthlyReport, previousCycleComparison, previousCycleCategorySpend }) {
    return (
        <>
            {monthlyReport && monthlyReport.categories.length > 0 ? (
                <div className="category-breakdown">
                    {monthlyReport.categories.map((category) => {
                        const width = Math.max(category.shareOfSpent * 100, 2)
                        const previousCycleAmount = previousCycleCategorySpend[category.category] ?? 0
                        const currentCostTone = getPreviousCycleComparisonTone(
                            category.totalSpent,
                            previousCycleAmount,
                        )

                        return (
                            <article key={category.category} className="category-row">
                                <header>
                                    <h3>{category.category}</h3>
                                    <span className={`money-pill ${currentCostTone}`.trim()}>
                                        {formatMoney(category.totalSpent)}
                                    </span>
                                </header>
                                <div className="category-bar-track">
                                    <div className="category-bar-fill" style={{ width: `${width}%` }}></div>
                                </div>
                                <div className="merchant-meta">
                                    <span>{formatPercent(category.shareOfSpent)} of spending</span>
                                    <span>{category.transactions} transactions</span>
                                </div>
                                {previousCycleComparison ? (
                                    <div className="merchant-meta">
                                        <span>
                                            Previous cycle through {formatDate(previousCycleComparison.comparableTo)}:{' '}
                                            {formatMoney(previousCycleAmount)}
                                        </span>
                                    </div>
                                ) : null}
                            </article>
                        )
                    })}
                </div>
            ) : (
                <div style={{ padding: 16 }}>No expenses in the selected income cycle yet.</div>
            )}
        </>
    )
}
