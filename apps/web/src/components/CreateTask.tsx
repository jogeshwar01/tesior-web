import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config.ts";

export const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [contact, setContact] = useState("");
  const [proof, setProof] = useState("");
  const [signature, setSignature] = useState("");
  const [amount, setAmount] = useState(0);

  async function createTask() {
    await axios.post(
      `${BACKEND_URL}/v1/user/task`,
      {
        title,
        contact,
        proof,
        signature,
        amount,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    setTitle("");
    setContact("");
    setProof("");
    setSignature("");
    setAmount(0);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Contact"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />
      <input
        type="text"
        placeholder="Proof"
        value={proof}
        onChange={(e) => setProof(e.target.value)}
      />
      <input
        type="text"
        placeholder="Signature"
        value={signature}
        onChange={(e) => setSignature(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button onClick={createTask}>Create Task</button>
    </div>
  );
};
