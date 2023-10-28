'use client'

export default function ContentSlideshow({content}) {

    const slideButtonClicked = (left, target) => {
        e.preventDefault();
        // const href=
    }

    return (
        <div className='contentSlideshow'>
            <img className="contentSlideArrowLeft" src="/chev-left.svg" onClick={(e) => {slideButtonClicked(true, e)}}></img>
            <img className="contentSlideArrowRight" src="/chev-right.svg" onClick={(e) => {slideButtonClicked(false, e)}}></img>
            <div className="contentSlideshowContents">
                {content}
            </div>
        </div>
    )
}