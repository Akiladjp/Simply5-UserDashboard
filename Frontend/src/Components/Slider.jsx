
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

import slide1 from '../assets/Banner/1.jpg'
import slide2 from '../assets/Banner/2.jpg'
import slide3 from '../assets/Banner/3.jpg'
import slide4 from '../assets/Banner/4.jpg'


// 
const slideImages = [
  {
    url: slide1,
    caption: 'Slide 1'
  },
  {
    url: slide2,
    caption: 'Slide 2'
  },
  {
    url: slide3,
    caption: 'Slide 3'
  },
  {
    url: slide4,
    caption: 'Slide 4'
  }
];


export default function Slider() {
  //const buttonState = useSelector(selectButtonState);

  
  return (
    <div className="object-cover ">
        <Slide>
         {slideImages.map((slideImage, index)=> (
            <div key={index}>
              <img src={slideImage.url} alt="" />
              {/* <div className='flex items-center justify-center object-cover h-[200px] bg-no-repeat bg-center  ' style={{  'backgroundImage': `url(${slideImage.url})` }}> */}
                {/* <span className='p-[20px] bg-customYellow text-black'>{slideImage.caption}</span> */}
              {/* </div> */}
            </div>
          ))} 
        </Slide>
      </div>
  )
}
