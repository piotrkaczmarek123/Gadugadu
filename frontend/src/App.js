import React, {useEffect, useState} from 'react';
import axios from "axios";
import {API_URL} from "./constants";

//Git test

function App() {

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({note_text: "", username: ""});

    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({pk: null, username: "", password: ""});
    const [selectedUser, setSelectedUser] = useState({pk: null, username: "", password: ""});
    const [loginData, setLoginData] = useState({pk: null, username: "", password: "" });

    const onUserChange = e => {
        const {name, value} = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const onNoteChange = e => {
        const {name, value} = e.target;
        setNewNote((prevNote) => ({
            ...prevNote,
            [name]: value
        }));
    }

    const onLoginChange = e => {
        const { name, value } = e.target;
        setLoginData(prevLoginData => ({
            ...prevLoginData,
            [name]: value,
        }));
    };

    const onUserSelect = e => {
        const name = e;
        const user = users.find(user => user.username === name);
        setSelectedUser(user);
        onNoteChange({target: {name: "username", value: user.username}});
    }

    const addNote = () => {
        if (newNote.note_text.trim() !== '' && newNote.username.trim() !== '') {
            console.log("text: " + newNote.note_text + ", username: " + newNote.username + ", owner: " + selectedUser.pk);
            axios.post(API_URL + "create-note", {"note_text": newNote.note_text, "owner": selectedUser.pk});
            setNotes([...notes, newNote]);
            setNewNote({note_text: "", username: newNote.username});
        }
    };

    const addUser = () => {
        if (newUser.username.trim() !== '' && newUser.password.trim() !== '') {
            axios.post(API_URL + "create-user", newUser);
            setUsers([...users, newUser]);
            setNewUser({username: "", password: ""});
        }
    };

    const loginUser = () => {
        if (loginData.username.trim() !== '' && loginData.password.trim() !== '') {
            axios.post(API_URL + "login-user", loginData)
                .then(response => {
                    console.log("Login succesfully:", response.data);
                })
                .catch(error => {
                    console.error("Login failed:", error.response.data);
                });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get(API_URL + "users");
                const notesResponse = await axios.get(API_URL + "notes");

                // Assuming both requests were successful
                const usersData = usersResponse.data;
                const notesData = notesResponse.data;

                const notesWithUsernames = notesData.map((note) => {
                    const user = usersData.find((user) => user.pk === note.owner);
                    return {...note, username: user.username};
                });

                setUsers(usersData);
                setNotes(notesWithUsernames);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Notes App</h1>
            <h2>Sign up</h2>
            <div>
                <input
                    type="text"
                    placeholder="username"
                    name="username"
                    value={newUser.username}
                    onChange={(e) => onUserChange(e)}
                />
                <input
                    type="password"
                    placeholder="password"
                    name="password"
                    value={newUser.password}
                    onChange={(e) => onUserChange(e)}
                />
                <button onClick={addUser}>Add</button>
            </div>
            <h2>Sign in</h2>
            <div>
                <input
                    type="text"
                    placeholder="login"
                    name="username"
                    value={loginData.username}
                    onChange={(e) => onLoginChange(e)}
                />
                <input
                    type="password"
                    placeholder="password"
                    name="password"
                    value={loginData.password}
                    onChange={(e) => onLoginChange(e)}
                />
                <button onClick={loginUser}>Log in</button>
            </div>
        
            <h2>Add note</h2>
            <div>
                <input
                    type="text"
                    placeholder="Add a new note"
                    name="note_text"
                    value={newNote.note_text}
                    onChange={(e) => onNoteChange(e)}
                />
                <select value={selectedUser.username} onChange={(e) => onUserSelect(e.target.value)}>
                    <option value="">Select User</option>
                    {users.map((user, index) => (
                        <option key={index} value={user.username}>
                            {user.username}
                        </option>
                    ))}
                </select>
                <button onClick={addNote}>Add</button>
            </div>
            <h3>Notes</h3>
            <ul>
                {notes.map((note, index) => (
                    <li key={index}>
                        <div>
                            <span>Username: </span>
                            {note.username}
                            <br/>
                            <span>Note: </span>
                            {note.note_text}
                        </div>
                    </li>
                ))}
            </ul>
            <h3>Users</h3>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        <div>
                            <span>Username: </span>
                            {user.username}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
