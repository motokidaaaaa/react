// src/find.js
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function FindUserPage() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCol = collection(db, 'repo');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
      setFilteredUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const kw = e.target.value;
    setKeyword(kw);

    const filtered = users.filter(user =>
      (user.report || '').toLowerCase().includes(kw.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-bold mb-4">レポート検索ページ</h2>
      <input
        type="text"
        placeholder="レポートで検索"
        value={keyword}
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <ul className="space-y-2">
        {filteredUsers.map(user => (
          <li key={user.id} className="bg-white p-4 rounded shadow">
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Report:</strong> {user.report || '（なし）'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FindUserPage;
