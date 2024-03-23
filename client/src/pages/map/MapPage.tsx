import Filter from '@/components/map/Filter'
import { Paper } from '@mui/material'
import { MapApi } from '@/pages/map/services/MapApi'

const MapPage = () => {
    const { data: HTML } = MapApi.useGetCustomViewMutation("")

    console.log(HTML)
    return (
        <main className='h-screen p-4 max-w-[1900px] mx-auto'>
            <div className='relative h-full'>
                <Filter />
                <Paper className='h-full w-full bg-red-300' dangerouslySetInnerHTML={{ __html: HTML }}>
                    {/* Контент будет вставлен сюда */}
                </Paper>
            </div>
        </main>
    )
}

export default MapPage
