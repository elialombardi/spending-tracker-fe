import Paper from '@mui/material/Paper'
import TagManager from '../components/pages/TagManager'

export default function TagsPage({ canWrite, tags, locations, onRenameTag, onDeleteTag, onCreateTag, onToggleLocationTag, onUpdateLocation }) {
    return (
        <Paper sx={{ p: 2 }}>
            <TagManager
                canWrite={canWrite}
                tags={tags}
                locations={locations}
                onRenameTag={onRenameTag}
                onDeleteTag={onDeleteTag}
                onCreateTag={onCreateTag}
                onToggleLocationTag={onToggleLocationTag}
                onUpdateLocation={onUpdateLocation}
            />
        </Paper>
    )
}
