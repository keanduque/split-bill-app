import { useState } from "react";

const initialFriends = [
    {
        id: 118836,
        name: "Clark",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: -7,
    },
    {
        id: 933372,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 20,
    },
    {
        id: 499476,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0,
    },
];

function Button({ children, onClickHandle }) {
    return (
        <button className="button" onClick={onClickHandle}>
            {children}
        </button>
    );
}

const App = () => {
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [friends, setFriends] = useState(initialFriends);
    const [selectedFriend, setSelectedFriend] = useState(null);

    function handleShowAddFriend() {
        setShowAddFriend((show) => !show);
    }
    function handleAddFriend(newFriend) {
        setFriends((friends) => [...friends, newFriend]);
        setShowAddFriend(false);
    }
    function handleSelectedFriend(friend) {
        setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
        setShowAddFriend(false);
    }
    function handleSplitBill(value) {
        console.log(value);
        setFriends((friends) =>
            friends.map((friend) =>
                friend.id === selectedFriend.id
                    ? { ...friend, balance: friend.balance + value }
                    : friend
            )
        );
        setSelectedFriend(null);
    }

    return (
        <div className="app">
            <div className="sidebar">
                <FriendList
                    friends={friends}
                    selectedFriend={selectedFriend}
                    onSelectedFriend={handleSelectedFriend}
                />
                {showAddFriend && (
                    <FormAddFriend onAddFriend={handleAddFriend} />
                )}
                <Button onClickHandle={handleShowAddFriend}>
                    {showAddFriend ? "Close" : "Add friend"}
                </Button>
            </div>
            {selectedFriend && (
                <FormSplitBill
                    selectedFriend={selectedFriend}
                    onSplitBill={handleSplitBill}
                />
            )}
        </div>
    );
};
export default App;

function FriendList({ friends, selectedFriend, onSelectedFriend }) {
    return (
        <ul>
            {friends.map((friend) => (
                <Friend
                    friend={friend}
                    key={friend.id}
                    selectedFriend={selectedFriend}
                    onSelectedFriend={onSelectedFriend}
                />
            ))}
        </ul>
    );
}

function Friend({ friend, selectedFriend, onSelectedFriend }) {
    // console.log(selectedFriend.id);\

    const isSelected = selectedFriend?.id === friend.id;

    return (
        <li className={isSelected ? "selected" : ""}>
            <img src={friend.image} alt={friend.name} />
            <h3>{friend.name}</h3>

            {friend.balance < 0 && (
                <p className="red">
                    You owe {friend.name} {Math.abs(friend.balance)}€
                </p>
            )}
            {friend.balance > 0 && (
                <p className="green">
                    {friend.name} owes you {Math.abs(friend.balance)}€
                </p>
            )}
            {friend.balance === 0 && <p>You and {friend.name} are even</p>}

            <Button onClickHandle={() => onSelectedFriend(friend)}>
                {isSelected ? "Close" : "Select"}
            </Button>
        </li>
    );
}

function FormAddFriend({ onAddFriend }) {
    const [name, setName] = useState("");
    const [imgURL, setImgURL] = useState("https://i.pravatar.cc/48");

    function handleAdd(e) {
        e.preventDefault();

        if (!name || !imgURL) return;

        const id = crypto.randomUUID();
        const newFriend = {
            id,
            name,
            image: `${imgURL}?=${id}`,
            balance: 0,
        };

        onAddFriend(newFriend);

        setName("");
        setImgURL("https://i.pravatar.cc/48");
    }

    return (
        <form className="form-add-friend" onSubmit={handleAdd}>
            <label>🧑‍🤝‍🧑Friend name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label>🖼️Image URL</label>
            <input
                type="text"
                value={imgURL}
                onChange={(e) => setImgURL(e.target.value)}
            />
            <Button>Add</Button>
        </form>
    );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
    const [bill, setBill] = useState("");
    const [paidByUser, setPaidByUser] = useState("");
    const paidByFriend = bill ? bill - paidByUser : "";
    const [whoIsPaying, setWhoIsPaying] = useState("user");

    function handleSubmit(e) {
        e.preventDefault();

        if (!bill || !paidByFriend) return;

        onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
    }

    return (
        <form className="form-split-bill" onSubmit={handleSubmit}>
            <h2>Split a bill with {selectedFriend.name}</h2>

            <label>💰Bill value </label>
            <input
                type="text"
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
            />

            <label>🕴️Your expense</label>
            <input
                type="text"
                value={paidByUser}
                onChange={(e) =>
                    setPaidByUser(
                        Number(e.target.value) > bill
                            ? bill
                            : Number(e.target.value)
                    )
                }
            />

            <label>🧑‍🤝‍🧑{selectedFriend.name}'s expense</label>
            <input type="text" disabled value={paidByFriend} />

            <label>🤑Who is paying the bill?</label>
            <select
                value={whoIsPaying}
                onChange={(e) => setWhoIsPaying(e.target.value)}
            >
                <option value="user">You</option>
                <option value="friend">{selectedFriend.name}</option>
            </select>

            <Button>Split Bill</Button>
        </form>
    );
}
