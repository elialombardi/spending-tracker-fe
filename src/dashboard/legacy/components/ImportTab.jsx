import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import CategoryAssignmentCard from './shared/CategoryAssignmentCard'
import EmptyState from './shared/EmptyState'
import MappingCard from './shared/MappingCard'
import Pagination from './shared/Pagination'

const MANAGEMENT_TABS = [
    {
        id: 'corrections',
        title: 'Fix an existing category',
        note: 'Correct automatic or manual expense categories.',
    },
    {
        id: 'mappings',
        title: 'Manage category mappings',
        note: 'Adjust reusable merchant rules and their behavior.',
    },
    {
        id: 'cycle-income',
        title: 'Cycle-defining incomes',
        note: 'Choose which income categories start a cycle.',
    },
]

function normalizeCycleIncomeCategoryName(categoryName) {
    return categoryName.trim().replace(/\s+/g, ' ')
}

function isSameCycleIncomeCategory(left, right) {
    return normalizeCycleIncomeCategoryName(left).toLowerCase() === normalizeCycleIncomeCategoryName(right).toLowerCase()
}

function sortCycleIncomeCategories(categories) {
    return [...categories].sort((left, right) => {
        if (left.definesCycle !== right.definesCycle) {
            return left.definesCycle ? -1 : 1
        }

        return left.name.localeCompare(right.name)
    })
}

function renderImportResult(importResult) {
    if (!importResult) {
        return <EmptyState message="No workbook uploaded in this session." />
    }

    return (
        <div className="import-result-grid">
            <article className="import-stat">
                <span className="metric-label">Imported</span>
                <strong className="import-value accent">{importResult.importedTransactions}</strong>
            </article>
            <article className="import-stat">
                <span className="metric-label">Duplicates skipped</span>
                <strong className="import-value">{importResult.skippedDuplicates}</strong>
            </article>
            <article className="import-stat">
                <span className="metric-label">Auto-categorized</span>
                <strong className="import-value secondary">{importResult.autoCategorizedTransactions}</strong>
            </article>
            <article className="import-stat">
                <span className="metric-label">Need review</span>
                <strong className="import-value">{importResult.reviewTransactions}</strong>
            </article>
        </div>
    )
}

