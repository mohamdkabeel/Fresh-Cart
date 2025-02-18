import React, { useEffect } from 'react'
import ShowComponent from '../ShowCompnent/ShowComponent'
import CategoriesSlider from '../CategoriesSlider/CategoriesSlider'
import MainSlider from '../MainSlider/MainSlider'

export default function Home() {
    useEffect(() => {
        document.title = 'Home'
    }, [])

    return <>
        <MainSlider />
        <CategoriesSlider />
        <ShowComponent />
    </>
}
