'use client'

export default function ContentSlideshow({content, playlist}) {

    const slideButtonClicked = (left, e) => {
        e.preventDefault();
        let elem
        if(left) {
            console.log(`Sending you to #${playlist}_${0}`)
            elem = document.querySelector(`#${playlist}_${0}`)
        } else {
            console.log(`Sending you to #${playlist}_${9}`)
            elem = document.querySelector(`#${playlist}_${9}`)
        }
        document.querySelector(`#${playlist}`).scrollTo({
            left: elem.getBoundingClientRect().left,
            behavior: "smooth"
        })
    }

    return (
        <div className='contentSlideshow'>
            <img className="contentSlideArrowLeft" src="/chev-left.svg" onClick={(e) => {slideButtonClicked(true, e)}}></img>
            <img className="contentSlideArrowRight" src="/chev-right.svg" onClick={(e) => {slideButtonClicked(false, e)}}></img>
            <div className="contentSlideshowContents" id={playlist}>
                {content}
            </div>
        </div>
    )
}