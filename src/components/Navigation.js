// src/components/Navigation.js
import { Link } from 'react-router-dom';
import {
  FcManager,
  FcFullTrash,
  FcDataRecovery,
  FcSearch,
} from 'react-icons/fc'; // アイコン拡張可能

const menuItems = [
  { path: '/', label: '一覧', icon: <FcManager /> },
  { path: '/add', label: 'レポートを追加', icon: <FcDataRecovery /> },
  { path: '/delete', label: 'レポートを削除', icon: <FcFullTrash /> },
  { path: '/find', label: '検索', icon: <FcSearch /> },
];

function Navigation() {
  return (
    <nav className="bg-gray-100 pt-6 text-center space-x-4">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="inline-flex items-center space-x-1 hover:underline text-gray-700"
        >
          <span className="text-xl">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default Navigation;
