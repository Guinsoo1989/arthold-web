import { db } from "@/service/db";
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

function AddFriendForm({ defaultAge } = { defaultAge: 21 }) {
    const [name, setName] = useState("");
    const [age, setAge] = useState(defaultAge);
    const [status, setStatus] = useState("");

    async function addFriend() {
        try {

            // Add the new friend!
            const id = await db.friends.add({
                name,
                age
            });

            setStatus(`Friend ${name} successfully added. Got id ${id}`);
            setName("");
            setAge(defaultAge);

        } catch (error) {
            setStatus(`Failed to add ${name}: ${error}`);
        }
    }

    return <>
        <p>
            {status}
        </p>
        Name:
        <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
        />
        Age:
        <input
            type="number"
            value={age}
            onChange={ev => setAge(Number(ev.target.value))}
        />

        <button onClick={addFriend}>
            add-btn
        </button>

        <button onClick={async ()=>{
            const res = await db.friends.get("a")
            console.log(666, res)
        }}>
            test-btn
        </button>
    </>
}


function FriendList({ minAge = 0, maxAge = 200 }) {
    const friends = useLiveQuery(
        async () => {
            //
            // Query Dexie's API
            //
            const friends = await db.friends
                .where('age')
                .between(minAge, maxAge)
                .toArray();

            // Return result
            return friends;
        },
        // specify vars that affect query:
        [minAge, maxAge]
    );

    return <ul>
        {friends?.map(friend => <li key={friend.name}>
            {friend.name}, {friend.age}
        </li>)}
    </ul>;
}

export default function FriendPage() {
    return (
        <>

            <h1>My simple Dexie app</h1>

            <h2>Add Friend</h2>
            <AddFriendForm defaultAge={21} />


            <h2>Friend List</h2>
            <FriendList minAge={18} maxAge={65} />

        </>
    )
}