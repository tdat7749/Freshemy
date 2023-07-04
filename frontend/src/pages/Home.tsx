import React,{FC} from 'react'
import Header from '../components/Header'

const Home:FC = () =>{

    const adb:string = "a"

    return(
        <>
        <Header/>
           <h1 className='text-3xl font-bold underline text-orange-300'>Hello</h1>
        </>
    )
}

export default Home