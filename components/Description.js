function resolveDescription(node, index) {
    let children = [];
    if(node.content && node.content.length > 0) {
        for(let i = 0 ; i < node.content.length; i++) {
            children.push(resolveDescription(node.content[i], i))
        }
    }

    if(node.nodeType == 'document') {
        return (
            <div>
                {children}
            </div>
        )
    } else if(node.nodeType == 'paragraph') {
        return (
            <p>
                {children}
            </p>
        )
    } else if(node.nodeType == 'unordered-list') {
        return (
            <ul>
                {children}
            </ul>
        )
    } else if(node.nodeType == 'list-item') {
        return (
            <li key={index}>
                {children}
            </li>
        )
    } else if(node.nodeType == 'heading-1') {
        return (
            <h1>
                {children}
            </h1>
        )
    } else if(node.nodeType == 'heading-2') {
        return (
            <h2>
                {children}
            </h2>
        )
    } else if(node.nodeType == 'heading-3') {
        return (
            <h3>
                {children}
            </h3>
        )
    } else if(node.nodeType == 'heading-4') {
        return (
            <h4>
                {children}
            </h4>
        )
    } else if(node.nodeType == 'heading-5') {
        return (
            <h5>
                {children}
            </h5>
        )
    } else if(node.nodeType == 'heading-6') {
        return (
            <h6>
                {children}
            </h6>
        )
    } else if(node.nodeType == 'hyperlink') {
        return (
            <a href={node.data.uri}>
                {children}
            </a>
        )
    } else if(node.nodeType == 'text') {
        if(!node.marks) {
            return (
                <>
                    {node.value}
                </>
            )
        }

        if(node.marks.type == 'bold') {
            return (
                <strong>
                    {node.value}
                </strong>
            )
        } else if(node.marks.type == 'underline') {
            return (
                <em>
                    {node.value}
                </em>
            )
        } else {
            return (
                <>
                    {node.value}
                </>
            )
        }
    }
}

export default function Description({description}) {
    return (
        {resolveDescription(description)}
    )
}