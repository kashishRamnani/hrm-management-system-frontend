import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import password from "../../utils/password";

const PasswordUpdate = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");

  const { user } = useAuth();
  const token = user?.token;

  if (!token) {
    console.error("Token is missing.");
    setMessage("Authentication token is missing.");
    return;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !newPasswordConfirmation) {
      setMessage("All fields are required.");
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    const data = {
      current_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    };

    password.update(data, token, { message: setMessage });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Update Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Old Password"
          className="w-full p-2 mb-2 border rounded"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 mb-2 border rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full p-2 mb-2 border rounded"
          value={newPasswordConfirmation}
          onChange={(e) => setNewPasswordConfirmation(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-black w-full p-2 rounded hover:bg-blue-700"
        >
          Update Password
        </button>
      </form>
      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
};

export default PasswordUpdate;