export default function ImportTab({
    active,
    categories,
    categorizedExpenses,
    categorizedPage,
    categorizedPageSize,
    cycleIncomeCategories,
    categoryMappings,
    incomePage,
    incomePageSize,
    incomeTransactions,
    importResult,
    isBusy,
    mappingsPage,
    mappingsPageSize,
    onCategorize,
    onCategorizedPageChange,
    onCategorizedPageSizeChange,
    onDeleteMapping,
    onIncomePageChange,
    onIncomePageSizeChange,
    onMappingsPageChange,
    onMappingsPageSizeChange,
    onSaveMapping,
    onSaveCycleIncomeCategories,
    onUpload,
}) {
    const [selectedFile, setSelectedFile] = useState(null)
    const [inputKey, setInputKey] = useState(0)
    const [activeManagementTab, setActiveManagementTab] = useState('corrections')
    const [draftCycleIncomeCategories, setDraftCycleIncomeCategories] = useState([])
    const [customCycleIncomeCategory, setCustomCycleIncomeCategory] = useState('')
    const correctionsPageCount = Math.max(1, Math.ceil(categorizedExpenses.length / categorizedPageSize))
    const currentCorrectionsPage = Math.min(categorizedPage, correctionsPageCount)
    const correctionsStart = (currentCorrectionsPage - 1) * categorizedPageSize
    const correctionsItems = categorizedExpenses.slice(
        correctionsStart,
        correctionsStart + categorizedPageSize,
    )
    const mappingsPageCount = Math.max(1, Math.ceil(categoryMappings.length / mappingsPageSize))
    const currentMappingsPage = Math.min(mappingsPage, mappingsPageCount)
    const mappingsStart = (currentMappingsPage - 1) * mappingsPageSize
    const mappingsItems = categoryMappings.slice(mappingsStart, mappingsStart + mappingsPageSize)
    const incomePageCount = Math.max(1, Math.ceil(incomeTransactions.length / incomePageSize))
    const currentIncomePage = Math.min(incomePage, incomePageCount)
    const incomeStart = (currentIncomePage - 1) * incomePageSize
    const incomeItems = incomeTransactions.slice(incomeStart, incomeStart + incomePageSize)
    const selectedCycleIncomeCategoryCount = cycleIncomeCategories.categories.filter(
        (category) => category.definesCycle,
    ).length
    const displayedCycleIncomeCategories = sortCycleIncomeCategories([
        ...cycleIncomeCategories.categories,
        ...draftCycleIncomeCategories
            .filter(
                (categoryName) =>
                    !cycleIncomeCategories.categories.some((category) =>
                        isSameCycleIncomeCategory(category.name, categoryName),
                    ),
            )
            .map((categoryName) => ({
                name: categoryName,
                incomeTransactions: 0,
                definesCycle: true,
                isDraftOnly: true,
            })),
    ])

    useEffect(() => {
        setDraftCycleIncomeCategories(
            cycleIncomeCategories.categories
                .filter((category) => category.definesCycle)
                .map((category) => category.name),
        )
    }, [cycleIncomeCategories])

    async function handleSubmit(event) {
        event.preventDefault()
        const success = await onUpload(selectedFile)

        if (success) {
            setSelectedFile(null)
            setInputKey((currentKey) => currentKey + 1)
        }
    }

    async function handleCycleIncomeCategoriesSave() {
        await onSaveCycleIncomeCategories(draftCycleIncomeCategories)
    }

    function handleCycleIncomeCategoryToggle(categoryName) {
        setDraftCycleIncomeCategories((currentCategories) => {
            if (currentCategories.some((currentCategory) => isSameCycleIncomeCategory(currentCategory, categoryName))) {
                return currentCategories.filter(
                    (currentCategory) => !isSameCycleIncomeCategory(currentCategory, categoryName),
                )
            }

            return [...currentCategories, normalizeCycleIncomeCategoryName(categoryName)].sort((left, right) =>
                left.localeCompare(right),
            )
        })
    }

    function handleCustomCycleIncomeCategoryAdd(event) {
        event.preventDefault()

        const normalizedCategoryName = normalizeCycleIncomeCategoryName(customCycleIncomeCategory)
        if (!normalizedCategoryName) {
            return
        }

        setDraftCycleIncomeCategories((currentCategories) => {
            if (currentCategories.some((currentCategory) => isSameCycleIncomeCategory(currentCategory, normalizedCategoryName))) {
                return currentCategories
            }

            return [...currentCategories, normalizedCategoryName].sort((left, right) => left.localeCompare(right))
        })
        setCustomCycleIncomeCategory('')
    }

    return (
        <section
            id="page-import"
            className={`tab-page${active ? ' is-active' : ''}`}
            role="tabpanel"
            aria-labelledby="tab-import"
            hidden={!active}
        >
            <Box sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }} elevation={0} className="upload-panel">
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="overline">Import</Typography>
                                <Typography variant="h5">Bring in the latest workbook</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Repeated uploads are safe. Existing rows are matched with a synthetic
                                    fingerprint and skipped.
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={handleSubmit}>
                                <Stack spacing={1}>
                                    <Button variant="outlined" component="label">
                                        {selectedFile?.name || 'Drop a Poste Italiane .xlsx export here'}
                                        <input
                                            key={inputKey}
                                            id="workbook-file"
                                            name="file"
                                            type="file"
                                            accept=".xlsx"
                                            required
                                            hidden
                                            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                                        />
                                    </Button>

                                    <Button variant="contained" type="submit" disabled={isBusy || !selectedFile}>
                                        Import workbook
                                    </Button>
                                </Stack>
                            </Box>

                            <Box sx={{ mt: 2 }}>{renderImportResult(importResult)}</Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2 }} elevation={0} className="management-panel">
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="overline">Manage imports</Typography>
                                <Typography variant="h5">Review categories and merchant rules</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Switch between one-off category corrections, reusable merchant mappings,
                                    and cycle-start settings without leaving the import workspace.
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }} role="tablist" aria-label="Import management tabs">
                                {MANAGEMENT_TABS.map((tab) => {
                                    const isActive = activeManagementTab === tab.id
                                    const count = tab.id === 'corrections'
                                        ? categorizedExpenses.length
                                        : tab.id === 'mappings'
                                            ? categoryMappings.length
                                            : selectedCycleIncomeCategoryCount

                                    return (
                                        <Button
                                            key={tab.id}
                                            variant={isActive ? 'contained' : 'outlined'}
                                            onClick={() => setActiveManagementTab(tab.id)}
                                            aria-controls={`import-panel-${tab.id}`}
                                        >
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{tab.title}</Typography>
                                                <Typography variant="caption" color="text.secondary">{tab.note}</Typography>
                                            </Box>
                                            <Box sx={{ ml: 1 }}>{count}</Box>
                                        </Button>
                                    )
                                })}
                            </Box>

                            <Box
                                id="import-panel-corrections"
                                role="tabpanel"
                                aria-labelledby="import-tab-corrections"
                                hidden={activeManagementTab !== 'corrections'}
                            >
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="overline">Corrections</Typography>
                                    <Typography variant="h6">Fix an existing category</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Correct automatic or manual categories here. Use “Only this transaction” for a
                                        one-off mistake, or “Remember category for this description” to rewrite the reusable
                                        rule.
                                    </Typography>
                                </Box>

                                {categorizedExpenses.length === 0 ? (
                                    <EmptyState message="No categorized expenses in this cycle yet." />
                                ) : (
                                    <>
                                        <Box className="review-queue">
                                            {correctionsItems.map((transaction) => (
                                                <CategoryAssignmentCard
                                                    categories={categories}
                                                    key={transaction.transactionId}
                                                    context="edit"
                                                    isBusy={isBusy}
                                                    onSave={onCategorize}
                                                    transaction={transaction}
                                                />
                                            ))}
                                        </Box>

                                        <Pagination
                                            currentPage={currentCorrectionsPage}
                                            itemCount={categorizedExpenses.length}
                                            onPageChange={onCategorizedPageChange}
                                            onPageSizeChange={onCategorizedPageSizeChange}
                                            pageCount={correctionsPageCount}
                                            pageSize={categorizedPageSize}
                                        />
                                    </>
                                )}
                            </Box>

                            <Box
                                id="import-panel-mappings"
                                role="tabpanel"
                                aria-labelledby="import-tab-mappings"
                                hidden={activeManagementTab !== 'mappings'}
                            >
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="overline">Mappings</Typography>
                                    <Typography variant="h6">Manage category mappings</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Review the reusable merchant rules directly here. Save updates to change the
                                        mapping, or delete a mapping to stop auto-applying it on future imports.
                                    </Typography>
                                </Box>

                                {categoryMappings.length === 0 ? (
                                    <EmptyState message="No reusable merchant mappings saved yet." />
                                ) : (
                                    <>
                                        <Box className="review-queue">
                                            {mappingsItems.map((mapping) => (
                                                <MappingCard
                                                    categories={categories}
                                                    key={mapping.mappingId}
                                                    isBusy={isBusy}
                                                    mapping={mapping}
                                                    onDelete={onDeleteMapping}
                                                    onSave={onSaveMapping}
                                                />
                                            ))}
                                        </Box>

                                        <Pagination
                                            currentPage={currentMappingsPage}
                                            itemCount={categoryMappings.length}
                                            onPageChange={onMappingsPageChange}
                                            onPageSizeChange={onMappingsPageSizeChange}
                                            pageCount={mappingsPageCount}
                                            pageSize={mappingsPageSize}
                                        />
                                    </>
                                )}
                            </Box>

                            <Box
                                id="import-panel-cycle-income"
                                role="tabpanel"
                                aria-labelledby="import-tab-cycle-income"
                                hidden={activeManagementTab !== 'cycle-income'}
                            >
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="overline">Cycle starts</Typography>
                                    <Typography variant="h6">Choose which income categories define a cycle</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        A cycle starts only when an incoming transaction matches one of the
                                        categories saved here. Leave the list empty to keep using every income.
                                    </Typography>
                                </Box>

                                <Box sx={{ mb: 2 }} className="cycle-income-settings">
                                    <Box sx={{ mb: 1 }} className="cycle-income-summary">
                                        <Typography variant="caption" color="text.secondary">
                                            {cycleIncomeCategories.usesAllIncomeTransactions
                                                ? 'All income transactions currently define cycles'
                                                : `${selectedCycleIncomeCategoryCount} income categories define cycles`}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Incoming payments must be categorized with one of these names before
                                            they can anchor a cycle.
                                        </Typography>
                                    </Box>

                                    <Box component="form" onSubmit={handleCustomCycleIncomeCategoryAdd} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <TextField
                                            name="cycleIncomeCategory"
                                            placeholder="Salary, Pension, Freelance..."
                                            value={customCycleIncomeCategory}
                                            onChange={(event) => setCustomCycleIncomeCategory(event.target.value)}
                                            disabled={isBusy}
                                            size="small"
                                        />
                                        <Button variant="outlined" type="submit" disabled={isBusy}>
                                            Add category
                                        </Button>
                                    </Box>

                                    {displayedCycleIncomeCategories.length === 0 ? (
                                        <EmptyState message="No income categories are available yet. Add one above, then save it here." />
                                    ) : (
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} className="cycle-income-category-list">
                                            {displayedCycleIncomeCategories.map((category) => {
                                                const checked = draftCycleIncomeCategories.some((currentCategory) =>
                                                    isSameCycleIncomeCategory(currentCategory, category.name),
                                                )

                                                return (
                                                    <FormControlLabel
                                                        key={category.name}
                                                        control={<Checkbox checked={checked} onChange={() => handleCycleIncomeCategoryToggle(category.name)} disabled={isBusy} />}
                                                        label={
                                                            <Box>
                                                                <strong>{category.name}</strong>
                                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                                    {category.incomeTransactions} income payment{category.incomeTransactions === 1 ? '' : 's'} {category.isDraftOnly ? ' • Custom' : ''}
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                )
                                            })}
                                        </Box>
                                    )}

                                    <Box sx={{ mt: 1 }} className="button-row">
                                        <Button variant="contained" onClick={handleCycleIncomeCategoriesSave} disabled={isBusy}>
                                            Save cycle categories
                                        </Button>
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="overline">Attach categories</Typography>
                                        <Typography variant="h6">Select the incomes that belong to those categories</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Assign an income category here. Once a transaction uses a category selected
                                            above, it can become a valid cycle start.
                                        </Typography>
                                    </Box>

                                    {incomeTransactions.length === 0 ? (
                                        <EmptyState message="No incoming transactions are available yet." />
                                    ) : (
                                        <>
                                            <Box className="review-queue">
                                                {incomeItems.map((transaction) => (
                                                    <CategoryAssignmentCard
                                                        categories={categories}
                                                        key={transaction.transactionId}
                                                        context="edit"
                                                        isBusy={isBusy}
                                                        onSave={onCategorize}
                                                        transaction={transaction}
                                                    />
                                                ))}
                                            </Box>

                                            <Pagination
                                                currentPage={currentIncomePage}
                                                itemCount={incomeTransactions.length}
                                                onPageChange={onIncomePageChange}
                                                onPageSizeChange={onIncomePageSizeChange}
                                                pageCount={incomePageCount}
                                                pageSize={incomePageSize}
                                            />
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </section>
    )
}