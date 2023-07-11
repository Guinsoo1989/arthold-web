export class ObjUtil {
    static copyProperties(source: any, target: any) {
        for (const key of Object.keys(source)) {
            target[key] = source[key]
          }
    }
}