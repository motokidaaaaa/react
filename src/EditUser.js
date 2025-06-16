// EditUser.js
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

function EditUser() {
  const { id } = useParams(); // URLからID取得
  const navigate = useNavigate();
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const docRef = doc(db, 'repo', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReport(docSnap.data().report || '');
        } else {
          alert('データが見つかりませんでした');
          navigate('/');
        }
      } catch (error) {
        console.error('取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'repo', id);
      await updateDoc(docRef, { report });
      alert('レポートを更新しました');
      navigate('/');
    } catch (error) {
      console.error('更新エラー:', error);
    }
  };

  if (loading) return <p className="p-4">読み込み中...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">レポート編集</h2>
      <textarea
        className="w-full p-2 border border-gray-400 rounded mb-4"
        rows={6}
        value={report}
        onChange={(e) => setReport(e.target.value)}
      />
      <button
        onClick={handleUpdate}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        更新
      </button>
    </div>
  );
}

export default EditUser;
