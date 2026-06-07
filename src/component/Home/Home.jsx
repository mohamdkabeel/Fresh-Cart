import ShowComponent from '../ShowCompnent/ShowComponent'
import CategoriesSlider from '../CategoriesSlider/CategoriesSlider'
import MainSlider from '../MainSlider/MainSlider'
import { usePageTitle } from '../../Hooks/usePageTitle'

export default function Home() {
    usePageTitle('Home');

    return <>
        <MainSlider />
        <CategoriesSlider />
        <ShowComponent />
    </>
}
