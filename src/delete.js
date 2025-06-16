// src/delete.js
import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

function DeleteUser() {
  const [users, setUsers] = useState([]);

  // repo コレクションから取得
  const fetchUsers = async () => {
    const usersCol = collection(db, 'repo');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(userList);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ユーザー削除処理
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm('本当に削除しますか？');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'repo', id));
      alert('削除しました');
      fetchUsers();
    } catch (error) {
      alert('削除に失敗しました: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">レポート削除ページ</h2>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Report:</strong> {user.report || '（なし）'}</p>
            </div>
            <button
              onClick={() => deleteUser(user.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DeleteUser;
