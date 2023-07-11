import { MjImage } from '@/type';
import { BlobUtil } from '@/util/BlobUtil';
import Dexie, { Table } from 'dexie';

export interface Friend {
    // id?: number;
    name: string;
    age: number;
}



export class MySubClassedDexie extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case
    friends!: Table<Friend, string>;
    mjImage!: Table<MjImage, string>

    constructor() {
        super('arthold');
        this.version(4).stores({
            friends: 'name, age', // Primary key and indexed props
            mjImage: 'taskId'
        });
    }
}

export const db = new MySubClassedDexie();

export const DbUtil = {
    mjImage: {
        add: async function (taskId: string, imageUrl: string) {
            const image = await BlobUtil.download(imageUrl)
            if (!image) {
                return undefined;
            }
            await db.mjImage.add({
                taskId,
                image
            })
            return image
        },
        findById:async function (taskId: string) {
            return await db.mjImage.get(taskId);
        }
    }
}



