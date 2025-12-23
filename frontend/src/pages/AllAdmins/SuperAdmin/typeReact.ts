import React, { useState } from "react";
import { createUser } from "../services/api";

const UserForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser({ name, email, password });
    setName("");
    setEmail("");
    setPassword("");
  };

  export const createUser = async (userData: Omit<User, "id">): Promise<User> => {
  const response = await axios.post<User>(API_URL, userData);
  return response.data;
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  const response = await axios.put<User>(`${API_URL}/${id}`, userData);
  return response.data;
};

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      </div>
      <button type="submit">Add User</button>
    </form>
  );
};

export default UserForm;
