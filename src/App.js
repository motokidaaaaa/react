// App.js
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import AddUser from './add';
import DeleteUser from './delete';
import FindUser from './find';
import EditUser from './EditUser';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function AppContent() {
  const [user, setUser] = useState(null);
  const [dbUsers, setDbUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');  // ← 新しく検索語句を保持
  const location = useLocation();

  // Firestoreからデータ取得
  const fetchUsers = async () => {
    const usersCol = collection(db, 'repo');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDbUsers(userList);
  };

  // userが変わった or 画面遷移したらデータを再取得
  useEffect(() => {
    if (user) fetchUsers();
    else setDbUsers([]);
  }, [user, location.pathname]);

  // Firebaseログイン処理
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

  // Firebaseログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  // ログイン状態監視。ユーザーの変更があればuserをセット
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 削除処理
  const deleteUser = async (id) => {
    if (!window.confirm('本当に削除しますか？')) return;

    try {
      await deleteDoc(doc(db, 'repo', id));
      alert('削除しました');
      fetchUsers();
    } catch (error) {
      alert('削除に失敗しました: ' + error.message);
    }
  };

  // 検索条件に合うレポートだけフィルターする
  const filteredUsers = dbUsers.filter(
    (item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.report && item.report.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Navigation />
      <div className="p-4 flex justify-end bg-blue-100">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">こんにちは、{user.displayName} さん</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Googleでログイン
          </button>
        )}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="p-6 bg-blue-50 min-h-screen">
              <h1 className="text-2xl font-semibold mb-4 text-gray-800">レポート一覧</h1>

              {/* ← ここから検索バーを追加 */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="IDまたはReportで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                <thead className="bg-blue-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold border-b border-blue-300">ID</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold border-b border-blue-300">Report</th>
                  </tr>
                </thead>
                <tbody>
                  {user ? (
                    filteredUsers.length > 0 ? (
                      filteredUsers.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                          <td className="px-6 py-4 align-top text-gray-700 font-mono">{item.id}</td>
                          <td className="px-6 py-4 flex justify-between items-center">
                            <div
                              className="max-w-[70%] text-gray-800 truncate"
                              title={item.report || '（なし）'}
                            >
                              {item.report || '（なし）'}
                            </div>
                            <div className="flex gap-3">
                              <a
                                href={`/edit/${item.id}`}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition"
                              >
                                編集
                              </a>
                              <button
                                onClick={() => deleteUser(item.id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition"
                              >
                                削除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="py-8 text-center text-gray-500 italic">
                          条件に合うデータがありません。
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-gray-500 italic">
                        ログインするとデータが表示されます。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          }
        />

        {user ? (
          <>
            <Route path="/add" element={<AddUser />} />
            <Route path="/delete" element={<DeleteUser />} />
            <Route path="/find" element={<FindUser />} />
            <Route path="/edit/:id" element={<EditUser />} />
          </>
        ) : (
          <>
            <Route path="/add" element={<p className="p-6 text-center text-gray-600">ログインしてください</p>} />
            <Route path="/delete" element={<p className="p-6 text-center text-gray-600">ログインしてください</p>} />
            <Route path="/find" element={<p className="p-6 text-center text-gray-600">ログインしてください</p>} />
            <Route path="/edit/:id" element={<p className="p-6 text-center text-gray-600">ログインしてください</p>} />
          </>
        )}
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
