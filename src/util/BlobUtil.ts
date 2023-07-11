export class BlobUtil {
    static async download(url: string) {
        try {
            const res = await window.fetch(url)
            return await res.blob()
        } catch (error) {
            return null
        }
    }
}