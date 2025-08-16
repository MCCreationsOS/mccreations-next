

export default async function ClientLayout(props: {params: Promise<{locale: string}>, children: React.ReactElement<any>}) {
    const params = await props.params;

    const {
        locale
    } = params;

    const {
        children
    } = props;

    return (
        <>
            {children}
        </>
    )
}