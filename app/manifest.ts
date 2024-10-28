export default function manifest() {
    return {
        name: "MCCreations",
        short_name: "MCCreations",
        description: "Minecraft Creations and Community",
        display: "standalone",
        start_url: "/",
        theme_color: "#171717",
        background_color: "#171717",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "32x32",
                type: "image/png"
            }
        ]
    }
}