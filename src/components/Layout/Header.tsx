import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        MyPortfolio
      </Link>
      <nav className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-500">
          홈
        </Link>
        <Link to="/portfolio" className="text-gray-700 hover:text-blue-500">
          포트폴리오
        </Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-500">
          로그인
        </Link>
      </nav>
    </header>
  );
};

export default Header;
