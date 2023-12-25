'use client'

export default function ContentSlideshow({content, playlist}: {content: any, playlist: string}) {

    const slideButtonClicked = (left: boolean, e: any) => {
        e.preventDefault();
        let elem
        if(left) {
            elem = document.querySelector(`#${playlist}_${0}`)
        } else {
            elem = document.querySelector(`#${playlist}_${9}`)
        }
        document.querySelector(`#${playlist}`)?.scrollTo({
            left: elem?.getBoundingClientRect().left,
            behavior: "smooth"
        })
    }

    return (
        <div className='carousel'>
            <img className="nav_arrow left" src="/chev-left.svg" onClick={(e) => {slideButtonClicked(true, e)}}></img>
            <img className="nav_arrow right" src="/chev-right.svg" onClick={(e) => {slideButtonClicked(false, e)}}></img>
            <div className="scroll_window" id={playlist}>
                {content}
            </div>
        </div>
    )
}