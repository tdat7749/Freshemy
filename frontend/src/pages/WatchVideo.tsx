import React, { useEffect , useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { courseActions } from '../redux/slice'
import NotFound from './NotFound'
import { CourseDetail as CourseDetailType } from '../types/course'
import VideoJS from '../components/VideoJS'
// import { VideoJsOptions } from '../types/video'
const WatchVideo:React.FC = () => {

    const [isNotFound,setIsNotFound] = useState<boolean>(false)
    const isLoading = useAppSelector(state => state.courseSlice.isLoading)
    const courseDetail:CourseDetailType = useAppSelector(state => state.courseSlice.courseDetail)

    const dispatch = useAppDispatch()

    const {slug} = useParams()


    useEffect(() =>{
        //@ts-ignore
        dispatch(courseActions.getCourseDetail(slug)).then(response =>{
            if(response.payload.status_code !== 200){
                setIsNotFound(true)
            }
        })

    },[dispatch,slug])

    if(isLoading) return (
        <h1 className='text-center text-4xl'>Loading...</h1>
    )

    if(isNotFound) return <NotFound />

    return (
        <>
            <div className='container mx-auto mt-[100px]'>
                <div className='mt-[16px]'>
                    <div className='w-full h-[130px] p-[16px] bg-error rounded-[8px]'>
                        <h2 className='text-black text-[40px] '>{courseDetail.title}</h2>
                        <h3 className='text-[32px]'>Author: <span className='underline'>{courseDetail.author.first_name} {courseDetail.author.last_name}</span></h3>
                    </div>
                </div>
                <div>
                    <VideoJS sourse={`http//:localhost:3000/public/public/Bi-ngan-djozz/main.m3u8`} />
                </div>
            </div>
        </>
    )
}

export default WatchVideo