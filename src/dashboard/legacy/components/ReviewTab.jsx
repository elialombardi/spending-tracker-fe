import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import CategoryAssignmentCard from './shared/CategoryAssignmentCard'
import EmptyState from './shared/EmptyState'
import Pagination from './shared/Pagination'

export default function ReviewTab({
    active,
    categories,
    isBusy,
    onCategorize,
    onPageChange,
    onPageSizeChange,
    page,
    pageSize,
    reviewQueue,
}) {
    const pageCount = Math.max(1, Math.ceil(reviewQueue.length / pageSize))
    const currentPage = Math.min(page, pageCount)
    const pageStart = (currentPage - 1) * pageSize
    const pageItems = reviewQueue.slice(pageStart, pageStart + pageSize)

    return (
        <section
            id="page-review"
            className={`tab-page${active ? ' is-active' : ''}`}
            role="tabpanel"
            aria-labelledby="tab-review"
            hidden={!active}
        >
            <Box sx={{ p: 2 }}>
                <Paper elevation={0} sx={{ p: 2 }} className="review-panel review-panel-wide">
                    <Box sx={{ mb: 2 }} className="section-heading">
                        <Typography variant="overline">Review queue</Typography>
                        <Typography variant="h5">Teach the tracker the uncertain rows</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Use reusable rules for stable merchants, and switch volatile merchants like
                            Amazon to “always ask” so every payment stays reviewable.
                        </Typography>
                    </Box>

                    {reviewQueue.length === 0 ? (
                        <EmptyState message="Nothing to review for the selected income cycle. The learned rules covered everything." />
                    ) : (
                        <>
                            <Box className="review-queue">
                                {pageItems.map((transaction) => (
                                    <CategoryAssignmentCard
                                        categories={categories}
                                        key={transaction.transactionId}
                                        context="review"
                                        isBusy={isBusy}
                                        onSave={onCategorize}
                                        transaction={transaction}
                                    />
                                ))}
                            </Box>

                            <Pagination
                                currentPage={currentPage}
                                itemCount={reviewQueue.length}
                                onPageChange={onPageChange}
                                onPageSizeChange={onPageSizeChange}
                                pageCount={pageCount}
                                pageSize={pageSize}
                            />
                        </>
                    )}
                </Paper>
            </Box>
        </section>
    )
}