// add.js
import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';

function AddUser() {
  const [customId, setCustomId] = useState('');
  const [report, setReport] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customId || !report) {
      alert('IDとReportの両方を入力してください');
      return;
    }

    try {
      await setDoc(doc(db, 'repo', customId), {
        id: customId,
        report: report,
      });
      alert('レポートを追加しました');
      navigate('/');
    } catch (error) {
      alert('追加に失敗しました: ' + error.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">IDとレポートを入力</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">ID：</label>
          <input
            className="border p-2 w-full"
            value={customId}
            onChange={(e) => setCustomId(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block">Report：</label>
          <input
            className="border p-2 w-full"
            value={report}
            onChange={(e) => setReport(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          追加
        </button>
      </form>
    </div>
  );
}

export default AddUser;
